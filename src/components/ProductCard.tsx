"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  variants: string[];
  selectedVariant: string;
  onVariantChange: (variant: string) => void;
  onAddToCart: (quantity: number) => void;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  saleType?: "roll" | "metre" | "sheet" | "unit" | "kg";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  description,
  price,
  variants,
  selectedVariant,
  onVariantChange,
  onAddToCart,
  quantity: controlledQuantity,
  onIncrease,
  onDecrease,
  saleType = "unit",
}) => {
  const [uncontrolledQuantity, setUncontrolledQuantity] = useState(1);
  const isControlled = typeof controlledQuantity === "number";
  const quantity = isControlled ? controlledQuantity ?? 0 : uncontrolledQuantity;

  const handleIncrease = () => {
    if (isControlled) {
      onIncrease?.();
      return;
    }
    setUncontrolledQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (isControlled) {
      if (quantity <= 0) return;
      onDecrease?.();
      return;
    }
    setUncontrolledQuantity((prev) => Math.max(1, prev - 1));
  };

  const metreOptions = [0.25, 0.5, 1];

  return (
    <motion.div
      key={id}
      whileHover={{ scale: 1.05 }}
      className="w-full max-w-sm mx-auto"
    >
      <Card className="shadow-xl border-none bg-gradient-to-br from-sky-100 via-white to-pink-100 dark:from-gray-800 dark:to-gray-700">
        <CardBody className="overflow-visible p-4">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={name}
            className="object-cover h-56 w-full"
            src={image}
          />
        </CardBody>

        <CardFooter className="flex flex-col items-start gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {description}
          </p>

          {/* Metre selection buttons */}
          {saleType === "metre" ? (
            <div className="flex gap-2 mt-2">
              {metreOptions.map((m) => {
                const variantLabel = `${m} Metre`;
                const selected = selectedVariant === variantLabel;
                return (
                  <motion.button
                    key={variantLabel}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onVariantChange(variantLabel)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selected
                        ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg"
                        : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {variantLabel}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <Select
              aria-label="Select variant"
              selectedKeys={[selectedVariant]}
              onChange={(e) => onVariantChange(e.target.value)}
              className="w-full mt-2"
            >
              {variants.map((v) => (
                <SelectItem key={v}>{v}</SelectItem>
              ))}
            </Select>
          )}

          {/* Quantity controls */}
          <div className="flex items-center justify-between w-full mt-3">
            <div className="flex items-center gap-3">
              <Button
                isIconOnly
                radius="full"
                size="sm"
                variant="light"
                onPress={handleDecrease}
                isDisabled={isControlled ? quantity <= 0 : quantity <= 1}
                className="hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Minus className="w-4 h-4" />
              </Button>

              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 w-6 text-center">
                {quantity}
              </span>

              <Button
                isIconOnly
                radius="full"
                size="sm"
                variant="light"
                onPress={handleIncrease}
                className="hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Price display */}
            <span className="text-lg font-bold text-blue-600 dark:text-blue-300">
              KES {(price * quantity).toLocaleString()}
            </span>
          </div>

          <Button
            color="primary"
            onPress={() => onAddToCart(quantity)}
            radius="lg"
            className="w-full mt-3 font-semibold"
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
