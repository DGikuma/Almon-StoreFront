"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@heroui/link";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  LockClosedIcon,
  EyeIcon,
  UserIcon,
  GlobeAltIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function PrivacyPolicyPage() {
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
      id: "introduction",
      title: "1. Introduction",
      icon: DocumentTextIcon,
      gradient: "from-blue-500 to-cyan-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            Welcome to Almon Products Ltd ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
          </p>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            By accessing or using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </div>
      ),
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      icon: UserIcon,
      gradient: "from-purple-500 to-pink-500",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              2.1 Personal Information
            </h4>
            <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
              We may collect personal information that you voluntarily provide to us, including but not limited to:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 dark:text-blue-400 mt-1.5">▸</span>
                <span>Name, email address, phone number, and postal address</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 dark:text-blue-400 mt-1.5">▸</span>
                <span>Payment information (processed securely through third-party payment processors)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 dark:text-blue-400 mt-1.5">▸</span>
                <span>Account credentials and preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 dark:text-blue-400 mt-1.5">▸</span>
                <span>Order history and transaction details</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 dark:text-blue-400 mt-1.5">▸</span>
                <span>Customer service communications</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 backdrop-blur-sm">
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              2.2 Automatically Collected Information
            </h4>
            <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
              When you visit our website, we automatically collect certain information, including:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 dark:text-purple-400 mt-1.5">▸</span>
                <span>IP address and device identifiers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 dark:text-purple-400 mt-1.5">▸</span>
                <span>Browser type and version</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 dark:text-purple-400 mt-1.5">▸</span>
                <span>Operating system information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 dark:text-purple-400 mt-1.5">▸</span>
                <span>Pages visited, time spent on pages, and navigation patterns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 dark:text-purple-400 mt-1.5">▸</span>
                <span>Referring website addresses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 dark:text-purple-400 mt-1.5">▸</span>
                <span>Cookies and similar tracking technologies</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "how-we-use",
      title: "3. How We Use Your Information",
      icon: EyeIcon,
      gradient: "from-emerald-500 to-teal-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">We use the information we collect for various purposes, including:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Service Delivery", desc: "To process and fulfill your orders, manage your account, and provide customer support" },
              { label: "Communication", desc: "To send order confirmations, shipping updates, and respond to your inquiries" },
              { label: "Marketing", desc: "To send promotional materials, special offers, and newsletters (with your consent)" },
              { label: "Improvement", desc: "To analyze usage patterns, improve our website functionality, and enhance user experience" },
              { label: "Legal Compliance", desc: "To comply with legal obligations, enforce our terms, and protect our rights" },
              { label: "Security", desc: "To detect and prevent fraud, unauthorized access, and other security threats" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md hover:shadow-lg transition-all duration-300"
              >
                <h5 className="font-bold text-slate-900 dark:text-slate-50 mb-2">{item.label}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "information-sharing",
      title: "4. Information Sharing and Disclosure",
      icon: GlobeAltIcon,
      gradient: "from-indigo-500 to-blue-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">We do not sell your personal information. We may share your information only in the following circumstances:</p>
          <div className="space-y-3">
            {[
              { title: "Service Providers", desc: "With trusted third-party service providers who assist in operating our business (payment processors, shipping companies, IT services)" },
              { title: "Legal Requirements", desc: "When required by law, court order, or government regulation" },
              { title: "Business Transfers", desc: "In connection with a merger, acquisition, or sale of assets" },
              { title: "Protection of Rights", desc: "To protect our rights, property, or safety, or that of our customers or others" },
              { title: "With Your Consent", desc: "When you explicitly authorize us to share your information" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl border border-indigo-200/50 dark:border-indigo-800/30 backdrop-blur-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-slate-50 mb-1">{item.title}</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "data-security",
      title: "5. Data Security",
      icon: LockClosedIcon,
      gradient: "from-red-500 to-orange-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "Encryption of sensitive data in transit and at rest",
              "Secure payment processing through PCI-DSS compliant providers",
              "Regular security assessments and updates",
              "Access controls and authentication mechanisms",
              "Employee training on data protection",
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/30 dark:to-orange-950/30 p-4 rounded-xl border border-red-200/50 dark:border-red-800/30 backdrop-blur-sm text-center"
              >
                <LockClosedIcon className="w-8 h-8 text-red-500 dark:text-red-400 mx-auto mb-2" />
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-5 rounded-xl border border-amber-200/50 dark:border-amber-800/30 backdrop-blur-sm">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-50">Note:</strong> However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "your-rights",
      title: "6. Your Rights and Choices",
      icon: ShieldCheckIcon,
      gradient: "from-violet-500 to-purple-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">Under applicable data protection laws (including GDPR and Data Protection Act), you have the following rights:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { right: "Access", desc: "Request access to your personal information" },
              { right: "Rectification", desc: "Request correction of inaccurate or incomplete data" },
              { right: "Erasure", desc: "Request deletion of your personal information" },
              { right: "Restriction", desc: "Request restriction of processing your information" },
              { right: "Portability", desc: "Request transfer of your data to another service provider" },
              { right: "Objection", desc: "Object to processing of your personal information" },
              { right: "Withdraw Consent", desc: "Withdraw consent for marketing communications at any time" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/30 p-5 rounded-xl border border-violet-200/50 dark:border-violet-800/30 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-50 mb-1">{item.right}</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 p-5 rounded-xl border border-blue-300/30 dark:border-blue-700/30 backdrop-blur-sm">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "7. Cookies and Tracking Technologies",
      icon: ClockIcon,
      gradient: "from-cyan-500 to-blue-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie preferences through your browser settings. However, disabling cookies may limit certain website functionalities.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { type: "Essential Cookies", desc: "Required for basic website functionality" },
              { type: "Analytics Cookies", desc: "Help us understand how visitors interact with our website" },
              { type: "Marketing Cookies", desc: "Used to deliver relevant advertisements and track campaign effectiveness" },
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/30 dark:to-blue-950/30 p-5 rounded-xl border border-cyan-200/50 dark:border-cyan-800/30 backdrop-blur-sm">
                <h5 className="font-bold text-slate-900 dark:text-slate-50 mb-2">{item.type}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "data-retention",
      title: "8. Data Retention",
      icon: ClockIcon,
      gradient: "from-slate-500 to-gray-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
          </p>
        </div>
      ),
    },
    {
      id: "children-privacy",
      title: "9. Children's Privacy",
      icon: ExclamationTriangleIcon,
      gradient: "from-yellow-500 to-orange-500",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-6 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30 backdrop-blur-sm">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "changes",
      title: "10. Changes to This Privacy Policy",
      icon: DocumentTextIcon,
      gradient: "from-teal-500 to-cyan-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of our services after such modifications constitutes acceptance of the updated policy.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "11. Contact Us",
      icon: ShieldCheckIcon,
      gradient: "from-blue-500 to-indigo-500",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 rounded-2xl text-white shadow-2xl">
            <h4 className="font-bold text-2xl mb-4">Almon Products Ltd</h4>
            <div className="space-y-3 text-blue-50">
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                Email: privacy@almonproducts.com
              </p>
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                Phone: [Your Contact Number]
              </p>
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                Address: [Your Business Address]
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Ultra HD Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-full blur-[120px]"
          animate={{
            x: [0, 150, 0],
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
          className="absolute bottom-20 right-10 w-[700px] h-[700px] bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-blue-400/30 rounded-full blur-[140px]"
          animate={{
            x: [0, -120, 0],
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
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-[100px]"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
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
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl"
                >
                  <ShieldCheckIcon className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                    Privacy Policy
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
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-black mb-6 leading-tight">Your Privacy Matters</h2>
                <p className="text-xl opacity-95 leading-relaxed max-w-3xl font-light">
                  At Almon Products Ltd, we are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your personal information. This Privacy Policy outlines our practices and your rights regarding your data.
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
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
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
                    className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">{index + 1}.</span>
                    <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 font-medium text-sm transition-colors">
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
                        whileHover={{ scale: 1.1, rotate: 5 }}
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
                  href="/terms-of-service"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Terms of Service
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
