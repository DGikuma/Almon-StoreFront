"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  XMarkIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Cookie Icon SVG Component
const CookieIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
    <circle cx="15.5" cy="8.5" r="1" fill="currentColor" />
    <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="0.5" fill="currentColor" />
  </svg>
);

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentBannerProps {
  onAccept?: (preferences: CookiePreferences & { marketing: boolean }) => void;
  onDecline?: () => void;
}

export default function CookieConsentBanner({ onAccept, onDecline }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    essential: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = async () => {
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };

    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    localStorage.setItem("marketingConsent", "accepted");

    setIsVisible(false);
    onAccept?.({ ...preferences, marketing: true });

    // Save to API
    try {
      await fetch("/api/privacy-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: "accept", marketing: true, cookies: preferences }),
      });
    } catch (error) {
      console.error("Error saving consent:", error);
    }
  };

  const handleDeclineAll = async () => {
    const preferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };

    localStorage.setItem("cookieConsent", "declined");
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    localStorage.setItem("marketingConsent", "declined");

    setIsVisible(false);
    onDecline?.();

    // Save to API
    try {
      await fetch("/api/privacy-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: "decline", marketing: false, cookies: preferences }),
      });
    } catch (error) {
      console.error("Error saving consent:", error);
    }
  };

  const handleCustomSave = async () => {
    const preferences = {
      ...cookiePreferences,
      marketing: marketingConsent,
    };

    localStorage.setItem("cookieConsent", "custom");
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    localStorage.setItem("marketingConsent", marketingConsent ? "accepted" : "declined");

    setIsVisible(false);
    onAccept?.({ ...preferences, marketing: marketingConsent });

    // Save to API
    try {
      await fetch("/api/privacy-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          choice: marketingConsent ? "accept" : "decline",
          marketing: marketingConsent,
          cookies: preferences
        }),
      });
    } catch (error) {
      console.error("Error saving consent:", error);
    }
  };

  const toggleCookiePreference = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // Essential cookies can't be disabled
    setCookiePreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowDetails(false)}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="relative max-w-6xl mx-auto">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-80"></div>

              {/* Main Content */}
              <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-white/20 overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L2c+PC9zdmc+')] opacity-30"></div>

                {/* Content */}
                <div className="relative p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="flex-shrink-0"
                    >
                      <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
                        <CookieIcon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Cookie & Privacy Preferences
                      </h2>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.
                        By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or learn more in our{" "}
                        <Link to="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                          Privacy Policy
                        </Link>.
                      </p>
                    </div>
                    <Button
                      onClick={handleDeclineAll}
                      className="flex-shrink-0 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-slate-500" />
                    </Button>
                  </div>

                  {/* Details Section */}
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mb-6"
                      >
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
                          {/* Marketing Consent */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-5 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <EnvelopeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-bold text-slate-900 dark:text-slate-50">Marketing Communications</h3>
                              </div>
                              <Button
                                onClick={() => setMarketingConsent(!marketingConsent)}
                                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${marketingConsent ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-slate-300 dark:bg-slate-600"
                                  }`}
                              >
                                <motion.div
                                  animate={{ x: marketingConsent ? 28 : 2 }}
                                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
                                />
                              </Button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Receive promotional emails, special offers, and product updates from Almon Products Ltd.
                            </p>
                          </div>

                          {/* Cookie Preferences */}
                          <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                              <Cog6ToothIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              Cookie Preferences
                            </h3>

                            {/* Essential Cookies */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Essential Cookies</h4>
                                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                    Required
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Necessary for the website to function properly. These cannot be disabled.
                                </p>
                              </div>
                              <div className="ml-4 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-semibold text-sm">
                                Always On
                              </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">Analytics Cookies</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Help us understand how visitors interact with our website to improve user experience.
                                </p>
                              </div>
                              <Button
                                onClick={() => toggleCookiePreference("analytics")}
                                className={`ml-4 relative w-14 h-7 rounded-full transition-colors duration-300 ${cookiePreferences.analytics ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-slate-300 dark:bg-slate-600"
                                  }`}
                              >
                                <motion.div
                                  animate={{ x: cookiePreferences.analytics ? 28 : 2 }}
                                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
                                />
                              </Button>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">Marketing Cookies</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Used to deliver relevant advertisements and track campaign effectiveness.
                                </p>
                              </div>
                              <Button
                                onClick={() => toggleCookiePreference("marketing")}
                                className={`ml-4 relative w-14 h-7 rounded-full transition-colors duration-300 ${cookiePreferences.marketing ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-300 dark:bg-slate-600"
                                  }`}
                              >
                                <motion.div
                                  animate={{ x: cookiePreferences.marketing ? 28 : 2 }}
                                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
                                />
                              </Button>
                            </div>
                          </div>

                          {/* Info Box */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/30 flex items-start gap-3">
                            <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              You can change these preferences at any time by visiting our{" "}
                              <Link to="/privacy-consent" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                                Privacy Consent page
                              </Link>{" "}
                              or adjusting your browser settings.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onPress={handleAcceptAll}
                      className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-6 text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Accept All
                    </Button>
                    <Button
                      onPress={() => setShowDetails(!showDetails)}
                      variant="bordered"
                      className="flex-1 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                    >
                      <Cog6ToothIcon className="w-5 h-5 mr-2" />
                      Customize Preferences
                    </Button>
                    {showDetails && (
                      <Button
                        onPress={handleCustomSave}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        Save Preferences
                      </Button>
                    )}
                    <Button
                      onPress={handleDeclineAll}
                      variant="light"
                      className="border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-semibold py-6 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300"
                    >
                      Decline All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

