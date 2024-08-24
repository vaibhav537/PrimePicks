"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Input,
  Button,
} from "@nextui-org/react";
import { addCategory } from "@/lib/api/category";
import { useRouter } from "next/navigation";

const page = () => {
  const [category, setCategory] = useState("");
  const router = useRouter();
  const handleClick = async() => {
    const result = await addCategory(category);
    if (result){
      router.push("/admin/category/all-category")
    }
  }
  return (
    <div className="flex items-start justify-start m-10 h-full">
      <Card className="w-[50%] h-[35%] p-5">
        <CardHeader className="text-4xl">Add Category</CardHeader>
        <Divider />
        <CardBody>
          <div className="flex w-[50%] py-5 ">
            <Input
              type="name"
              label="Category Name"
              variant="bordered"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <Button color="primary" className="w-48" onClick={handleClick}>
            Add Category
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default page;
