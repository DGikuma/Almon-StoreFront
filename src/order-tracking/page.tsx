"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import {
  Card,
  Input,
  Button,
  Tabs,
  Tab,
  Progress,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  CubeIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Icon } from "leaflet";
import { useMotionValue, motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

const LeafletMap = lazy(() => import("./LeafletMap").then((mod) => ({ default: mod.default })));

// ------------------------------------------------------

interface Order {
  id: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: { name: string; quantity: number; price: number }[];
  address: string;
  estimatedDelivery: string;
}

// Sample Nairobi route
const route: [number, number][] = [
  [-1.2921, 36.8219],
  [-1.285, 36.82],
  [-1.28, 36.825],
  [-1.275, 36.83],
  [-1.27, 36.835],
];

const truckIcon = new Icon({
  iconUrl: "/images/truck-icon.png",
  iconSize: [35, 35],
});

const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];
const statusIcons: Record<string, JSX.Element> = {
  Pending: <CubeIcon className="w-6 h-6 text-yellow-500" />,
  Processing: <CubeIcon className="w-6 h-6 text-blue-500" />,
  Shipped: <TruckIcon className="w-6 h-6 text-indigo-500" />,
  Delivered: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  Cancelled: <XCircleIcon className="w-6 h-6 text-red-500" />,
};

// Dummy test orders
const dummyOrders: Order[] = [
  {
    id: "ALM-2025-001",
    status: "Processing",
    address: "Westlands, Nairobi, Kenya",
    estimatedDelivery: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    items: [
      { name: "Laptop (Dell XPS 13)", quantity: 1, price: 175000 },
      { name: "Wireless Mouse", quantity: 1, price: 3500 },
    ],
  },
  {
    id: "ALM-2025-002",
    status: "Shipped",
    address: "Karen, Nairobi, Kenya",
    estimatedDelivery: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    items: [
      { name: "Bluetooth Speaker", quantity: 1, price: 8500 },
      { name: "USB-C Charger", quantity: 1, price: 2800 },
    ],
  },
  {
    id: "ALM-2025-003",
    status: "Delivered",
    address: "Mombasa Road, Nairobi, Kenya",
    estimatedDelivery: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    items: [
      { name: "Smart TV 55''", quantity: 1, price: 68000 },
      { name: "HDMI Cable", quantity: 2, price: 1200 },
    ],
  },
];

// ------------------------------------------------------

export default function TrackOrderAnimated() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "status" | "map">("details");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const truckPosition = useMotionValue(0);

  // Handle tracking
  const handleTrack = async () => {
    setLoading(true);
    try {
      const found = dummyOrders.find((o) => o.id === orderId.trim());
      if (!found) {
        alert("Order not found. Try selecting from the dropdown.");
        return;
      }
      setOrder(found);
      setActiveTab("status");
      setCurrentStep(statusSteps.indexOf(found.status));
      setProgress((statusSteps.indexOf(found.status) + 1) * 25);
      truckPosition.set(0);
    } finally {
      setLoading(false);
    }
  };

  // Animate progress
  useEffect(() => {
    if (!order || order.status === "Cancelled") return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 25;
        if (next >= 100) {
          setCurrentStep(3);
          clearInterval(interval);
          return 100;
        }
        setCurrentStep(Math.floor(next / 25));
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [order]);

  // Countdown timer
  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      const delivery = new Date(order.estimatedDelivery).getTime();
      const diff = delivery - Date.now();
      if (diff <= 0) {
        setTimeLeft("Arriving soon!");
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  // Truck animation
  useEffect(() => {
    if (!order) return;
    const steps = route.length - 1;
    let current = 0;
    const animate = () => {
      if (current > steps) return;
      truckPosition.set(current);
      current += 0.03;
      requestAnimationFrame(animate);
    };
    animate();
  }, [order, truckPosition]);

  // Interpolated position
  const interpolatePosition = (): [number, number] => {
    const value = truckPosition.get();
    const idx = Math.floor(value);
    const nextIdx = Math.min(idx + 1, route.length - 1);
    const fraction = value - idx;
    const [lat1, lng1] = route[idx];
    const [lat2, lng2] = route[nextIdx];
    return [lat1 + (lat2 - lat1) * fraction, lng1 + (lng2 - lng1) * fraction];
  };

  // ------------------------------------------------------

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full"
      >
        <Card className="w-full rounded-3xl shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            Track Your Order
          </h1>

          {/* Input + Dummy Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input
              label="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ALM-2025-001"
            />
            <Dropdown>
              <DropdownTrigger>
                <Button color="secondary" variant="flat">
                  Dummy Orders
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Select dummy order">
                {dummyOrders.map((o) => (
                  <DropdownItem key={o.id} onClick={() => setOrderId(o.id)}>
                    {o.id} — {o.status}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              onClick={handleTrack}
              disabled={!orderId || loading}
              className="px-6 sm:px-8"
            >
              {loading ? "Loading..." : "Track"}
            </Button>
          </div>

          {/* Tabs */}
          {order && (
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) =>
                setActiveTab(key as "details" | "status" | "map")
              }
              className="mt-4"
            >
              <Tab key="details" title="Order Details">
                <div className="mt-4 space-y-2 text-sm sm:text-base">
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery}</p>
                  <p><strong>Countdown:</strong> {timeLeft}</p>
                  <p><strong>Shipping Address:</strong> {order.address}</p>

                  <div className="mt-3">
                    <h3 className="font-semibold mb-2">Items:</h3>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item.name}>
                          {item.quantity}× {item.name} — KES{" "}
                          {item.price.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Tab>

              <Tab key="status" title="Order Status">
                <div className="mt-6">
                  <Progress value={progress} size="lg" color="primary" className="mb-6" />
                  <div className="flex justify-between items-center">
                    {statusSteps.map((step, index) => (
                      <div key={step} className="flex flex-col items-center text-sm">
                        {statusIcons[step]}
                        <span
                          className={`mt-1 font-medium ${
                            index <= currentStep
                              ? "text-gray-800 dark:text-white"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab>

              <Tab key="map" title="Map View">
                <div className="mt-4 h-[350px] sm:h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
                  <Suspense
                    fallback={
                      <div className="flex justify-center items-center h-full">
                        <Spinner label="Loading map..." color="primary" />
                      </div>
                    }
                  >
                    <LeafletMap
                      route={route}
                      interpolatePosition={interpolatePosition}
                      truckIcon={truckIcon}
                    />
                  </Suspense>
                </div>
              </Tab>
            </Tabs>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
