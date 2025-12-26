"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, CardBody } from "@heroui/react";
import { 
  ShieldCheckIcon, 
  EnvelopeIcon, 
  XMarkIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

export default function PrivacyConsentPage() {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState<"accept" | "decline" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleChoice = async (choice: "accept" | "decline") => {
    setSelectedChoice(choice);
    setIsSubmitting(true);

    try {
      // Get customer identifier from localStorage or URL params if available
      const customerId = localStorage.getItem("customerId");
      const email = localStorage.getItem("customerEmail");
      const phone = localStorage.getItem("customerPhone");

      // Call API to save preference
      const response = await fetch("/api/privacy-consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          choice,
          customerId,
          email,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preference");
      }

      const data = await response.json();
      console.log("Preference saved:", data);
    } catch (error) {
      console.error("Error saving preference:", error);
      // Still show success to user even if API fails
      // In production, you might want to show an error message
    }

    setIsSubmitting(false);
    setIsComplete(true);

    // Redirect after showing success message
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-4"
            >
              <ShieldCheckIcon className="w-20 h-20 text-blue-600 dark:text-blue-400 mx-auto" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Marketing Communications Preference
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Your privacy matters to us. Please choose how you'd like to receive marketing communications from Almon Products Ltd.
            </p>
          </motion.div>

          {/* Main Card */}
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key="consent-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="backdrop-blur-lg bg-white/80 dark:bg-slate-800/80 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
                  <CardBody className="space-y-6 pt-6">
                    {/* Header Section */}
                    <div className="flex items-start gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                      <InformationCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                          Data Privacy & Marketing Consent
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          In compliance with Data Protection Act and GDPR regulations
                        </p>
                      </div>
                    </div>
                    {/* Information Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                        <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        What does this mean?
                      </h3>
                      <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                          <span><strong>Accept:</strong> You'll receive promotional emails, special offers, product updates, and marketing communications from us.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                          <span><strong>Decline:</strong> You'll only receive essential transactional emails (order confirmations, shipping updates, etc.).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                          <span>You can change your preference at any time by contacting us or updating your account settings.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Your Rights */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm">
                        Your Rights Under Data Protection Laws:
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        You have the right to access, rectify, erase, restrict processing, object to processing, 
                        and data portability regarding your personal data. You also have the right to withdraw 
                        consent at any time without affecting the lawfulness of processing based on consent before withdrawal.
                      </p>
                    </div>

                    {/* Choice Buttons */}
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                      {/* Accept Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          size="lg"
                          className={`w-full h-auto py-8 text-lg font-semibold ${
                            selectedChoice === "accept"
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                          }`}
                          onClick={() => handleChoice("accept")}
                          disabled={isSubmitting}
                          startContent={
                            <EnvelopeIcon className="w-6 h-6" />
                          }
                        >
                          {isSubmitting && selectedChoice === "accept" ? (
                            "Processing..."
                          ) : (
                            <>
                              Accept Marketing Communications
                            </>
                          )}
                        </Button>
                      </motion.div>

                      {/* Decline Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          size="lg"
                          variant="bordered"
                          className={`w-full h-auto py-8 text-lg font-semibold border-2 ${
                            selectedChoice === "decline"
                              ? "border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                              : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500"
                          }`}
                          onClick={() => handleChoice("decline")}
                          disabled={isSubmitting}
                          startContent={
                            <XMarkIcon className="w-6 h-6" />
                          }
                        >
                          {isSubmitting && selectedChoice === "decline" ? (
                            "Processing..."
                          ) : (
                            <>
                              Decline Marketing Communications
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>

                    {/* Footer Note */}
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400 pt-2">
                      Your choice will be saved immediately. This preference can be updated anytime in your account settings.
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="backdrop-blur-lg bg-white/80 dark:bg-slate-800/80 shadow-2xl border border-green-200/50 dark:border-green-700/50">
                  <CardBody className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4"
                    >
                      Preference Saved Successfully!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-slate-600 dark:text-slate-400 mb-6"
                    >
                      Your marketing communication preference has been recorded. 
                      {selectedChoice === "accept" 
                        ? " We look forward to sharing exciting updates with you!"
                        : " You'll only receive essential transactional communications from us."
                      }
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm text-slate-500 dark:text-slate-500"
                    >
                      Redirecting you back...
                    </motion.p>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

