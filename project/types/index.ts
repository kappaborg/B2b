export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
  category: string;
  tags: string[];
  description: string;
  specs: { name: string; value: string }[];
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  items: { productId: number; quantity: number }[];
  total: number;
  date: string;
  contactInfo?: any;
  shippingInfo?: any;
  paymentMethod?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Review {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: number;
  name: string;
} 