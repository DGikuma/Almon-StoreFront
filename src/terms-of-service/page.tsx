"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@heroui/link";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import {
  DocumentTextIcon,
  ScaleIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function TermsOfServicePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: CheckCircleIcon,
      gradient: "from-emerald-500 to-green-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            Welcome to Almon Products Ltd. By accessing or using our website, services, or making a purchase, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
          </p>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-5 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              We reserve the right to modify these Terms at any time. Your continued use of our services after any changes constitutes acceptance of the modified Terms. It is your responsibility to review these Terms periodically.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "services",
      title: "2. Description of Services",
      icon: ShoppingBagIcon,
      gradient: "from-purple-500 to-pink-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            Almon Products Ltd provides an e-commerce platform for the sale of various products including banners, printing materials, signage, and related products. We reserve the right to:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Modify, suspend, or discontinue any aspect of our services at any time",
              "Limit quantities of products purchased per person, per household, or per order",
              "Refuse service to anyone for any reason at any time",
              "Correct any errors, inaccuracies, or omissions in product descriptions or pricing",
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 rounded-xl border border-purple-200/50 dark:border-purple-800/30 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "account",
      title: "3. User Accounts",
      icon: UserIcon,
      gradient: "from-blue-500 to-cyan-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            To access certain features of our services, you may be required to create an account. You agree to:
          </p>
          <div className="space-y-3">
            {[
              "Provide accurate, current, and complete information during registration",
              "Maintain and promptly update your account information",
              "Maintain the security of your account credentials",
              "Accept responsibility for all activities under your account",
              "Notify us immediately of any unauthorized use of your account",
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
                <CheckCircleIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-5 rounded-xl border border-amber-200/50 dark:border-amber-800/30 backdrop-blur-sm">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-50">Note:</strong> We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "orders",
      title: "4. Orders and Payment",
      icon: CreditCardIcon,
      gradient: "from-indigo-500 to-purple-500",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 rounded-xl border border-indigo-200/50 dark:border-indigo-800/30 backdrop-blur-sm">
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              4.1 Order Placement
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              When you place an order, you are making an offer to purchase products at the prices listed. We reserve the right to accept or reject any order. Order acceptance occurs when we send you an order confirmation email.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl border border-purple-200/50 dark:border-purple-800/30 backdrop-blur-sm">
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              4.2 Pricing
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              All prices are listed in the currency specified on our website and are subject to change without notice. We strive to ensure accurate pricing, but errors may occur. If we discover a pricing error, we reserve the right to cancel the order or contact you for approval of the correct price.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-xl border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              4.3 Payment
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Payment must be made at the time of order placement through our accepted payment methods. You agree to provide current, complete, and accurate purchase and account information. We use secure third-party payment processors and do not store your full payment card information.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "5. Shipping and Delivery",
      icon: TruckIcon,
      gradient: "from-teal-500 to-cyan-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            We offer delivery services to specified areas. The following terms apply:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Delivery Areas", desc: "We deliver to areas as specified on our website. Delivery fees vary by location." },
              { label: "Delivery Timeframes", desc: "Estimated delivery times are provided at checkout but are not guaranteed." },
              { label: "Delivery Address", desc: "You are responsible for providing accurate delivery information. We are not liable for delays or failures due to incorrect addresses." },
              { label: "Risk of Loss", desc: "Risk of loss and title pass to you upon delivery to the carrier or designated location." },
              { label: "Delivery Issues", desc: "If you experience delivery issues, contact us within 48 hours of the expected delivery date." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-950/30 dark:to-cyan-950/30 p-5 rounded-xl border border-teal-200/50 dark:border-teal-800/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
              >
                <TruckIcon className="w-6 h-6 text-teal-500 dark:text-teal-400 mb-2" />
                <h5 className="font-bold text-slate-900 dark:text-slate-50 mb-2">{item.label}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "returns",
      title: "6. Returns and Refunds",
      icon: XCircleIcon,
      gradient: "from-red-500 to-rose-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            Our return and refund policy is as follows:
          </p>
          <div className="space-y-3">
            {[
              { title: "Return Window", desc: "Returns must be requested within 1 day after delivery" },
              { title: "Condition", desc: "Products must be unused, in original packaging, and in resalable condition" },
              { title: "Custom Products", desc: "Custom or personalized products may not be eligible for return unless defective" },
              { title: "Refund Processing", desc: "Refunds will be processed to the original payment method within 7 business days" },
              { title: "Return Shipping", desc: "Return shipping costs are the customer's responsibility unless the product is defective or incorrect" },
              { title: "Non-Returnable Items", desc: "Certain items such as perishable goods, digital products, and gift cards are non-returnable" },
              { title: "Concerns", desc: "If you have any concerns about your order, please contact our customer service team" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-5 bg-gradient-to-r from-red-50/50 to-rose-50/50 dark:from-red-950/30 dark:to-rose-950/30 rounded-xl border border-red-200/50 dark:border-red-800/30 backdrop-blur-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-slate-50 mb-1">{item.title}</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 rounded-xl border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              To initiate a return, please contact our customer service team with your order number and reason for return.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "intellectual-property",
      title: "7. Intellectual Property",
      icon: ShieldCheckIcon,
      gradient: "from-violet-500 to-purple-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            All content on our website, including text, graphics, logos, images, and software, is the property of Almon Products Ltd or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 p-6 rounded-xl border border-violet-200/50 dark:border-violet-800/30 backdrop-blur-sm">
            <p className="font-semibold text-slate-900 dark:text-slate-50 mb-3">You may not:</p>
            <ul className="space-y-2">
              {[
                "Reproduce, distribute, or create derivative works from our content without permission",
                "Use our trademarks or logos without written consent",
                "Remove any copyright or proprietary notices from materials",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <XCircleIcon className="w-5 h-5 text-violet-500 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "user-conduct",
      title: "8. User Conduct",
      icon: ExclamationTriangleIcon,
      gradient: "from-orange-500 to-red-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            You agree not to use our services to:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "Violate any applicable laws or regulations",
              "Infringe upon the rights of others",
              "Transmit any harmful, offensive, or illegal content",
              "Interfere with or disrupt our services or servers",
              "Attempt to gain unauthorized access to our systems",
              "Use automated systems to access our website without permission",
              "Impersonate any person or entity",
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-3 p-4 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl border border-orange-200/50 dark:border-orange-800/30 backdrop-blur-sm"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-5 rounded-xl border border-red-200/50 dark:border-red-800/30 backdrop-blur-sm">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-50">Warning:</strong> Violation of these terms may result in termination of your access to our services and legal action.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "disclaimers",
      title: "9. Disclaimers and Limitations of Liability",
      icon: ScaleIcon,
      gradient: "from-slate-500 to-gray-500",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-950/30 dark:to-gray-950/30 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/30 backdrop-blur-sm">
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
              <ScaleIcon className="w-5 h-5 text-slate-500" />
              9.1 Product Information
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, images, or other content are accurate, complete, reliable, current, or error-free. Colors may vary due to display settings.
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-950/30 dark:to-gray-950/30 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/30 backdrop-blur-sm">
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
              <ScaleIcon className="w-5 h-5 text-slate-500" />
              9.2 Service Availability
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee uninterrupted or error-free service.
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-950/30 dark:to-gray-950/30 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/30 backdrop-blur-sm">
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
              <ScaleIcon className="w-5 h-5 text-slate-500" />
              9.3 Limitation of Liability
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              To the maximum extent permitted by law, Almon Products Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "indemnification",
      title: "10. Indemnification",
      icon: ShieldCheckIcon,
      gradient: "from-blue-500 to-indigo-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            You agree to indemnify, defend, and hold harmless Almon Products Ltd, its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or relating to:
          </p>
          <div className="space-y-3">
            {[
              "Your use of our services",
              "Your violation of these Terms",
              "Your violation of any rights of another party",
              "Any content you submit or transmit through our services",
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {idx + 1}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "termination",
      title: "11. Termination",
      icon: XCircleIcon,
      gradient: "from-red-500 to-pink-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            We may terminate or suspend your account and access to our services immediately, without prior notice, for any reason, including if you breach these Terms. Upon termination:
          </p>
          <div className="space-y-3">
            {[
              "Your right to use our services will immediately cease",
              "All outstanding orders will be processed according to these Terms",
              "We may delete your account and related information",
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-950/30 dark:to-pink-950/30 rounded-xl border border-red-200/50 dark:border-red-800/30 backdrop-blur-sm">
                <XCircleIcon className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 rounded-xl border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              You may terminate your account at any time by contacting us or using account deletion features if available.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "governing-law",
      title: "12. Governing Law and Dispute Resolution",
      icon: ScaleIcon,
      gradient: "from-amber-500 to-yellow-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-6 rounded-xl border border-amber-200/50 dark:border-amber-800/30 backdrop-blur-sm">
            <p className="font-semibold text-slate-900 dark:text-slate-50 mb-3">Any disputes arising out of or relating to these Terms or our services shall be resolved through:</p>
            <div className="space-y-2">
              {[
                "Good faith negotiation between the parties",
                "Mediation if negotiation fails",
                "Binding arbitration or litigation as applicable under local law",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "miscellaneous",
      title: "13. Miscellaneous",
      icon: DocumentTextIcon,
      gradient: "from-teal-500 to-cyan-500",
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Entire Agreement", desc: "These Terms constitute the entire agreement between you and Almon Products Ltd regarding our services." },
              { title: "Severability", desc: "If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect." },
              { title: "Waiver", desc: "Our failure to enforce any right or provision of these Terms will not be considered a waiver of such right." },
              { title: "Assignment", desc: "You may not assign or transfer these Terms without our prior written consent." },
              { title: "Force Majeure", desc: "We are not liable for any failure to perform due to circumstances beyond our reasonable control." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-950/30 dark:to-cyan-950/30 p-5 rounded-xl border border-teal-200/50 dark:border-teal-800/30 backdrop-blur-sm"
              >
                <h5 className="font-bold text-slate-900 dark:text-slate-50 mb-2">{item.title}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      title: "14. Contact Information",
      icon: DocumentTextIcon,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-10 rounded-3xl text-white shadow-2xl">
            <h4 className="font-bold text-3xl mb-6">Almon Products Ltd</h4>
            <div className="space-y-4 text-purple-50">
              <p className="flex items-center gap-4 text-lg">
                <span className="w-3 h-3 rounded-full bg-white"></span>
                Email: almonltd80@gmail.com
              </p>
              <p className="flex items-center gap-4 text-lg">
                <span className="w-3 h-3 rounded-full bg-white"></span>
                Phone: (+254) 0711791981
              </p>
              <p className="flex items-center gap-4 text-lg">
                <span className="w-3 h-3 rounded-full bg-white"></span>
                Address: Kilome Road, Nairobi CBD
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Ultra HD Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-rose-400/30 rounded-full blur-[120px]"
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-[700px] h-[700px] bg-gradient-to-br from-pink-400/30 via-rose-400/30 to-purple-400/30 rounded-full blur-[140px]"
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-[100px]"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>

      <div className="relative z-10">
        {/* Ultra HD Header */}
        <motion.div
          style={{ opacity, scale }}
          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-30 shadow-lg"
        >
          <div className="container mx-auto max-w-7xl px-6 py-8">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-xl"
                >
                  <ScaleIcon className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
                    Terms of Service
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>
              <Button
                variant="light"
                onPress={() => navigate("/")}
                className="text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 px-6"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="container mx-auto max-w-7xl px-6 py-16">
          {/* Ultra HD Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-3xl p-12 text-white shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-black mb-6 leading-tight">Legal Agreement</h2>
                <p className="text-xl opacity-95 leading-relaxed max-w-3xl font-light">
                  These Terms of Service govern your use of Almon Products Ltd's website and services. Please read these terms carefully before using our platform. By accessing or using our services, you agree to be bound by these terms.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Ultra HD Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                Table of Contents
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sections.map((section, index) => (
                  <motion.a
                    key={section.id}
                    href={`#${section.id}`}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">{index + 1}.</span>
                    <span className="text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 font-medium text-sm transition-colors">
                      {section.title.replace(/^\d+\.\s/, '')}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Ultra HD Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="scroll-mt-32"
                >
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-start gap-6 mb-8">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className={`p-4 bg-gradient-to-br ${section.gradient} rounded-2xl shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50 pt-2">
                        {section.title}
                      </h3>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                      {section.content}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Ultra HD Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg font-medium">
                Related Documents:
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/privacy-policy"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/privacy-consent"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Marketing Consent Preferences
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
