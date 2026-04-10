export type UserRole = "farmer" | "consumer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  description?: string;
  location?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  price: number;
  marketPrice: number;
  quantity: number;
  unit: string;
  image: string;
  description: string;
  location: string;
  category: string;
  rating: number;
  ratingCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  savedAmount: number;
  status: "Pending" | "Delivered";
  createdAt: string;
}

export const AI_PRICE_SUGGESTIONS: Record<string, { min: number; max: number; marketPrice: number; unit: string }> = {
  tomato: { min: 30, max: 40, marketPrice: 50, unit: "kg" },
  onion: { min: 20, max: 30, marketPrice: 40, unit: "kg" },
  potato: { min: 15, max: 25, marketPrice: 35, unit: "kg" },
  rice: { min: 40, max: 60, marketPrice: 80, unit: "kg" },
  wheat: { min: 20, max: 35, marketPrice: 50, unit: "kg" },
  carrot: { min: 25, max: 40, marketPrice: 55, unit: "kg" },
  spinach: { min: 15, max: 25, marketPrice: 40, unit: "bunch" },
  cucumber: { min: 20, max: 30, marketPrice: 45, unit: "kg" },
  mango: { min: 60, max: 100, marketPrice: 140, unit: "kg" },
  banana: { min: 20, max: 35, marketPrice: 50, unit: "dozen" },
  apple: { min: 80, max: 120, marketPrice: 160, unit: "kg" },
  grapes: { min: 50, max: 80, marketPrice: 120, unit: "kg" },
  milk: { min: 40, max: 55, marketPrice: 70, unit: "liter" },
  egg: { min: 5, max: 8, marketPrice: 10, unit: "piece" },
  garlic: { min: 60, max: 100, marketPrice: 150, unit: "kg" },
  ginger: { min: 40, max: 70, marketPrice: 100, unit: "kg" },
  chilli: { min: 30, max: 50, marketPrice: 80, unit: "kg" },
  cauliflower: { min: 20, max: 35, marketPrice: 50, unit: "piece" },
  cabbage: { min: 15, max: 25, marketPrice: 40, unit: "piece" },
  brinjal: { min: 20, max: 35, marketPrice: 55, unit: "kg" },
};

export function getAiPriceSuggestion(productName: string) {
  const lowerName = productName.toLowerCase().trim();
  for (const [key, value] of Object.entries(AI_PRICE_SUGGESTIONS)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }
  return null;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export const PRODUCT_CATEGORIES = [
  "All",
  "Vegetables",
  "Fruits",
  "Grains",
  "Dairy",
  "Spices",
  "Herbs",
  "Other",
];

export const PRODUCT_IMAGES: Record<string, string> = {
  tomato: "https://images.unsplash.com/photo-1561136594-7f68beb08161?w=400&q=80",
  onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
  carrot: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
  spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
  mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80",
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
  apple: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80",
  milk: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
  default: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
};

export function getProductImage(productName: string): string {
  const lowerName = productName.toLowerCase().trim();
  for (const [key, url] of Object.entries(PRODUCT_IMAGES)) {
    if (lowerName.includes(key)) return url;
  }
  return PRODUCT_IMAGES.default;
}
