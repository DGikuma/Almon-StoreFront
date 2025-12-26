"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Select, SelectItem, Textarea } from "@heroui/react";
import axios from "axios";

const deliveryAreas: Record<string, number> = {
  "nairobi-cbd": 500,
  "westlands": 600,
  "kilimani": 600,
  "parklands": 600,
  "lavington": 700,
  "karen": 800,
  "runda": 800,
  "langata": 700,
  "kasarani": 700,
  "roysambu": 700,
  "ruiru": 800,
  "thika": 1000,
  "juja": 900,
  "kiambu": 800,
  "ruaka": 700,
  "rongai": 800,
  "ngong": 900,
  "kikuyu": 900,
  "westlands-area": 600,
  "other": 1000,
};

const formatAreaName = (key: string) => {
  return key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface CartItem {
  id: string;
  productId?: string; // Optional for backward compatibility
  name: string;
  variant: string;
  price: number;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryArea: string;
  onDeliveryAreaChange: (area: string) => void;
  cartItems: CartItem[];
  productSaleType: Record<string, "roll" | "metre" | "board" | "unit">;
  storeId?: string;
  onOrderSubmit?: (orderData: any) => Promise<{ sale_id?: string } | void>;
}

// Map variant names to API unit format (NestJS expects: pcs, meter, roll)
const mapVariantToUnit = (variant: string, saleType: "roll" | "metre" | "board" | "unit"): string => {
  const variantLower = variant.toLowerCase();
  if (variantLower.includes("roll")) return "roll";
  if (variantLower.includes("metre") || variantLower.includes("meter")) return "meter";
  if (variantLower.includes("board") || variantLower.includes("sheet")) return "pcs";
  if (variantLower.includes("unit") || variantLower.includes("pcs")) return "pcs";

  // Fallback to sale type - map to NestJS expected values
  switch (saleType) {
    case "roll": return "roll";
    case "metre": return "meter"; // Note: NestJS uses "meter" not "metre"
    case "board": return "pcs"; // Board/sheet maps to pcs
    case "unit": return "pcs";
    default: return "pcs";
  }
};

// Extract product ID from cart item ID (format: "product-id-variant")
// Variants are typically single words: "Roll", "Metre", "Board", "Unit"
const extractProductId = (cartItemId: string, variant: string): string => {
  // Remove the variant suffix from the cart item ID
  const variantLower = variant.toLowerCase();
  const idLower = cartItemId.toLowerCase();

  // Try to find and remove the variant at the end
  if (idLower.endsWith(`-${variantLower}`)) {
    return cartItemId.slice(0, -(variantLower.length + 1)); // +1 for the hyphen
  }

  // Fallback: split by last occurrence of variant
  const lastIndex = idLower.lastIndexOf(`-${variantLower}`);
  if (lastIndex !== -1) {
    return cartItemId.slice(0, lastIndex);
  }

  // If all else fails, return as is (shouldn't happen in normal flow)
  return cartItemId;
};

// Helper function to ensure sale_id starts with "SAL"
const normalizeSaleId = (saleId: string | null | undefined): string | null => {
  if (!saleId) return null;

  // If already starts with SAL, return as is
  if (saleId.toUpperCase().startsWith('SAL')) {
    return saleId.toUpperCase();
  }

  // If it's a numeric ID, add SAL prefix
  if (/^\d+$/.test(saleId)) {
    return `SAL${saleId.padStart(6, '0')}`; // Format: SAL000001, SAL000002, etc.
  }

  // Otherwise, just add SAL prefix
  return `SAL${saleId}`;
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  deliveryFee,
  total,
  deliveryArea,
  onDeliveryAreaChange,
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
  const [paymentMethod] = useState("mpesa"); // Fixed to M-Pesa only
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const formatOrderData = () => {
    const products = cartItems.map((item) => {
      // Use productId if available, otherwise extract from id
      // Backend expects uppercase product IDs like "PRD251100003"
      let productId = item.productId || extractProductId(item.id, item.variant);
      // Ensure product ID is uppercase (backend uses uppercase SKUs)
      if (productId && typeof productId === 'string') {
        productId = productId.toUpperCase();
      }
      const saleType = productSaleType[productId] || "unit";
      const unit = mapVariantToUnit(item.variant, saleType);

      return {
        product_id: productId,
        quantity: item.quantity,
        unit: unit, // NestJS expects lowercase "unit" with values: pcs, meter, roll
      };
    });

    // Build order payload - store_id is required by backend
    // Note: You may need to update the storeId prop with the correct store ID from your backend
    return {
      store_id: storeId || "almon-products", // Backend requires this, update with correct value
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
      delivery_area: deliveryArea, // Make sure to include delivery area
      delivery_fee: deliveryFee, // Include delivery fee
      total_amount: total, // Include total amount
    };
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!customerName || !phoneNumber || !recipientName || !recipientPhone || !deliveryAddress || !deliveryArea) {
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
        // If custom handler returns sale_id, use it
        if (result && typeof result === 'object' && 'sale_id' in result) {
          saleId = normalizeSaleId(result.sale_id as string);
        }
        setStatus("Order submitted successfully!");
      } else {
        // Submit to NestJS backend endpoint
        console.log("Submitting order:", JSON.stringify(orderData, null, 2)); // Debug log
        try {
          const orderRes = await axios.post("/customer/orders", orderData);

          // Extract and normalize sale_id from response
          const rawSaleId = orderRes.data?.sale_id || orderRes.data?.id || orderRes.data?.order_id || null;
          saleId = normalizeSaleId(rawSaleId);

          setStatus("Order submitted successfully!");
        } catch (orderError: any) {
          // Log detailed error for debugging
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
          // Update the payment endpoint to use the correct format
          const paymentRes = await axios.post(`localhost:8000/api/customer/order/${saleId}/pay`, {
            payment_method: paymentMethod,
            amount: total,
          });

          const paymentMessage = paymentRes.data?.message || "Payment processed successfully";
          setStatus((prev) => prev + " " + paymentMessage);

          // If payment method is M-Pesa, also initiate STK push
          if (paymentMethod === "mpesa") {
            try {
              // Ensure phone number has correct format (254XXXXXXXXX)
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

      // Handle validation errors array
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
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Subtotal:</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Delivery Fee:</span>
              <span className={deliveryFee > 0 ? "" : "text-gray-400"}>
                {deliveryFee > 0 ? `KES ${deliveryFee.toLocaleString()}` : "Select area"}
              </span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between font-semibold text-gray-900 dark:text-white">
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
            <Select
              label="Delivery Area"
              placeholder="Select your delivery area"
              selectedKeys={deliveryArea ? [deliveryArea] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                onDeliveryAreaChange(selected || "");
              }}
              className="w-full"
              isRequired
            >
              {Object.keys(deliveryAreas).map((area) => (
                <SelectItem key={area} textValue={`${formatAreaName(area)} - KES ${deliveryAreas[area].toLocaleString()}`}>
                  {formatAreaName(area)} - KES {deliveryAreas[area].toLocaleString()}
                </SelectItem>
              ))}
            </Select>
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
            disabled={!customerName || !phoneNumber || !recipientName || !recipientPhone || !deliveryAddress || !deliveryArea || cartItems.length === 0}
          >
            {paymentMethod === "mpesa" ? "Place Order & Pay via STK" : "Place Order"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};