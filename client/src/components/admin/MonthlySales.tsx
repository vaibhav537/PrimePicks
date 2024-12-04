import dynamic from "next/dynamic";
import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const MonthlySales = ({
  data,
}: {
  data: {
    avg_order_value: number;
    sales_month: string;
    total_orders: number;
    total_sales: number;
  }[];
}) => {
  return (
    <ResponsiveContainer height="100%" width="100%">
      <BarChart data={data}>
        <XAxis dataKey="sales_month" />
        <YAxis />
        <Tooltip
          formatter={(value: any) => [`₹${value}`, "Revenue"]}
          labelFormatter={(label: any) =>
            `Date: ${new Date(label).toLocaleDateString()}`
          }
        />
        <Legend />
        <Bar dataKey="total_sales" fill="#ffb700" stroke="#ffb700" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default dynamic(() => Promise.resolve(MonthlySales), {
  ssr: false,
});
