"use client";

import React, { useEffect, useState } from "react";
import { Helper } from "@/lib/utils/HelperClient";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Input,
  Button,
} from "@nextui-org/react";
import { addCategory, editCategory, getCategory } from "@/lib/api/category";
import { useRouter } from "next/navigation";
import { decrypter } from "@/lib/utils/crypto";

const Page = ({
  params: { categoryId },
}: {
  params: { categoryId: string };
}) => {
  const [category, setCategory] = useState("");
  const router = useRouter();
  const helper = new Helper();

  useEffect(() => {
    const getData = async () => {
      const DeID: string | null = decrypter(categoryId);
      if (DeID) {
        const response = await getCategory(DeID);
        setCategory(response?.data);
      } else {
        helper.showErrorMessage("Couldn't find category");
      }
    };

    if (categoryId) {
      getData();
    }
  }, [categoryId]);

  const handleClick = async () => {
    const result = await editCategory(categoryId, category);
    console.log(result);
    if (result?.status === true) {
      helper.showSuccessMessage("Category Updated");
      router.push("/admin/category/all-category");
    } else {
      helper.showErrorMessage("Error in Editing Category!");
    }
  };
  return (
    <div className="flex flex-col items-start justify-start m-10 h-full">
      <Card className="w-[50%] h-[35%] p-5">
        <CardHeader className="text-4xl">Update Category</CardHeader>
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
            Update Category
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Page;
