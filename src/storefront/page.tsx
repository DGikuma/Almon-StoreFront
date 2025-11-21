"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { CartButton } from "@/components/CartButton";
import { SearchBar } from "@/components/SearchBar";
import TrackOrderPopup from "@/components/TrackOrderPopup";
import DeliveryModal from "@/components/DeliveryModal";
import { motion } from "framer-motion";
import { Divider, Button, Tabs, Tab } from "@heroui/react";
import { SunIcon, MoonIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

// ---------- Types & Data (kept from original, lightly cleaned) ----------
interface ProductVariant { name: string; price: number }
interface Product { id: string; name: string; image: string; variants: ProductVariant[]; description?: string }

const productSaleType: Record<string, "roll" | "metre" | "sheet" | "unit"> = {
  "frontlit-banner-1-5-m-440gsm": "roll",
  "frontlit-banner-2-7-m-440gsm": "roll",
  "frontlit-banner-1-2-m-440gsm": "roll",
  "black-back-1-06-440gsm": "roll",
  "black-back-1-6": "roll",
  "black-back-2-metre": "metre",
  "black-back-3-2-440gsm": "roll",
  "corex-5mm": "sheet",
  "aluco-3mm-black": "sheet",
  "aluco-blue": "sheet",
  "aluco-gold-brushed": "sheet",
  "aluco-silver-brushed": "sheet",
  "aluco-white-3mm": "sheet",
  "aluminium-big-cutter": "unit",
  "aluminium-normal-rollup": "unit",
  "aluminium-small-cutter": "unit",
  "corex-3mm": "sheet",
  "forex-2mm": "sheet",
  "forex-3mm": "sheet",
  "forex-4mm": "sheet",
  "forex-5mm": "sheet",
  "forex-celucar-10mm": "sheet",
  "scissors": "unit",
  "abs-0-9": "sheet",
  "airbag": "unit",
  "backdrop-2-25-3-65": "unit",
  "backdrop-3-3": "unit",
  "big-blade-pckt": "unit",
  "big-knife": "unit",
  "broadbase": "unit",
  "broadbase-4-5kg-aluminium": "unit",
  "card-holder": "unit",
  "carrier-bag": "unit",
  "cellotape-small": "unit",
  "channellium": "unit",
  "clear-gloss-roll-1-35": "roll",
  "clear-matt-roll-1-35": "roll",
  "corex-4mm": "sheet",
  "door-frame-80-180": "unit",
  "dtf-pet-film-0-6-100m": "roll",
  "envelope-a3": "unit",
  "eyelet-machine": "unit",
  "eyelets-small-pckt": "unit",
  "f2": "unit",
  "folder-pcs": "unit",
  "frosted-window-film-roll-1-27": "roll",
  "indoor-stands": "unit",
  "key-holder": "unit",
  "lanyard-big-grey": "unit",
  "lanyard-big-orange": "unit",
  "lanyard-big-white": "unit",
  "lanyard-small-black": "unit",
  "lanyard-small-blue": "unit",
  "lanyard-small-green": "unit",
  "lanyard-small-yellow": "unit",
  "lanyard-small-orange": "unit",
  "lanyard-small-pink": "unit",
  "masking-tape-1-inch": "roll",
  "masking-tape-2-inch": "roll",
  "medals": "unit",
  "name-tag-a2": "unit",
  "name-tag-blue-soft-card": "unit",
  "neon-light": "unit",
  "normal-roll-up": "unit",
  "note-book-a4-gold": "unit",
  "note-book-a5-blue": "unit",
  "note-book-a4-dark-blue": "unit",
  "note-book-a4-light-blue": "unit",
  "note-book-a4-orange": "unit",
  "note-book-a4-pink": "unit",
  "note-book-a5-brown": "unit",
  "note-book-a5-maroon": "unit",
  "one-way-vision-1-35": "roll",
  "packing-1-inch-50m": "roll",
  "pen-executive": "unit",
  "permanent-marker": "unit",
  "persepex-clear": "sheet",
  "persepex-white": "sheet",
  "perspex-knife": "unit",
  "pop-up-3-by-3": "unit",
  "pop-up-a-shape-80-180": "unit",
  "rainbow-film-1-37": "roll",
  "satin-0-914": "roll",
  "silver-big-cutter": "unit",
  "small-blade": "unit",
  "small-flag": "unit",
  "small-knife": "unit",
  "snapper-frame-a0": "unit",
  "snapper-frame-a1": "unit",
  "snapper-frame-a2": "unit",
  "snapper-frame-a3": "unit",
  "snapper-frame-a4": "unit",
  "spacers-gold": "unit",
  "spacers-silver": "unit",
  "spacers-white": "unit",
  "sparkle-frost-glitters-4ft": "roll",
  "squeegee-big-blue": "unit",
  "squeegee-handle": "unit",
  "squeegee-small-blue": "unit",
  "squeegee-white-blue": "unit",
  "squeegee-yellow-green": "unit",
  "super-glue": "unit",
  "tape-caution-black-yellow": "unit",
  "tape-caution-white-red": "unit",
  "tape-packing-clear-2inch": "unit",
  "tear-drop-3-5": "unit",
  "tear-drop-4-5": "unit",
  "tear-drops-2-5": "unit",
  "telescopic-4-5": "unit",
  "uhu-20ml": "unit",
  "uhu-35ml": "unit",
  "uhu-big-125ml": "unit",
  "uhu-medium-60ml": "unit",
  "wrist-band-small-yellow": "unit",
  "wrist-band-big-green": "unit",
  "wrist-band-big-orange": "unit",
  "wrist-band-small-black": "unit",
  "wrist-band-small-blue": "unit",
  "wrist-band-small-light-blue": "unit",
  "wrist-band-small-orange": "unit",
  "wrist-band-small-pink": "unit",
  "wrist-band-small-purple": "unit",
  "wrist-band-small-red": "unit",
  "wrist-band-small-white": "unit",
  "wrist-paper-black": "unit",
  "wrist-paper-blue": "unit",
  "wrist-paper-db-green": "unit",
  "wrist-paper-green": "unit",
  "wrist-paper-orange": "unit",
  "wrist-paper-pink": "unit",
  "wrist-paper-purple": "unit",
  "wrist-paper-red": "unit",
  "wrist-paper-white": "unit",
  "wrist-paper-yellow": "unit",
  "x-stand": "unit"
};

const productDetailsEntries = [
  ["frontlit-banner-1-5-m-440gsm", { price: 4200, image: "/images/products/frontlit-banner-1-5.jpg" }],
  ["frontlit-banner-2-7-m-440gsm", { price: 7200, image: "/images/products/frontlit-banner-1-5.jpg" }],
  ["frontlit-banner-1-2-m-440gsm", { price: 3500, image: "/images/products/frontlit-banner-1-5.jpg" }],
  ["clear-gloss-roll-1-35", { price: 1200, image: "/images/products/clear-gloss-roll-1-35.jpeg" }],
  ["clear-matt-roll-1-35", { price: 1200, image: "/images/products/clear-matt-roll-1-35.jpeg" }],
  ["corex-3mm", { price: 1200, image: "/images/products/corex-3mm.jpeg" }],
  ["corex-4mm", { price: 1200, image: "/images/products/corex-4mm.jpeg" }],
  ["black-back-1-06-440gsm", { price: 4900, image: "/images/products/blackback _banners_ rolls.jpg" }],
  ["black-back-1-6", { price: 6500, image: "/images/products/blackback _banners_ rolls.jpg" }],
  ["black-back-2-metre", { price: 1800, image: "/images/products/blackback _banners_ rolls.jpg" }],
  ["black-back-3-2-440gsm", { price: 8900, image: "/images/products/blackback _banners_ rolls.jpg" }],
  ["corex-5mm", { price: 1800, image: "/images/products/corex-5mm.jpeg" }],
  ["aluco-3mm-black", { price: 3100, image: "/images/products/aluco-3mm-black.jpeg" }],
  ["aluco-blue", { price: 3200, image: "/images/products/aluco-blue.jpeg" }],
  ["aluco-gold-brushed", { price: 3500, image: "/images/products/aluco-gold-brushed.jpeg" }],
  ["aluco-silver-brushed", { price: 3500, image: "/images/products/aluco-silver-brushed.jpeg" }],
  ["aluco-white-3mm", { price: 3000, image: "/images/products/aluco-white-3mm.jpeg" }],
  ["aluminium-big-cutter", { price: 950, image: "/images/products/aluminium-big-cutter.jpg" }],
  ["aluminium-small-cutter", { price: 450, image: "/images/products/aluminium-small-cutter.jpg" }],
  ["forex-2mm", { price: 2600, image: "/images/products/forex-2mm.jpeg" }],
  ["forex-3mm", { price: 2600, image: "/images/products/forex-3mm.jpeg" }],
  ["forex-4mm", { price: 2600, image: "/images/products/forex-4mm.jpeg" }],
  ["forex-5mm", { price: 3400, image: "/images/products/forex-5mm.jpeg" }],
  ["forex-celucar-10mm", { price: 3400, image: "/images/products/forex-celucar-10mm.jpeg" }],
  ["scissors", { price: 1200, image: "/images/products/scissors.jpeg" }],
  ["abs-0-9", { price: 1200, image: "/images/products/abs-0-9.jpeg" }],
  ["airbag", { price: 1200, image: "/images/products/airbag.jpeg" }],
  ["backdrop-2-25-3-65", { price: 1200, image: "/images/products/backdrop-2-25-3-65.jpeg" }],
  ["backdrop-3-3", { price: 1200, image: "/images/products/backdrop-3-3.jpeg" }],
  ["big-blade-pckt", { price: 1200, image: "/images/products/big-blade-pckt.jpeg" }],
  ["big-knife", { price: 1200, image: "/images/products/big-knife.jpeg" }],
  ["broadbase", { price: 1200, image: "/images/products/broadbase.jpeg" }],
  ["frosted-window-film-roll-1-27", { price: 7200, image: "/images/products/frosted-film-roll.jpeg" }],
  ["one-way-vision-1-35", { price: 6300, image: "/images/products/one-way-vision.jpg" }],
  ["dtf-pet-film-0-6-100m", { price: 12400, image: "/images/products/dtf-pet-film.jpeg" }],
  ["rainbow-film-1-37", { price: 6900, image: "/images/products/rainbow-film.jpg" }],
  ["satin-0-914", { price: 8900, image: "/images/products/satin-roll.jpg" }],
  ["sparkle-frost-glitters-4ft", { price: 8800, image: "/images/products/sparkle-frost-glitter.jpg" }],
  ["wrist-band-small-yellow", { price: 40, image: "/images/products/wristband-yellow.jpg" }],
  ["wrist-band-small-black", { price: 40, image: "/images/products/wristband-black.jpg" }],
  ["wrist-band-small-blue", { price: 40, image: "/images/products/wristband-blue.jpg" }],
  ["wrist-band-small-orange", { price: 40, image: "/images/products/wristband-orange.jpg" }],
  ["wrist-paper-red", { price: 30, image: "/images/products/wrist-paper-red.jpg" }],
  ["wrist-paper-green", { price: 30, image: "/images/products/wrist-paper-green.jpg" }],
  ["pen-executive", { price: 180, image: "/images/products/pen-executive.jpg" }],
  ["super-glue", { price: 120, image: "/images/products/super_glue.jpg" }],
  ["masking-tape-1-inch", { price: 350, image: "/images/products/masking-tape-1.jpeg" }],
  ["masking-tape-2-inch", { price: 550, image: "/images/products/masking-tape-2.jpeg" }],
  ["normal-roll-up", { price: 6200, image: "/images/products/normal-roll-up.jpg" }],
  ["snapper-frame-a1", { price: 1800, image: "/images/products/snapper-frame-a1.jpg" }],
  ["snapper-frame-a3", { price: 1200, image: "/images/products/snapper-frame-a3.jpg" }],
  ["broadbase", { price: 7000, image: "/images/products/Broad_base_stand.jpg" }],
  ["channellium", { price: 600, image: "/images/products/channellium.jpg" }],
  ["squeegee-yellow-green", { price: 250, image: "/images/products/squeegee-yellow-green.jpg" }],
  ["envelope-a3", { price: 1200, image: "/images/products/envelope-a3.jpg" }],
  ["eyelet-machine", { price: 1200, image: "/images/products/eyelet-machine.jpg" }],
  ["eyelets-small-pckt", { price: 1200, image: "/images/products/eyelets-small-pckt.jpg" }],
  ["f2", { price: 1200, image: "/images/products/f2_glue.jpg" }],
  ["folder-pcs", { price: 1200, image: "/images/products/folder-pcs.jpg" }],
  ["indoor-stands", { price: 1200, image: "/images/products/indoor-stands.jpg" }],
  ["key-holder", { price: 1200, image: "/images/products/key-holder.jpg" }],
  ["lanyard-big-grey", { price: 1200, image: "/images/products/lanyard-big-grey.jpg" }],
  ["lanyard-big-orange", { price: 1200, image: "/images/products/lanyard-big-orange.jpg" }],
  ["lanyard-big-white", { price: 1200, image: "/images/products/lanyard-big-white.jpg" }],
  ["lanyard-small-black", { price: 1200, image: "/images/products/lanyard-small-black.jpg" }],
  ["lanyard-small-blue", { price: 1200, image: "/images/products/lanyard-small-blue.jpg" }],
  ["lanyard-small-green", { price: 1200, image: "/images/products/lanyard-small-green.jpg" }],
  ["lanyard-small-yellow", { price: 1200, image: "/images/products/lanyard-small-yellow.jpg" }],
  ["lanyard-small-orange", { price: 1200, image: "/images/products/lanyard-small-orange.jpg" }],
  ["lanyard-small-pink", { price: 1200, image: "/images/products/lanyard-small-pink.jpg" }],
  ["masking-tape-1-inch", { price: 1200, image: "/images/products/masking-tape-1.jpeg" }],
  ["masking-tape-2-inch", { price: 1200, image: "/images/products/masking-tape-2.jpeg" }],
  ["medals", { price: 1200, image: "/images/products/medals.jpg" }],
  ["name-tag-a2", { price: 1200, image: "/images/products/name-tag-a2.jpg" }],
  ["name-tag-blue-soft-card", { price: 1200, image: "/images/products/name-tag-blue-soft-card.jpg" }],
  ["neon-light", { price: 1200, image: "/images/products/neon-light.jpg" }],
  ["normal-roll-up", { price: 1200, image: "/images/products/normal-roll-up.jpg" }],
  ["note-book-a4-gold", { price: 1200, image: "/images/products/note-book-a4-gold.jpg" }],
  ["note-book-a5-blue", { price: 1200, image: "/images/products/note-book-a5-blue.jpg" }],
  ["note-book-a4-dark-blue", { price: 1200, image: "/images/products/note-book-a4-dark-blue.jpg" }],
  ["note-book-a4-light-blue", { price: 1200, image: "/images/products/note-book-a4-light-blue.jpg" }],
  ["note-book-a4-orange", { price: 1200, image: "/images/products/note-book-a4-orange.jpg" }],
  ["note-book-a4-pink", { price: 1200, image: "/images/products/note-book-a4-pink.jpg" }],
  ["note-book-a5-brown", { price: 1200, image: "/images/products/note-book-a5-brown.jpg" }],
  ["note-book-a5-maroon", { price: 1200, image: "/images/products/note-book-a5-maroon.jpg" }],
  ["one-way-vision-1-35", { price: 1200, image: "/images/products/oneway_vision.jpg" }],
  ["packing-1-inch-50m", { price: 1200, image: "/images/products/packing-1-inch-50m.jpeg" }],
  ["pen-executive", { price: 1200, image: "/images/products/pen-executive.jpg" }],
  ["permanent-marker", { price: 1200, image: "/images/products/permanent-marker.jpg" }],
  ["persepex-clear", { price: 1200, image: "/images/products/persepex-clear.jpeg" }],
  ["persepex-white", { price: 1200, image: "/images/products/persepex-white.jpeg" }],
  ["perspex-knife", { price: 1200, image: "/images/products/perspex-knife.jpg" }],
  ["pop-up-3-by-3", { price: 1200, image: "/images/products/pop-up-3-by-3.jpg" }],
  ["pop-up-a-shape-80-180", { price: 1200, image: "/images/products/pop-up-a-shape-80-180.jpg" }],
  ["rainbow-film-1-37", { price: 1200, image: "/images/products/rainbow-film.jpeg" }],
  ["satin-0-914", { price: 1200, image: "/images/products/satin-roll.jpeg" }],
  ["silver-big-cutter", { price: 1200, image: "/images/products/silver-big-cutter.jpg" }],
  ["small-blade", { price: 1200, image: "/images/products/spare_blades.jpg" }],
  ["small-flag", { price: 1200, image: "/images/products/small-flag.jpg" }],
  ["small-knife", { price: 1200, image: "/images/products/small-knife.jpg" }],
  ["snapper-frame-a0", { price: 1200, image: "/images/products/snapper-frame-a0.jpg" }],
  ["snapper-frame-a2", { price: 1200, image: "/images/products/snapper-frame-a2.jpg" }],
  ["spacers-gold", { price: 1200, image: "/images/products/spacers-gold.jpg" }],
  ["spacers-silver", { price: 1200, image: "/images/products/spacers-silver.jpg" }],
  ["spacers-white", { price: 1200, image: "/images/products/spacers-white.jpg" }],
  ["sparkle-frost-glitters-4ft", { price: 1200, image: "/images/products/sparkle-frost-glitter.jpeg" }],
  ["squeegee-big-blue", { price: 1200, image: "/images/products/squeegee big blue.jpg" }],
  ["squeegee-handle", { price: 1200, image: "/images/products/squeegee handle.jpg" }],
  ["squeegee-small-blue", { price: 1200, image: "/images/products/squeegee big blue.jpg" }],
  ["squeegee-white-blue", { price: 1200, image: "/images/products/squeege white blue.jpg" }],
  ["squeegee-yellow-green", { price: 1200, image: "/images/products/squeegee yellow green.jpg" }],
  ["super-glue", { price: 1200, image: "/images/products/super-glue.jpg" }],
  ["tape-caution-black-yellow", { price: 1200, image: "/images/products/tape-caution-black-yellow.jpg" }],
  ["tape-caution-white-red", { price: 1200, image: "/images/products/tape-caution-white-red.jpg" }],
  ["tape-packing-clear-2inch", { price: 1200, image: "/images/products/tape-packing-clear-2inch.jpg" }],
  ["tear-drop-3-5", { price: 1200, image: "/images/products/tear-drop-3-5.jpg" }],
  ["tear-drop-4-5", { price: 1200, image: "/images/products/tear-drop-4-5.jpg" }],
  ["tear-drops-2-5", { price: 1200, image: "/images/products/tear-drops-2-5.jpg" }],
  ["telescopic-4-5", { price: 1200, image: "/images/products/telescopic-4-5.jpg" }],
  ["uhu-20ml", { price: 1200, image: "/images/products/uhu_glue.jpg" }],
  ["uhu-35ml", { price: 1200, image: "/images/products/uhu_glue.jpg" }],
  ["uhu-big-125ml", { price: 1200, image: "/images/products/uhu_glue.jpg" }],
  ["uhu-medium-60ml", { price: 1200, image: "/images/products/uhu_glue.jpg" }],
  ["wrist-band-small-yellow", { price: 1200, image: "/images/products/wristband-yellow.jpg" }],
  ["wrist-band-small-black", { price: 1200, image: "/images/products/wristband-black.jpg" }],
  ["wrist-band-small-blue", { price: 1200, image: "/images/products/wristband-blue.jpg" }],
  ["wrist-band-small-orange", { price: 1200, image: "/images/products/wristband-orange.jpg" }],
  ["wrist-paper-red", { price: 1200, image: "/images/products/wrist-paper-red.jpg" }],
  ["wrist-paper-green", { price: 1200, image: "/images/products/wrist-paper-green.jpg" }],
  ["wrist-paper-orange", { price: 1200, image: "/images/products/wrist-paper-orange.jpg" }],
  ["wrist-paper-pink", { price: 1200, image: "/images/products/wrist-paper-pink.jpg" }],
  ["wrist-paper-purple", { price: 1200, image: "/images/products/wrist-paper-purple.jpg" }],
  ["wrist-paper-white", { price: 1200, image: "/images/products/wrist-paper-white.jpg" }],
  ["wrist-paper-yellow", { price: 1200, image: "/images/products/wrist-paper-yellow.jpg" }],
  ["x-stand", { price: 1200, image: "/images/products/x-stand.jpg" }],
] as const;

const productDetails = Object.fromEntries(productDetailsEntries) as Record<string, { price: number; image: string }>;

// ---------- Delivery Fee Configuration ----------
const deliveryAreas: Record<string, number> = {
  "nairobi-cbd": 500,
  "westlands": 600,
  "kilimani": 600,
  "parklands": 600,
  "lavington": 700,
  "karen": 800,
  "runda": 800,
  "langata": 700,
  "kasarani": 700,
  "roysambu": 700,
  "ruiru": 800,
  "thika": 1000,
  "juja": 900,
  "kiambu": 800,
  "ruaka": 700,
  "rongai": 800,
  "ngong": 900,
  "kikuyu": 900,
  "westlands-area": 600,
  "other": 1000, // Default for other areas
};

// ---------- Utility helpers ----------
const formatProductName = (id: string) =>
  id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/(\d)\s+(\d)/g, "$1.$2")
    .replace(/\s{2,}/g, " ");

