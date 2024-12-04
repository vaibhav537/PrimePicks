import dynamic from "next/dynamic";
import React from "react";
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DailyRevenueProps {
  data: Array<{
    order_date: string;
    daily_revenue: number;
  }>;
}

const DailyRevenue: React.FC<DailyRevenueProps> = ({ data }) => {
  return (
    <ResponsiveContainer height="100%" width="100%">
      <AreaChart data={data}>
        <XAxis
          dataKey="order_date"
          tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip
          formatter={(value: any) => [`₹${value}`, "Revenue"]}
          labelFormatter={(label: any) =>
            `Date: ${new Date(label).toLocaleDateString()}`
          }
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="daily_revenue"
          fill="#ffb700"
          stroke="#ffb700"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default dynamic(() => Promise.resolve(DailyRevenue), { ssr: false });
