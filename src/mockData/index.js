import {
  Crown,
  Diamond,
  Gem,
  Watch,
  Sparkles,
  Heart,
  Star,
} from "lucide-react";

export const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920",
    title: "Luxury Collection 2024",
    description: "Discover our newest arrivals",
  },
  {
    image:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1920",
    title: "Timeless Elegance",
    description: "Handcrafted with precision",
  },
  {
    image:
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1920",
    title: "Diamond Collection",
    description: "Pure brilliance in every piece",
  },
];

export const mockProducts = [
  // Rings
  {
    id: "ring-1",
    name: "Diamond Solitaire Ring",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800",
    weight: "3.5g",
    price: 2999.99,
    description: "18K White Gold Diamond Ring",
    category: "rings",
  },
  {
    id: "ring-2",
    name: "Ruby Engagement Ring",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800",
    weight: "4.2g",
    price: 1899.99,
    description: "Natural Ruby with Diamond Halo",
    category: "rings",
  },
  {
    id: "ring-3",
    name: "Vintage Pearl Ring",
    image:
      "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=800",
    weight: "3.2g",
    price: 799.99,
    description: "Vintage Pearl and Diamond Ring",
    category: "rings",
  },

  // Necklaces
  {
    id: "necklace-1",
    name: "Diamond Pendant Necklace",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800",
    weight: "8.5g",
    price: 1999.99,
    description: "1ct Diamond Solitaire Pendant",
    category: "necklaces",
  },
  {
    id: "necklace-2",
    name: "Pearl Strand",
    image:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800",
    weight: "25g",
    price: 1499.99,
    description: "Freshwater Pearl Strand Necklace",
    category: "necklaces",
  },
  {
    id: "necklace-3",
    name: "Gold Chain",
    image:
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800",
    weight: "15g",
    price: 899.99,
    description: "18K Gold Chain Necklace",
    category: "necklaces",
  },

  // Earrings
  {
    id: "earring-1",
    name: "Diamond Studs",
    image:
      "https://images.unsplash.com/photo-1589207212797-cfd546dea0fe?auto=format&fit=crop&w=800",
    weight: "2.8g",
    price: 2499.99,
    description: "2ct Total Diamond Studs",
    category: "earrings",
  },
  {
    id: "earring-2",
    name: "Pearl Drop Earrings",
    image:
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800",
    weight: "3.5g",
    price: 699.99,
    description: "South Sea Pearl Drops",
    category: "earrings",
  },
  {
    id: "earring-3",
    name: "Gold Hoops",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800",
    weight: "4g",
    price: 599.99,
    description: "14K Gold Hoop Earrings",
    category: "earrings",
  },

  // Silver Coins
  {
    id: "coin-1",
    name: "American Silver Eagle",
    image:
      "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800",
    weight: "31.1g",
    price: 35.99,
    description: "1oz Silver American Eagle Coin",
    category: "silver-coins",
  },
  {
    id: "coin-2",
    name: "Canadian Maple Leaf",
    image:
      "https://images.unsplash.com/photo-1621847468516-1ed5d0df56e8?auto=format&fit=crop&w=800",
    weight: "31.1g",
    price: 34.99,
    description: "1oz Silver Maple Leaf Coin",
    category: "silver-coins",
  },
  {
    id: "coin-3",
    name: "Silver Britannia",
    image:
      "https://images.unsplash.com/photo-1621847468516-1ed5d0df56e8?auto=format&fit=crop&w=800",
    weight: "31.1g",
    price: 33.99,
    description: "1oz Silver Britannia Coin",
    category: "silver-coins",
  },

  // Anklets
  {
    id: "anklet-1",
    name: "Sterling Silver Chain Anklet",
    image:
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800",
    weight: "3.5g",
    price: 49.99,
    description: "Sterling Silver Delicate Chain Anklet",
    category: "anklets",
  },
  {
    id: "anklet-2",
    name: "Pearl Charm Anklet",
    image:
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800",
    weight: "4g",
    price: 69.99,
    description: "Freshwater Pearl Charm Anklet",
    category: "anklets",
  },
  {
    id: "anklet-3",
    name: "Gold-Plated Bell Anklet",
    image:
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800",
    weight: "5g",
    price: 39.99,
    description: "Traditional Bell Charm Anklet",
    category: "anklets",
  },

  // Bangles
  {
    id: "bangle-1",
    name: "Gold Kada Bangle",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800",
    weight: "15g",
    price: 999.99,
    description: "Traditional Gold Kada Bangle",
    category: "bangles",
  },
  {
    id: "bangle-2",
    name: "Diamond Bangle",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800",
    weight: "12g",
    price: 1499.99,
    description: "Diamond Studded Gold Bangle",
    category: "bangles",
  },
  {
    id: "bangle-3",
    name: "Silver Filigree Bangle",
    image:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800",
    weight: "20g",
    price: 299.99,
    description: "Sterling Silver Filigree Bangle",
    category: "bangles",
  },

  // Bracelets
  {
    id: "bracelet-1",
    name: "Diamond Tennis Bracelet",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800",
    weight: "15g",
    price: 3999.99,
    description: "4ct Total Diamond Weight",
    category: "bracelets",
  },
  {
    id: "bracelet-2",
    name: "Gold Chain Bracelet",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800",
    weight: "12g",
    price: 1299.99,
    description: "22K Gold Chain Bracelet",
    category: "bracelets",
  },
  {
    id: "bracelet-3",
    name: "Charm Bracelet",
    image:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800",
    weight: "18g",
    price: 899.99,
    description: "Sterling Silver Charm Bracelet",
    category: "bracelets",
  },
];