// ---------- Theme helpers ----------
const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // prefer saved theme, otherwise system
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved === "dark" || (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
};

// ---------- Page Component ----------
export default function StorefrontPage() {
  // state
  const [cart, setCart] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { theme, toggle } = useTheme();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<any>("roll");
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState<string>("");

  // NOTE: Keep your original product data source and mapping. For compatibility we use `products` variable here.
  // If you'd prefer, import `products` from a shared file. Below is a minimized placeholder so the page compiles
  // during local edits. Replace with the full dataset you already have in the original page.

  type ProductSaleType = "roll" | "metre" | "sheet" | "unit";

  const toVariantLabel = (saleType: ProductSaleType) => {
    switch (saleType) {
      case "metre": return "Metre";
      case "roll": return "Roll";
      case "sheet": return "Sheet";
      case "unit":
      default: return "Unit";
    }
  };

  const getMetreMultiplier = (variant: string) => {
    const match = variant.match(/([\d.]+)/);
    return match ? Number(match[1]) || 1 : 1;
  };

  const products: Product[] = useMemo(() => {
    return Object.entries(productSaleType).map(([id, saleType]) => {
      const variantLabel = toVariantLabel(saleType);
      const details = productDetails[id] || { price: 0, image: "/images/product-placeholder.jpg" };
      return {
        id,
        name: formatProductName(id),
        image: details.image,
        variants: [{ name: variantLabel, price: details.price }],
        description: `Sold per ${variantLabel.toLowerCase()}.`,
      };
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      [p.name, p.description ?? "", ...p.variants.map((v) => v.name)]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  const productsByType = useMemo(() => {
    const grouped: Record<ProductSaleType, Product[]> = {
      roll: [],
      metre: [],
      sheet: [],
      unit: [],
    };
    filteredProducts.forEach((p) => {
      const saleType = productSaleType[p.id] || "unit";
      grouped[saleType].push(p);
    });
    return grouped;
  }, [filteredProducts]);

  const getSelectedVariant = (product: Product) =>
    selectedVariants[product.id] ?? product.variants[0].name;

  const getVariantPrice = (product: Product, variant: string) => {
    const basePrice = product.variants.find((v) => v.name === variant)?.price ?? product.variants[0].price;
    const saleType = productSaleType[product.id] ?? "unit";
    return saleType === "metre" ? basePrice * getMetreMultiplier(variant) : basePrice;
  };

  const handleVariantChange = (productId: string, variant: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  const handleAddToCart = (product: Product) => {
    const variant = getSelectedVariant(product);
    const price = getVariantPrice(product, variant);
    const existing = cart.find((item) => item.id === `${product.id}-${variant}`);
    if (existing) {
      setCart(cart.map((item) => item.id === `${product.id}-${variant}` ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { id: `${product.id}-${variant}`, name: product.name, variant, price, quantity: 1 }]);
    }
  };

  const handleIncrease = (cartId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (cartId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === cartId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryArea && deliveryAreas[deliveryArea] ? deliveryAreas[deliveryArea] : 0;
  const total = subtotal + deliveryFee;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-slate-100 dark:from-[#0d0d0d] dark:via-[#111] dark:to-black text-slate-900 dark:text-gray-100 transition-colors duration-500">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/60 dark:bg-black/30 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)] supports-[backdrop-filter]:bg-white/40 transition-all duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            {/* Top Row: Logo and Action Buttons */}
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <img src="/images/logo.jpg" alt="Almon Products logo" className="w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-contain shadow-sm" />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-extrabold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-sky-600">Almon Products</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Premium Materials & Finishing</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-sm font-extrabold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-sky-600">Almon</h1>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <Button
                  onPress={toggle}
                  isIconOnly
                  className="rounded-full p-2 sm:px-5 sm:py-3 font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 bg-gradient-to-r from-pink-600 to-sky-600 text-white dark:from-pink-500 dark:to-sky-500"
                >
                  <motion.div
                    key={theme}
                    initial={{ rotate: -180, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 180, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {theme === "dark" ? (
                      <SunIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </motion.div>
                </Button>

                <CartButton count={cart.reduce((s, i) => s + i.quantity, 0)} onOpen={() => setDrawerOpen(true)} />

                {/* Delivery Button - Mobile Icon, Desktop Full */}
                <Button
                  onPress={() => setDeliveryModalOpen(true)}
                  color="primary"
                  isIconOnly
                  className="sm:hidden rounded-full p-2 shadow-sm hover:shadow-md"
                  title="Delivery"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </Button>
                <Button
                  onPress={() => setDeliveryModalOpen(true)}
                  color="primary"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  Delivery
                </Button>

                {/* Track Order Button - Mobile Icon, Desktop Full */}
                <Button
                  onPress={() => setTrackModalOpen(true)}
                  color="primary"
                  isIconOnly
                  className="sm:hidden rounded-full p-2 shadow-sm hover:shadow-md"
                  title="Track Order"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                </Button>
                <Button
                  onPress={() => setTrackModalOpen(true)}
                  color="primary"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <ShoppingBagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium hidden lg:inline">Track Order</span>
                  <span className="font-medium lg:hidden">Track</span>
                </Button>
              </div>
            </div>

            {/* Search Bar Row - Full Width on Mobile */}
            <div className="w-full sm:max-w-xl sm:mx-auto sm:mt-0">
              <SearchBar query={search} onSearch={setSearch} />
            </div>
          </div>
        </header>

        <Divider className="opacity-30" />

        {/* Hero */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-extrabold leading-tight">
                Materials that speak for your brand
              </motion.h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                High-grade banners, substrates and finishing materials — engineered for longevity and brilliant print results. Explore by sale type or search for a product directly.
              </p>

            </div>

            <div className="lg:col-span-5">
              <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-white/10 rounded-3xl">
                <img src="/images/banner/hero-banner.png" alt="Product showcase" className="w-full h-56 object-cover rounded-3xl transition-transform duration-500 hover:scale-[1.04] hover:-rotate-[0.5deg]" />
              </div>
            </div>
          </div>

          {/* Tabs + Product Grid */}
          <section className="mt-10">
            <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as ProductSaleType)} className="mb-6">
              {(["roll", "metre", "sheet", "unit"] as const).map((tabKey) => {
                const prods = productsByType[tabKey];
                return (
                  <Tab key={tabKey} title={tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}>
                    {filteredProducts.length === 0 && search !== "" ? (
                      <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 gap-6 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-64 bg-white/40 dark:bg-white/10 rounded-3xl backdrop-blur-md" />
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                      >
                        {prods.length > 0 ? (
                          prods.map((product) => {
                            const selectedVariant = getSelectedVariant(product);
                            const cartId = `${product.id}-${selectedVariant}`;
                            const cartItem = cart.find((item) => item.id === cartId);
                            return (
                              <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                description={product.description ?? "High quality product."}
                                image={product.image}
                                price={getVariantPrice(product, selectedVariant)}
                                variants={product.variants.map((v) => v.name)}
                                selectedVariant={selectedVariant}
                                onVariantChange={(variant) => handleVariantChange(product.id, variant)}
                                onAddToCart={() => handleAddToCart(product)}
                                onIncrease={cartItem ? () => handleIncrease(cartId) : undefined}
                                onDecrease={cartItem ? () => handleDecrease(cartId) : undefined}
                                quantity={cartItem?.quantity}
                                saleType={productSaleType[product.id] ?? "unit"}
                              />
                            );
                          })
                        ) : (
                          <p className="col-span-full text-center text-sm text-gray-500 dark:text-gray-400">
                            No products match your search.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </Tab>
                );
              })}
            </Tabs>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-white/70 to-white/40 dark:from-neutral-900/60 dark:to-neutral-900/40 backdrop-blur-xl py-10 border-t border-white/20 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">

              {/* Company Info */}
              <div className="text-sm text-gray-700 dark:text-gray-300 tracking-wide">
                <span className="font-semibold text-sky-700 dark:text-sky-400">
                  Almon Products Ltd
                </span>{" "}
                — © {new Date().getFullYear()}. All rights reserved.
              </div>

              {/* Links + Accent Color */}
              <div className="flex gap-6 items-center text-sm font-medium text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                  <span className="text-gray-700 dark:text-gray-300">Made with care</span>
                </span>

                <span className="text-gray-400">|</span>

                <a
                  className="text-sky-700 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 underline-offset-4 hover:underline transition-all"
                  href="#"
                >
                  Privacy Policy
                </a>
              </div>

            </div>
          </div>
        </footer>

        {/* Drawers / Modals */}
        <CartDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          cartItems={cart}
          onRemove={(id: string) => setCart((prev) => prev.filter((i) => i.id !== id))}
          onCheckout={() => {
            setDrawerOpen(false);
            setCheckoutOpen(true);
          }}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
        />

        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          deliveryArea={deliveryArea}
          onDeliveryAreaChange={setDeliveryArea}
        />

        {trackModalOpen && <TrackOrderPopup isOpen={trackModalOpen} onClose={() => setTrackModalOpen(false)} />}
        {deliveryModalOpen && <DeliveryModal isOpen={deliveryModalOpen} onClose={() => setDeliveryModalOpen(false)} />}
      </div>
    </motion.div>
  );
}
