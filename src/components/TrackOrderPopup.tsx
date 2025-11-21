"use client";

import { motion } from "framer-motion";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import TrackOrderAnimated from "@/order-tracking/page";

export default function TrackOrderPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop="blur"
      size="5xl"
      scrollBehavior="inside"
      className="z-[9999]"
    >
      <ModalContent className="bg-transparent shadow-none">
        <ModalHeader className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-white">
          {/* Truck Icon (replace URL with your own icon if desired) */}
          <motion.div
            initial={{ rotate: -10, x: -10, opacity: 0 }}
            animate={{ rotate: 0, x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <img
              src="images/truck-icon.png"
              alt="Truck Icon"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </motion.div>

          <span>Track My Order</span>
        </ModalHeader>

        <ModalBody className="p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-2xl overflow-hidden backdrop-blur-md"
          >
            <TrackOrderAnimated />
          </motion.div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
