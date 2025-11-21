export type Variant = {
  id: string;
  name: string;
  price: number;
};

export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  variants: Variant[];
};

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "p-aloha-dress",
    title: "Aloha Breeze Dress",
    subtitle: "Floaty summer dress",
    description:
      "A lightweight, breathable dress with a tropical print. Perfect for sunlit days and high-res selfies.",
    image: "/images/dress.jpg",
    variants: [
      { id: "v1", name: "S - Sky", price: 3200 },
      { id: "v2", name: "M - Coral", price: 3400 },
      { id: "v3", name: "L - Ocean", price: 3600 },
    ],
  },
  {
    id: "p-urban-sneaker",
    title: "Urban Motion Sneakers",
    subtitle: "Street-smart comfort",
    description:
      "Engineered rubber sole, plush memory foam, and neon accents for that modern, colorful pop.",
    image: "/images/sneakers.jpg",
    variants: [
      { id: "v1", name: "40 - White", price: 5200 },
      { id: "v2", name: "41 - Black", price: 5200 },
      { id: "v3", name: "42 - Neon", price: 5600 },
    ],
  },
  {
    id: "p-aurora-watch",
    title: "Aurora Smartwatch",
    subtitle: "Notifications + wellness",
    description:
      "Sleek AMOLED display, 7-day battery mode, and connected health tracking. A small device, big vibes.",
    image: "/images/watch.jpg",
    variants: [
      { id: "v1", name: "Standard - Silver", price: 8200 },
      { id: "v2", name: "Sport - Black", price: 9000 },
    ],
  },
];
