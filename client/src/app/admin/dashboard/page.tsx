"use client";
import { Button, Card, CardHeader } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Helper } from "@/lib/utils/HelperClient";
import Loader from "@/components/Loader";
import Stats from "@/components/admin/stats";
import { GET } from "@/lib/api/dashboardRoute";
import DailyRevenue from "@/components/admin/DailyRevenue";

interface Stats {
  category_count: number;
  product_count: number;
  user_count: number;
  order_count: number;
}

interface DashboardData {
  stats: Stats;
  revenue: {total_revenue: number}
  revenueData: Array<{ date: string; revenue: number }>;
  recentOrders: Array<{
    id: number;
    price: number;
    user: { username: string };
  }>;
  topCategories: Array<{ id: number; name: string; revenue: number }>;
  yearlySales: Array<{ month: string; sales: number }>;
}

const Page: React.FC = () => {
  const helper = new Helper();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await GET();
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          helper.showErrorMessage("Error fetching dashboard data");
        }
      } catch (error) {
        console.error(error);
        helper.showErrorMessage("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }
  if (!dashboardData) {
    return <div>No dashboard data.</div>;
  }
  if (dashboardData) {
    console.log("Dashboard data", dashboardData);
  }

  return (
    <div className="m-10">
      <div className="flex justify-between gap-5 ">
        <Stats title="Total Category" data={dashboardData.stats.category_count ?? 0} />
        <Stats title="Total Products" data={dashboardData.stats.product_count ?? 0} />
        <Stats title="Total Users" data={dashboardData.stats.user_count ?? 0} />
        <Stats title="Total Order" data={dashboardData.stats.order_count ?? 0} />
        <Stats title="Total Revenue" data={dashboardData.revenue.total_revenue ?? 0} />
      </div>
      <div className="grid grid-cols-2 gap-10 mt-10">
        <div className="h-full min-h-[50vh]">
          <Card className="h-full px-5">
            <CardHeader className="text-lg m-2 font-semibold">
              Daily Revenue
            </CardHeader>
            <DailyRevenue data= {dashboardData.revenueData}/>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
