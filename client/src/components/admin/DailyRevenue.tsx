import { Tooltip } from "@nextui-org/react";
import dynamic from "next/dynamic";
import React from "react";
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const DailyRevenue = ({
  data,
}: {
  data: { date: string; revenue: number }[];
}) => {
  return (
    <ResponsiveContainer height="100%" width="100%">
      <AreaChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="revenue"
          fill="#ffb700"
          stroke="#ffb700"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default dynamic(() => Promise.resolve(DailyRevenue), { ssr: false });
