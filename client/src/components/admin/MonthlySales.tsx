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
  data: { month: string; sales: number }[];
}) => {
  return (
    <ResponsiveContainer height="100%" width="100%">
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#ffb700" stroke="#ffb700" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default dynamic(() => Promise.resolve(MonthlySales), {
  ssr: false,
});
