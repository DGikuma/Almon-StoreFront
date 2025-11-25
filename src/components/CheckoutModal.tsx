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

// Map variant names to API unit format
const mapVariantToUnit = (variant: string, saleType: "roll" | "metre" | "board" | "unit"): string => {
  const variantLower = variant.toLowerCase();
  if (variantLower.includes("roll")) return "roll";
  if (variantLower.includes("metre")) return "metre";
  if (variantLower.includes("board")) return "board";
  if (variantLower.includes("unit")) return "pcs";
  
  // Fallback to sale type
  switch (saleType) {
    case "roll": return "roll";
    case "metre": return "metre";
    case "board": return "board";
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
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const formatOrderData = () => {
    const products = cartItems.map((item) => {
      // Use productId if available, otherwise extract from id
      const productId = item.productId || extractProductId(item.id, item.variant);
      const saleType = productSaleType[productId] || "unit";
      const unit = mapVariantToUnit(item.variant, saleType);
      
      return {
        product_id: productId,
        quantity: item.quantity,
        unit: unit,
      };
    });

    return {
      store_id: storeId,
      products: products,
      delivery: {
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        recipient_email: recipientEmail,
        delivery_address: deliveryAddress,
      },
      payment_method: paymentMethod,
      phone_number: phoneNumber,
      customer_name: customerName,
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
          saleId = result.sale_id as string;
        }
        setStatus("Order submitted successfully!");
      } else {
        // Submit to default API endpoint
        const orderRes = await axios.post("/api/orders", orderData);
        saleId = orderRes.data?.sale_id || null;
        setStatus("Order submitted successfully!");
      }

      // Step 2: Process payment with sale_id
      if (saleId) {
        try {
          const paymentRes = await axios.post("/api/payment", {
            sale_id: saleId,
            payment_method: paymentMethod,
          });

          const paymentMessage = paymentRes.data?.message || "Payment processed successfully";
          setStatus((prev) => prev + " " + paymentMessage);

          // If payment method is M-Pesa, also initiate STK push
          if (paymentMethod === "mpesa") {
            try {
              const stkRes = await axios.post("/api/stk", { phone: phoneNumber, amount: total });
              const stkMessage = (stkRes.data as { message?: string } | undefined)?.message;
              setStatus((prev) => prev + " " + (stkMessage ?? "Payment initiated. Check your phone."));
            } catch (error: any) {
              setStatus((prev) => prev + " STK push failed. Please contact support.");
            }
          }
        } catch (error: any) {
          setStatus((prev) => prev + " Payment processing failed. Please contact support.");
          console.error("Payment error:", error);
        }
      } else {
        setStatus((prev) => prev + " Warning: Sale ID not received. Please contact support.");
      }
    } catch (error: any) {
      setStatus(error.response?.data?.message || "Order submission failed. Please try again.");
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
                <SelectItem key={area}>
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
              placeholder="Enter complete delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              isRequired
              minRows={2}
            />
          </div>

          {/* Payment Method */}
          <Select
            label="Payment Method"
            selectedKeys={paymentMethod ? [paymentMethod] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setPaymentMethod(selected || "mpesa");
            }}
            className="w-full"
          >
            <SelectItem key="mpesa">M-Pesa</SelectItem>
            <SelectItem key="bank">Bank Transfer</SelectItem>
          </Select>

          {status && (
            <p
              className={`text-sm ${
                status.includes("failed") || status.includes("Please") ? "text-red-500" : "text-green-600"
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
