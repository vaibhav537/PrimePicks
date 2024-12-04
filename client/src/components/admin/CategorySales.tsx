import dynamic from "next/dynamic";
import React from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
const CategorySales = ({
  data,
}: {
  data: { category_id: number; category_name: string; total_revenue: number }[];
}) => {
  console.log("CategorySales", data);
  return (
    <div style={{ width: "100%", height: "30vh" }} className="">
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie
            scale={4}
            data={data}
            dataKey="total_revenue"
            cx={300}
            cy={150}
            outerRadius={100}
            fill="#ffb700"
            label
          />
          <Tooltip
            formatter={(value: any) => [`₹${value}`, "Revenue"]}
            labelFormatter={(label: any) =>
              `Date: ${new Date(label).toLocaleDateString()}`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CategorySales), {
  ssr: false,
});
