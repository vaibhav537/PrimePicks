export interface ProductType {
  categoryId: string;
  colors: string[];
  createdAt: string;
  description: string[];
  discountedPrice: number;
  id: string;
  images: string[];
  titlePrice: number;
  title: string;
  updatedAt: string;
  variants: string[];
}

export interface ProductInterface {
  categoryID: string;
  colors: string[];
  description: string[];
  discountedPrice: number;
  images: string[];
  titlePrice: number;
  title: string;
  variants: string[];
}

export interface ProductData {
  category: {
    id: string;
  };
  colors: string[];
  description: string[];
  discountedPrice: number;
  images: string[];
  titlePrice: number;
  title: string;
  variants: string[];
}

export interface CategoryInterface {
  label: string;
  value: string;
}

export interface Status {
  status: string;
}

export interface User {
  id: string;
  email: string;
  usernames: string;
}

export interface Order {
  createdAt: string;
  orderId: string;
  paymentintent: string;
  paymentStatus: boolean;
  price: number;
  status: Status;
  updatedAt: string;
  user: User;
  products: ProductType[];
}

export type Category = {
  id: number;
  name: string;
};

export type UserType = any;

export interface Stats {
  category_count: number;
  product_count: number;
  user_count: number;
  order_count: number;
}

export interface Revenue {
  total_revenue: number;
}

export interface RevenueData {
  order_date: string;
  daily_revenue: number;
}

export interface RecentOrders {
  order_id: number;
  order_price: number;
  user_name: string;
}

export interface TopCategories {
  category_id: number;
  category_name: string;
  total_revenue: number;
}

export interface MonthlySales {
  avg_order_value: number;
  sales_month: string;
  total_orders: number;
  total_sales: number;
}

export interface DashboardData {
  stats: Stats;
  revenue: Revenue;
  revenueData: RevenueData[];
  recentOrders: RecentOrders[];
  topCategories: TopCategories[];
  monthlySales: MonthlySales[];
}

export interface OrderType {
  id: number;
  createdAt: string;
  updatedAt: string;
  users: string;
  products: number[];
  price: number;
  status: {
    status: "pending" | "processing" | "completed";
  };
  paymentIntent: string | null;
  paymentStatus: boolean;
}
