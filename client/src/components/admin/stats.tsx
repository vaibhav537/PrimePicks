"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";

const Stats = ({ title, data }: { title: string; data: number }) => {
  return (
    <div>
      <Card className="min-h-[100px] w-64">
        <CardHeader className="justify-between text-xl font-semibold ">{title}</CardHeader>
        <CardBody className="px-3 py-0 text-3xl font-bold text-pp-primary">{data}</CardBody>
      </Card>
    </div>
  );
};

export default Stats;
