"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface OrderItem {
  id: string | number;
  product_id?: string;
  name: string;
  confirmed: boolean;
  price: number;
  quantity: number;
  unit?: string; // e.g., "roll", "metre", "sheet", "unit", "kg"
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems?: OrderItem[];
}

// Dummy data for testing with various units (metres, rolls, sheets, units)
// Note: This is kept for reference but not currently used
// const dummyOrderItems: OrderItem[] = [
//   // Rolls
//   { id: 1, name: "Frontlit Banner 1.5m - 440gsm", confirmed: false, price: 4200, quantity: 3, unit: "roll" },
//   { id: 2, name: "Frontlit Banner 2.7m - 440gsm", confirmed: false, price: 7200, quantity: 2, unit: "roll" },
//   // ... more items
// ];

export const ConfirmDeliveryModal: React.FC<ModalProps> = ({ isOpen, onClose, orderItems }) => {
  const [items, setItems] = useState<OrderItem[]>(orderItems || []);
  const [orderNumber, setOrderNumber] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [showDeliveryNote, setShowDeliveryNote] = useState(false);
  const [deliveryNoteData, setDeliveryNoteData] = useState<{
    orderNumber: string;
    receivedItems: OrderItem[];
    missingItems: OrderItem[];
    date: string;
  } | null>(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    if (orderItems && orderItems.length > 0) {
      setItems(orderItems.map(item => ({ ...item, confirmed: false })));
    }
  }, [orderItems]);

  // Fetch order items when order number is entered
  const fetchOrderItems = async () => {
    if (!orderNumber.trim()) {
      setOtpError("Please enter an order ID");
      return;
    }

    setLoadingOrder(true);
    setOtpError("");

    try {
      const response = await axios.get(`/api/delivery/order-items?order_id=${orderNumber}`);
      const orderData = response.data;

      if (orderData.items && orderData.items.length > 0) {
        setItems(orderData.items.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.name,
          confirmed: false,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
        })));
        setPhoneNumber(orderData.delivery?.recipient_phone || "");
      } else {
        setOtpError("No items found for this order");
        setItems([]);
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "Failed to load order items");
      setItems([]);
    } finally {
      setLoadingOrder(false);
    }
  };

  const toggleItem = (id: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, confirmed: !item.confirmed } : item))
    );
  };

  const handleGenerateOtp = async () => {
    const confirmedItems = items.filter((item) => item.confirmed);

    if (confirmedItems.length === 0) {
      setOtpError("Please select at least one item that has been delivered");
      return;
    }

    if (!orderNumber.trim()) {
      setOtpError("Please enter an order ID");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const deliveredItems = confirmedItems.map(item => ({
        product_id: item.product_id || item.id.toString(),
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await axios.post("/api/delivery/generate-otp", {
        order_id: orderNumber,
        delivered_items: deliveredItems,
      });

      setOtpSent(true);
      setOtpError("");

      // Store delivery note data
      const unconfirmedItems = items.filter((item) => !item.confirmed);
      setDeliveryNoteData({
        orderNumber: orderNumber,
        receivedItems: confirmedItems,
        missingItems: unconfirmedItems,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      // Show delivery note
      setShowDeliveryNote(true);

      // In development, show OTP in console (remove in production)
      if (response.data.otp) {
        console.log("OTP (dev only):", response.data.otp);
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "Failed to generate OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleAcceptDelivery = () => {
    // This is now handled by handleGenerateOtp
    handleGenerateOtp();
  };

  const handlePrintDeliveryNote = () => {
    window.print();
  };

  const handleCloseDeliveryNote = () => {
    setShowDeliveryNote(false);
    setDeliveryCompleted(false);
    setOtp("");
    setOtpSent(false);
    setOtpError("");
    setOrderNumber("");
    setItems([]);
    setDeliveryNoteData(null);
    onClose();
  };

  const handleBackToEdit = () => {
    if (deliveryNoteData) {
      // Restore items from delivery note data
      const allItems = [...deliveryNoteData.receivedItems, ...deliveryNoteData.missingItems];
      setItems(allItems);
      setShowDeliveryNote(false);
      setDeliveryCompleted(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!deliveryNoteData) {
      setOtpError("Delivery data not found");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");

    try {
      const deliveredItems = deliveryNoteData.receivedItems.map(item => ({
        product_id: item.product_id || item.id.toString(),
        quantity: item.quantity,
        price: item.price,
      }));

      await axios.post("/api/delivery/verify-otp", {
        order_id: orderNumber,
        otp: otp,
        delivered_items: deliveredItems,
      });

      setDeliveryCompleted(true);
      setOtpError("");
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleCompleteDelivery = () => {
    handleVerifyOtp();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showDeliveryNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Your Delivery</h2>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter your order ID (e.g., SAL251100001)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded mb-2 dark:bg-gray-700 dark:text-gray-100"
                />
                <button
                  onClick={fetchOrderItems}
                  disabled={loadingOrder || !orderNumber.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded font-semibold"
                >
                  {loadingOrder ? "Loading..." : "Load Order Items"}
                </button>
                {otpError && !showDeliveryNote && (
                  <p className="text-red-500 text-sm mt-2">{otpError}</p>
                )}
              </div>

              <div className="mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <label key={item.id} className="flex items-center justify-between mb-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded cursor-pointer text-gray-900 dark:text-gray-100">
                    <div className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        checked={item.confirmed}
                        onChange={() => toggleItem(item.id)}
                        className="mr-2 w-4 h-4"
                      />
                      <span className="flex-1">{item.name}</span>
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400 ml-4">
                      <div>{item.quantity || 1} {item.unit || "unit"}{((item.quantity || 1) > 1) ? "s" : ""}</div>
                      <div className="font-semibold">KES {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</div>
                    </div>
                  </label>
                ))}
              </div>

              {items.length > 0 && (
                <button
                  onClick={handleAcceptDelivery}
                  disabled={otpLoading || items.filter(item => item.confirmed).length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded font-semibold"
                >
                  {otpLoading ? "Generating OTP..." : "Generate OTP & Continue"}
                </button>
              )}

              <button
                onClick={onClose}
                className="font-semibold w-full mt-2 bg-red-700 hover:bg-red-400 dark:bg-red-700 dark:hover:bg-red-600 text-white dark:text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delivery Note */}
      <AnimatePresence>
        {showDeliveryNote && deliveryNoteData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="delivery-note-print bg-white dark:bg-gray-800 p-10 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Corporate Header with Logo */}
              <div className="mb-8 border-b-4 border-gray-800 dark:border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src="/images/logo.jpg"
                      alt="Almon Products Ltd Logo"
                      className="w-24 h-24 object-contain rounded-lg shadow-md"
                    />
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        ALMON PRODUCTS LTD
                      </h1>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Premium Materials & Branding Solutions
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Nairobi, Kenya | Email: info@almonproducts.com | Tel: +254 XXX XXX XXX
                      </p>
                    </div>
                  </div>
                  <div className="text-right border-l-2 border-gray-300 dark:border-gray-600 pl-6">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">DELIVERY NOTE</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Document No: DN-{new Date().getTime().toString().slice(-6)}</p>
                  </div>
                </div>
              </div>

              {/* Order Information Section */}
              <div className="mb-6 grid grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Order Information
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Order Number:</span> {deliveryNoteData.orderNumber}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    <span className="font-semibold">Delivery Date:</span> {deliveryNoteData.date}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Delivery Status
                  </h3>
                  {deliveryNoteData.missingItems.length > 0 ? (
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 font-semibold">
                      ⚠️ INCOMPLETE DELIVERY
                    </p>
                  ) : (
                    <p className="text-sm text-green-700 dark:text-green-300 font-semibold">
                      ✅ COMPLETE DELIVERY
                    </p>
                  )}
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {deliveryNoteData.receivedItems.length} of {deliveryNoteData.receivedItems.length + deliveryNoteData.missingItems.length} items received
                  </p>
                </div>
              </div>

              {/* Received Items Table */}
              {deliveryNoteData.receivedItems.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                    Items Received
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                      <thead>
                        <tr className="bg-gray-800 dark:bg-gray-700 text-white">
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                            #
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                            Item Description
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                            Unit Price (KES)
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                            Total (KES)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryNoteData.receivedItems.map((item, index) => {
                          const itemTotal = (item.price || 0) * (item.quantity || 1);
                          return (
                            <tr
                              key={item.id}
                              className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                            >
                              <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {index + 1}
                              </td>
                              <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                {item.name}
                              </td>
                              <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                                {item.quantity || 1} {item.unit || "unit"}{((item.quantity || 1) > 1) ? "s" : ""}
                              </td>
                              <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                                {(item.price || 0).toLocaleString()}
                              </td>
                              <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-right font-semibold text-green-700 dark:text-green-400">
                                {itemTotal.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                          <td colSpan={4} className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                            Subtotal (Received):
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                            {deliveryNoteData.receivedItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Missing Items Table (if any) */}
              {deliveryNoteData.missingItems.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 uppercase tracking-wide border-b-2 border-red-300 dark:border-red-600 pb-2">
                    Items Not Received
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-red-300 dark:border-red-600">
                      <thead>
                        <tr className="bg-red-800 dark:bg-red-900 text-white">
                          <th className="border border-red-300 dark:border-red-600 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                            #
                          </th>
                          <th className="border border-red-300 dark:border-red-600 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                            Item Description
                          </th>
                          <th className="border border-red-300 dark:border-red-600 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="border border-red-300 dark:border-red-600 px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                            Unit Price (KES)
                          </th>
                          <th className="border border-red-300 dark:border-red-600 px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                            Total (KES)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryNoteData.missingItems.map((item, index) => {
                          const itemTotal = (item.price || 0) * (item.quantity || 1);
                          return (
                            <tr
                              key={item.id}
                              className={`${index % 2 === 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-red-100/50 dark:bg-red-900/30'} hover:bg-red-100 dark:hover:bg-red-900/40`}
                            >
                              <td className="border border-red-300 dark:border-red-600 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-300">
                                {index + 1}
                              </td>
                              <td className="border border-red-300 dark:border-red-600 px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                {item.name}
                              </td>
                              <td className="border border-red-300 dark:border-red-600 px-4 py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                                {item.quantity || 1} {item.unit || "unit"}{((item.quantity || 1) > 1) ? "s" : ""}
                              </td>
                              <td className="border border-red-300 dark:border-red-600 px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                                {(item.price || 0).toLocaleString()}
                              </td>
                              <td className="border border-red-300 dark:border-red-600 px-4 py-3 text-sm text-right font-semibold text-red-700 dark:text-red-400">
                                {itemTotal.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-red-100 dark:bg-red-900/40 font-bold">
                          <td colSpan={4} className="border border-red-300 dark:border-red-600 px-4 py-3 text-right text-sm text-red-800 dark:text-red-300">
                            Subtotal (Missing):
                          </td>
                          <td className="border border-red-300 dark:border-red-600 px-4 py-3 text-right text-sm text-red-800 dark:text-red-300">
                            {deliveryNoteData.missingItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Financial Summary */}
              <div className="mt-8 mb-6">
                <div className="flex justify-end">
                  <div className="w-80 border-2 border-gray-800 dark:border-gray-200">
                    <table className="w-full">
                      <tbody>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <td className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
                            Total Received:
                          </td>
                          <td className="px-4 py-2 text-sm font-bold text-right text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                            KES {deliveryNoteData.receivedItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0).toLocaleString()}
                          </td>
                        </tr>
                        {deliveryNoteData.missingItems.length > 0 && (
                          <tr className="bg-red-50 dark:bg-red-900/20">
                            <td className="px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300 border-b border-gray-300 dark:border-gray-600">
                              Total Missing:
                            </td>
                            <td className="px-4 py-2 text-sm font-bold text-right text-red-700 dark:text-red-300 border-b border-gray-300 dark:border-gray-600">
                              KES {deliveryNoteData.missingItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0).toLocaleString()}
                            </td>
                          </tr>
                        )}
                        <tr className="bg-gray-800 dark:bg-gray-700 text-white">
                          <td className="px-4 py-3 text-base font-bold uppercase tracking-wide">
                            Order Total:
                          </td>
                          <td className="px-4 py-3 text-base font-bold text-right">
                            KES {(deliveryNoteData.receivedItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0) +
                              deliveryNoteData.missingItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* OTP Verification Section */}
              <div className="mt-8 mb-6 grid grid-cols-2 gap-8 border-t-2 border-gray-300 dark:border-gray-600 pt-6">
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                    OTP Verification
                  </p>
                  {otpSent ? (
                    <>
                      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold mb-1">
                          ✓ OTP Sent Successfully
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          An OTP has been sent to {phoneNumber ? phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3') : 'your registered phone number'}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          Please check your phone and enter the 6-digit OTP below to complete delivery.
                        </p>
                      </div>
                      <div className="mb-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setOtp(value);
                            setOtpError("");
                          }}
                          maxLength={6}
                          className="w-full px-4 py-3 text-lg text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 font-mono tracking-widest"
                        />
                        {otpError && (
                          <p className="text-red-500 text-sm mt-2">{otpError}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Please select the items that have been delivered and click "Generate OTP" to receive an OTP on your phone.
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    <span className="font-semibold">Date:</span> {(() => {
                      const dateStr = deliveryNoteData.date;
                      const dateOnly = dateStr.includes(',') ? dateStr.split(',')[0] : dateStr.split(' at ')[0];
                      return dateOnly || new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      });
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                    Authorized Representative
                  </p>
                  <div className="border-b-2 border-gray-400 dark:border-gray-500 h-12 mb-2 flex items-center justify-center">
                    <span className="text-gray-800 dark:text-gray-200 font-bold text-base italic tracking-wide">
                      Almon Products Ltd
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    <span className="font-semibold">Name:</span> Almon Products Ltd
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span className="font-semibold">Date:</span> {(() => {
                      const dateStr = deliveryNoteData.date;
                      // Extract date part (before comma if time is included)
                      const dateOnly = dateStr.includes(',') ? dateStr.split(',')[0] : dateStr.split(' at ')[0];
                      return dateOnly || new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      });
                    })()}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t-4 border-gray-800 dark:border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    This delivery note serves as official confirmation of items received by the customer.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-semibold">
                    ALMON PRODUCTS LTD | Premium Branding Materials & Solutions
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Document Generated: {deliveryNoteData.date} | This is a computer-generated document.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {!deliveryCompleted ? (
                  <>
                    <button
                      onClick={handleCompleteDelivery}
                      disabled={!otpSent || !otp || otp.length !== 6 || verifyingOtp}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded font-semibold text-lg"
                    >
                      {verifyingOtp
                        ? "Verifying OTP..."
                        : !otpSent
                          ? "Please generate OTP first"
                          : !otp || otp.length !== 6
                            ? "Please enter the 6-digit OTP"
                            : "✓ Complete Delivery"}
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={handleBackToEdit}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded font-semibold"
                      >
                        ← Back to Edit Items
                      </button>
                      <button
                        onClick={handleCloseDeliveryNote}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 mb-4">
                      <p className="text-green-800 dark:text-green-200 font-semibold text-center">
                        ✅ Delivery Completed Successfully!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 text-center mt-1">
                        You can now download or print your delivery note.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handlePrintDeliveryNote}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-semibold text-lg"
                      >
                        📄 Print / Save PDF
                      </button>
                      <button
                        onClick={handleCloseDeliveryNote}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

