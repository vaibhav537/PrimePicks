import { NextResponse } from "next/server";
import { createUrl, get } from "./apiClients";
import { AxiosResponse } from "axios";
import { protectedUrl } from "../utils/HelperClient";

interface DashboardData {
  stats: {
    category: number;
    products: number;
    users: number;
    orders: number;
    revenue: number;
  };
  revenueData: Array<{ date: string; revenue: number }>;
  recentOrders: Array<{
    id: number;
    price: number;
    user: { username: string };
  }>;
  top5Categories: Array<{
    id: number;
    name: string;
    revenue: number;
  }>;
  monthlySalesData: Array<{
    avg_order_value: number;
    sales_month: string;
    total_orders: number;
    total_sales: number;
  }>;
}

export async function GET() {
  try {
    const response: AxiosResponse<DashboardData> = await get(
      createUrl(protectedUrl + "/dashboard-stats")
    );
    return NextResponse.json(response.data);
  } catch (err: unknown) {
    console.error(
      "Error fetching dashboard data:",
      (err as Error).message || err
    );
    return NextResponse.json(
      { message: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}
