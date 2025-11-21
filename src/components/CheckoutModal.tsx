"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Select, SelectItem } from "@heroui/react";
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

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryArea: string;
  onDeliveryAreaChange: (area: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  subtotal,
  deliveryFee,
  total,
  deliveryArea,
  onDeliveryAreaChange
}) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handlePayment = async () => {
    try {
      setLoading(true);
      setStatus("");
      const res = await axios.post("/api/stk", { phone, amount: total });
      const message = (res.data as { message?: string } | undefined)?.message;
      setStatus(message ?? "Payment initiated. Check your phone.");
    } catch (error: any) {
      setStatus("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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

          {/* Delivery Area Selection */}
          <Select
            label="Delivery Area"
            placeholder="Select your delivery area"
            selectedKeys={deliveryArea ? [deliveryArea] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              onDeliveryAreaChange(selected || "");
            }}
            className="w-full"
          >
            {Object.keys(deliveryAreas).map((area) => (
              <SelectItem key={area} value={area}>
                {formatAreaName(area)} - KES {deliveryAreas[area].toLocaleString()}
              </SelectItem>
            ))}
          </Select>

          <Input
            type="tel"
            label="M-Pesa Phone Number"
            placeholder="07XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {status && (
            <p
              className={`text-sm ${
                status.includes("failed") ? "text-red-500" : "text-green-600"
              }`}
            >
              {status}
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handlePayment}
            isLoading={loading}
            disabled={!phone || !deliveryArea}
          >
            Pay via STK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
