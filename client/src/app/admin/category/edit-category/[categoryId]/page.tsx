"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Helper } from "@/lib/utils/HelperClient";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Input,
  Button,
} from "@nextui-org/react";
import { addCategory, getCategory } from "@/lib/api/category";
import { useRouter } from "next/navigation";

const Page = ({
  params: { categoryId },
}: {
  params: { categoryId: string };
}) => {
  const [category, setCategory] = useState("");
  const router = useRouter();
  const helper = new Helper();

  useEffect(() => {
   const getData = async() => {
     const response = await getCategory(categoryId);
     setCategory(response?.data)
   }

   if(categoryId){
    getData();
   }

  }, [categoryId])
  

  const handleClick = async () => {
    const result = await addCategory(category);
    if (result) {
      router.push("/admin/category/all-category");
    } else {
      helper.showErrorMessage("Error in Adding Category!");
    }
  };
  return (
    <div className="flex flex-col items-start justify-start m-10 h-full">
      <Toaster />
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

export default Page;
