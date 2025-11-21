"use client";

import { ConfirmDeliveryModal } from "@/delivery/page";

export default function DeliveryModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return <ConfirmDeliveryModal isOpen={isOpen} onClose={onClose} />;
}
