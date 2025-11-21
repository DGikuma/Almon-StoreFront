"use client";

import React from "react";
import { Badge, Button } from "@heroui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

interface CartButtonProps {
  count: number;
  onOpen: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ count, onOpen }) => (
  <Button
    isIconOnly
    color="secondary"
    radius="full"
    onPress={onOpen}
    className="relative"
  >
    {count > 0 ? (
      <Badge content={count} color="danger" shape="circle" className="text-[10px]">
        <ShoppingCartIcon className="w-6 h-6 text-white" />
      </Badge>
    ) : (
      <ShoppingCartIcon className="w-6 h-6 text-white" />
    )}
  </Button>
);
