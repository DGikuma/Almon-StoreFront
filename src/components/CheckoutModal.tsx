"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Textarea } from "@heroui/react";
import axios from "axios";

interface CartItem {
  id: string;
  productId?: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  cartItems: CartItem[];
  productSaleType: Record<string, "roll" | "metre" | "board" | "unit">;
  storeId?: string;
  onOrderSubmit?: (orderData: any) => Promise<{ sale_id?: string } | void>;
}

// Map variant names to API unit format
const mapVariantToUnit = (variant: string, saleType: "roll" | "metre" | "board" | "unit"): string => {
  const variantLower = variant.toLowerCase();
  if (variantLower.includes("roll")) return "roll";
  if (variantLower.includes("metre") || variantLower.includes("meter")) return "meter";
  if (variantLower.includes("board") || variantLower.includes("sheet")) return "pcs";
  if (variantLower.includes("unit") || variantLower.includes("pcs")) return "pcs";

  switch (saleType) {
    case "roll": return "roll";
    case "metre": return "meter";
    case "board": return "pcs";
    case "unit": return "pcs";
    default: return "pcs";
  }
};

// Extract product ID from cart item ID
const extractProductId = (cartItemId: string, variant: string): string => {
  const variantLower = variant.toLowerCase();
  const idLower = cartItemId.toLowerCase();

  if (idLower.endsWith(`-${variantLower}`)) {
    return cartItemId.slice(0, -(variantLower.length + 1));
  }

  const lastIndex = idLower.lastIndexOf(`-${variantLower}`);
  if (lastIndex !== -1) {
    return cartItemId.slice(0, lastIndex);
  }

  return cartItemId;
};