export const categories = [
  {
    id: 1,
    name: "Rings",
    slug: "rings",
    icon: Diamond,
    description:
      "Stunning engagement rings, wedding bands, and statement pieces",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800",
  },
  {
    id: 2,
    name: "Necklaces",
    slug: "necklaces",
    icon: Heart,
    description: "Elegant pendants, chains, and statement necklaces",
    image:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800",
  },
  {
    id: 3,
    name: "Earrings",
    slug: "earrings",
    icon: Sparkles,
    description: "Beautiful studs, hoops, and drop earrings",
    image:
      "https://images.unsplash.com/photo-1635767798638-3665c302e27c?auto=format&fit=crop&w=800",
  },
  {
    id: 4,
    name: "Bracelets",
    slug: "bracelets",
    icon: Star,
    description: "Charming bangles, tennis bracelets, and cuffs",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800",
  },
  {
    id: 5,
    name: "Watches",
    slug: "watches",
    icon: Watch,
    description: "Luxury timepieces and designer watches",
    image:
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=800",
  },
  {
    id: 6,
    name: "Gemstones",
    slug: "gemstones",
    icon: Gem,
    description: "Precious and semi-precious stones",
    image:
      "https://images.unsplash.com/photo-1583937443351-f97a79a8686c?auto=format&fit=crop&w=800",
  },
  {
    id: 7,
    name: "Luxury Sets",
    slug: "luxury-sets",
    icon: Crown,
    description: "Complete jewelry sets for special occasions",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800",
  },
];

export const shopAddress =
  "21-3-88, Chelapuara, Ghansi Bazar, Hyderabad 500 002";

export const landlineNum = "040-66514933";
export const landlineNumber = "Landline: 040-66514933";
export const mobileNum = "+91-6304170035";
export const mobileNumber = "Mobile: +91-6304170035";
export const shopEmailId = "pavanjeweller@gmail.com";
export const shopOpenTime = {
  weekDays: "Mon - Sat: 11:00 AM - 10:00 PM",
  weekend: "Sun: 11:00 AM - 5:00 PM",
};
export const whatAppNumber = "914066514933";
