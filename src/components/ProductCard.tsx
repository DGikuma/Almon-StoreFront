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
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number; // Discounted price
  variants: string[];
  selectedVariant: string;
  onVariantChange: (variant: string) => void;
  onAddToCart: (quantity: number) => void;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  saleType?: "roll" | "metre" | "board" | "unit" | "kg";
  originalPrice?: number; // Original price before discount
  hasDiscount?: boolean; // Whether product has active discount
  vatPercentage?: number; // VAT percentage (default 16%)
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
  originalPrice,
  hasDiscount = false,
  vatPercentage = 16,
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
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="h-full shadow-xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-500 flex flex-col group">
        <CardBody className="overflow-hidden p-6 md:p-8 flex-1 flex flex-col">
          <div className="relative w-full aspect-[4/3] mb-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 group-hover:scale-105 transition-transform duration-500">
            <Image
              shadow="none"
              radius="lg"
              width="100%"
              height="100%"
              alt={name}
              className="object-cover w-full h-full"
              src={image}
            />
          </div>
        </CardBody>

        <CardFooter className="flex flex-col items-start gap-4 pt-0 px-6 md:px-8 pb-6 md:pb-8">
          <div className="w-full">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-2">
              {name}
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Variant selection - Premium styling */}
          {saleType === "metre" ? (
            <div className="flex gap-2 mt-2 flex-wrap">
              {metreOptions.map((m) => {
                const variantLabel = `${m} Metre`;
                const selected = selectedVariant === variantLabel;
                return (
                  <button
                    key={variantLabel}
                    onClick={() => onVariantChange(variantLabel)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selected
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    {variantLabel}
                  </button>
                );
              })}
            </div>
          ) : variants.length > 1 ? (
            <Select
              aria-label="Select variant"
              selectedKeys={[selectedVariant]}
              onChange={(e) => onVariantChange(e.target.value)}
              size="md"
              className="w-full mt-2"
              classNames={{
                trigger: "h-12 min-h-12",
                value: "text-base",
              }}
            >
              {variants.map((v) => (
                <SelectItem key={v} textValue={v}>{v}</SelectItem>
              ))}
            </Select>
          ) : null}

          {/* Price and Quantity - Premium layout */}
          <div className="flex items-center justify-between w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Button
                isIconOnly
                radius="md"
                size="md"
                variant="light"
                onPress={handleDecrease}
                isDisabled={isControlled ? quantity <= 0 : quantity <= 1}
                className="min-w-10 h-10 w-10 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </Button>

              <span className="text-lg font-bold text-gray-800 dark:text-gray-200 w-8 text-center">
                {quantity}
              </span>

              <Button
                isIconOnly
                radius="md"
                size="md"
                variant="light"
                onPress={handleIncrease}
                className="min-w-10 h-10 w-10 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* Price display */}
            <div className="flex flex-col items-end gap-1">
              {hasDiscount && originalPrice && originalPrice > price ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                      KES {(originalPrice * quantity).toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold bg-red-500 text-white px-2 py-0.5 rounded">
                      {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                    KES {(price * quantity).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Save: KES {((originalPrice - price) * quantity).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  KES {(price * quantity).toLocaleString()}
                </span>
              )}
              {/* VAT Display */}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                VAT ({vatPercentage}%): KES {((price * quantity * vatPercentage) / 100).toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            color="default"
            onPress={() => onAddToCart(quantity)}
            radius="lg"
            size="lg"
            className="w-full mt-4 font-bold text-base md:text-lg py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            startContent={<ShoppingCart className="w-5 h-5" />}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