// Helper function to ensure sale_id starts with "SAL"
const normalizeSaleId = (saleId: string | null | undefined): string | null => {
  if (!saleId) return null;

  if (saleId.toUpperCase().startsWith('SAL')) {
    return saleId.toUpperCase();
  }

  if (/^\d+$/.test(saleId)) {
    return `SAL${saleId.padStart(6, '0')}`;
  }

  return `SAL${saleId}`;
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  total,
  cartItems,
  productSaleType,
  storeId = "almon-products",
  onOrderSubmit
}) => {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const formatOrderData = () => {
    const products = cartItems.map((item) => {
      let productId = item.productId || extractProductId(item.id, item.variant);
      if (productId && typeof productId === 'string') {
        productId = productId.toUpperCase();
      }
      const saleType = productSaleType[productId] || "unit";
      const unit = mapVariantToUnit(item.variant, saleType);

      return {
        product_id: productId,
        quantity: item.quantity,
        unit: unit,
      };
    });

    return {
      store_id: storeId || "almon-products",
      products: products,
      delivery: {
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        recipient_email: recipientEmail || "",
        delivery_address: deliveryAddress,
      },
      payment_method: paymentMethod,
      phone_number: phoneNumber,
      customer_name: customerName,
      total_amount: total,
    };
  };

  const handleSubmit = async () => {
    if (!customerName || !phoneNumber || !recipientName || !recipientPhone || !deliveryAddress) {
      setStatus("Please fill in all required fields.");
      return;
    }

    if (cartItems.length === 0) {
      setStatus("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const orderData = formatOrderData();
      let saleId: string | null = null;

      // Step 1: Submit order
      if (onOrderSubmit) {
        const result = await onOrderSubmit(orderData);
        if (result && typeof result === 'object' && 'sale_id' in result) {
          saleId = normalizeSaleId(result.sale_id as string);
        }
        setStatus("Order submitted successfully!");
      } else {
        console.log("Submitting order:", JSON.stringify(orderData, null, 2));
        try {
          const orderRes = await axios.post("/customer/orders", orderData);
          const rawSaleId = orderRes.data?.sale_id || orderRes.data?.id || orderRes.data?.order_id || null;
          saleId = normalizeSaleId(rawSaleId);
          setStatus("Order submitted successfully!");
        } catch (orderError: any) {
          console.error("Order submission error details:", orderError.response?.data);
          if (orderError.response?.data?.message && Array.isArray(orderError.response.data.message)) {
            const errorMessages = orderError.response.data.message.join(", ");
            throw new Error(errorMessages);
          }
          throw orderError;
        }
      }

      // Step 2: Process payment with sale_id
      if (saleId) {
        try {
          const paymentRes = await axios.post(`localhost:8000/api/customer/order/${saleId}/pay`, {
            payment_method: paymentMethod,
            amount: total,
          });

          const paymentMessage = paymentRes.data?.message || "Payment processed successfully";
          setStatus((prev) => prev + " " + paymentMessage);

          // If payment method is M-Pesa, also initiate STK push
          if (paymentMethod === "mpesa") {
            try {
              const formattedPhone = phoneNumber.startsWith('0')
                ? `254${phoneNumber.substring(1)}`
                : phoneNumber.startsWith('+254')
                  ? phoneNumber.substring(1)
                  : phoneNumber;

              const stkRes = await axios.post("/api/stk", {
                phone: formattedPhone,
                amount: total,
                sale_id: saleId,
                account_reference: saleId
              });

              const stkMessage = (stkRes.data as { message?: string } | undefined)?.message;
              setStatus((prev) => prev + " " + (stkMessage ?? "Payment initiated. Check your phone."));
            } catch (error: any) {
              console.error("STK push error:", error.response?.data || error.message);
              setStatus((prev) => prev + " STK push failed. Please contact support.");
            }
          }
        } catch (error: any) {
          console.error("Payment error:", error.response?.data || error.message);
          setStatus((prev) => prev + " Payment processing failed. Please contact support.");
        }
      } else {
        console.warn("No sale ID received from order submission");
        setStatus((prev) => prev + " Warning: Sale ID not received. Please contact support.");
      }

      // If everything was successful, show success message and close modal after delay
      if (!status.includes("failed") && !status.includes("Warning")) {
        setTimeout(() => {
          onClose();
          // Reset form
          setCustomerName("");
          setPhoneNumber("");
          setRecipientName("");
          setRecipientPhone("");
          setRecipientEmail("");
          setDeliveryAddress("");
          setStatus("");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Order submission error:", error.response?.data || error.message);

      let errorMessage = "Order submission failed. Please try again.";
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message.join(", ");
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setStatus(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <ModalHeader className="text-xl font-bold text-gray-900 dark:text-white">
          Complete Your Purchase
        </ModalHeader>
        <ModalBody className="space-y-4">
          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
              <span>Total:</span>
              <span>KES {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Customer Information</h3>
            <Input
              label="Your Name"
              placeholder="Enter your full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              isRequired
            />
            <Input
              type="tel"
              label="Your Phone Number"
              placeholder="07XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              isRequired
              description="For M-Pesa payment and delivery updates"
            />
          </div>

          {/* Delivery Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Delivery Information</h3>
            <Input
              label="Recipient Name"
              placeholder="Enter recipient's full name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              isRequired
            />
            <Input
              type="tel"
              label="Recipient Phone"
              placeholder="07XXXXXXXX"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              isRequired
            />
            <Input
              type="email"
              label="Recipient Email"
              placeholder="recipient@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <Textarea
              label="Delivery Address"
              placeholder="Enter complete delivery address (Building, Street, Landmark)"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              isRequired
              minRows={2}
            />
          </div>

          {/* Payment Method - Fixed to M-Pesa */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              Payment Method: M-Pesa
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              You will receive an M-Pesa STK push notification to complete payment
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Order Reference: {`SAL${Date.now().toString().slice(-6)}`}
            </p>
          </div>

          {status && (
            <p
              className={`text-sm ${status.includes("failed") || status.includes("Error") || status.includes("Please") ? "text-red-500" : "text-green-600"
                }`}
            >
              {status}
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={loading}
            disabled={!customerName || !phoneNumber || !recipientName || !recipientPhone || !deliveryAddress || cartItems.length === 0}
          >
            {paymentMethod === "mpesa" ? "Place Order & Pay via STK" : "Place Order"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};