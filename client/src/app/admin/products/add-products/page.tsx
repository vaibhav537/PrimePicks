"use client";
import { allCategory } from "@/lib/api/category";
import { addProduct } from "@/lib/api/product";
import { Helper } from "@/lib/utils/HelperClient";
import { CategoryInterface, ProductData } from "@/lib/utils/types";
import { verifyToken } from "@/lib/utils/verifyToken";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";



const Page = () => {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [salePrice, setSalePrice] = useState<string>("0");
  const [discountedPrice, setDiscountedPrice] = useState<string>("0");
  const [variants, setVariants] = useState<string[]>([]);
  const [variant, setVariant] = useState<string>("");
  const [colors, setColors] = useState<string[]>([]);
  const [color, setColor] = useState<string>("");
  const [category, setCategory] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const helper =  new Helper();
  const token = localStorage.getItem(helper.tokenName);
  useEffect(() => {
    const getData = async () => {
      if (!token || !(await verifyToken(token))) router.push("/admin");
      const results = await allCategory();
      if (results) {
        const resultsArray = results.data;
        const ComputedData: CategoryInterface[] = resultsArray.map(
          ({ name, id }: { name: string; id: string }) => ({
            label: name,
            value: id,
          })
        );
        setCategories(ComputedData);
      }
    };
    getData();
  }, []);

  const addDescription = () => {
    setDescriptions([...descriptions, description]);
    setDescription("");
  };

  const addVariant = () => {
    setVariants([...variants, variant]);
    setVariant("");
  };

  const addColor = () => {
    setColors([...colors, color]);
    setColor("");
  };

  // const handleUpload = (data: { info: { secure_url: string } }) => {
  //   setPhotos([...photos, data.info.secure_url]);
  // };

  //updated to get previous images
  const handleUpload = (data: { info: { secure_url: string } }) => {
    setPhotos((prevPhotos) => [...prevPhotos, data.info.secure_url]);
  };

  const handleAddProduct = async () => {
    try {
      const data: ProductData = {
        category: {
          id: Array.from(category)[0],
        },
        colors,
        description: descriptions,
        discountedPrice: parseInt(discountedPrice),
        titlePrice: parseInt(salePrice),
        images: photos,
        title: name,
        variants,
      };
      if (!token || !(await verifyToken(token))) router.push("/admin");
      const result: { status: boolean; data: any } = await addProduct(data);
      if (result?.status === true) {
        router.push("/admin/products/all-products");
      }else{
        helper.showErrorMessage("Error adding product") 
      }
    } catch (error) {
      console.log(error);
      helper.showErrorMessage("Error adding product")
    }
  };

  return (
    <div>
      <div className="m-10">
        <Card className="p-5">
          <CardHeader>
            <h2 className="text-3xl "> Add Product</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-10">
              <Input
                type="text"
                label="Product Name"
                variant="bordered"
                labelPlacement="outside"
                size="lg"
                placeholder="Enter Product Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <div className="flex gap-5 items-center">
                <Input
                  type="text"
                  label="Product Description"
                  variant="bordered"
                  labelPlacement="outside"
                  size="lg"
                  placeholder="Enter Product Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <Button
                  size="lg"
                  className="mt-6"
                  variant="ghost"
                  color="primary"
                  onClick={addDescription}
                >
                  Add
                </Button>
              </div>
              <Input
                type="number"
                label="Product Sale Price"
                variant="bordered"
                labelPlacement="outside"
                size="lg"
                placeholder="Enter Product Sale Price"
                value={salePrice}
                onChange={(event) => setSalePrice(event.target.value)}
              />
              <Input
                type="number"
                label="Product Discounted Price"
                variant="bordered"
                labelPlacement="outside"
                size="lg"
                placeholder="Enter Product Discounted Price"
                value={discountedPrice}
                onChange={(event) => setDiscountedPrice(event.target.value)}
              />
              <div className="flex flex-col gap-5">
                <div className="flex gap-5 items-center">
                  <Input
                    type="text"
                    label="Variant"
                    variant="bordered"
                    labelPlacement="outside"
                    size="lg"
                    placeholder="Enter Product variant"
                    value={variant}
                    onChange={(event) => setVariant(event.target.value)}
                  />
                  <Button
                    size="lg"
                    className="mt-6"
                    variant="ghost"
                    color="primary"
                    onClick={addVariant}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex gap-5 items-center">
                  <Input
                    type="color"
                    label="Add Color"
                    variant="bordered"
                    labelPlacement="outside"
                    size="lg"
                    placeholder="Enter Product color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                  />
                  <Button
                    size="lg"
                    className="mt-6"
                    variant="ghost"
                    color="primary"
                    onClick={addColor}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <Select
                label="Select Category"
                className="max-w-xs"
                labelPlacement="outside"
                size="lg"
                placeholder="Select a Category"
                // @ts-ignore
                value={category}
                // @ts-ignore
                onSelectionChange={setCategory}
              >
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
              <CldUploadButton
                uploadPreset="qxjurz62"
                options={{ multiple: true }}
                //@ts-ignore
                onSuccess={handleUpload}
              >
                <span className="bg-pp-primary py-3 mt-6 px-5 text-white text-base font-medium rounded-md cursor-pointer">
                  Upload Images
                </span>
              </CldUploadButton>
            </div>
          </CardBody>
          <CardFooter>
            <Button color="primary" size="lg" onClick={handleAddProduct}>
              Add Product
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Page;
