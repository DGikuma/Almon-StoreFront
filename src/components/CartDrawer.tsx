"use client";

import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button } from "@heroui/react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemove,
  onCheckout,
  subtotal,
  deliveryFee,
  total,
}) => {

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerContent className="bg-gradient-to-br from-white via-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <DrawerHeader className="text-2xl font-bold text-gray-800 dark:text-white">
          Your Cart
        </DrawerHeader>
        <DrawerBody className="space-y-4 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl shadow"
              >
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.variant} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-300 font-semibold">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </span>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onPress={() => onRemove(item.id)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </DrawerBody>
        {cartItems.length > 0 && (
          <DrawerFooter className="flex flex-col gap-2">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Subtotal:</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Delivery Fee:</span>
                <span className={deliveryFee > 0 ? "" : "text-gray-400 italic"}>
                  {deliveryFee > 0 ? `KES ${deliveryFee.toLocaleString()}` : "Select at checkout"}
                </span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between w-full font-semibold text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center w-full mt-2 mb-1">
              By proceeding to check out you agree to process this sale
            </p>
            <Button color="success" className="text-white font-semibold w-full" onPress={onCheckout}>
              Proceed to Checkout
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
