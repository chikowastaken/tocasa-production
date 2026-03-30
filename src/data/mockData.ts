// TypeScript interfaces for data structures
// All actual data is now stored in and fetched from Supabase database

export interface Product {
  id: string;
  name: string; // For backwards compatibility
  name_ka: string;
  name_en: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: string;
  image: string;
  images?: string[];
  description: string; // For backwards compatibility
  description_ka: string;
  description_en: string;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string; // For backwards compatibility
  name_ka: string;
  name_en: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: number;
}
