"use client";
import Loader from "@/components/Loader";
import { allCategory } from "@/lib/api/category";
import { editProduct, getProductByID } from "@/lib/api/product";
import { decrypter } from "@/lib/utils/crypto";
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
import { Helper } from "@/lib/utils/HelperClient";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ProductData {
  categoryID: string;
  colors: string[];
  description: string[];
  discountedPrice: number;
  images: string[];
  titlePrice: number;
  title: string;
  variants: string[];
}

interface Categrory {
  label: string;
  value: string;
}

const Page = ({ params: { productId } }: { params: { productId: string } }) => {
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
  const [categories, setCategories] = useState<Categrory[]>([]);
  const [defaultCategory, setDefaultCategory] = useState("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const helper = new Helper();
  useEffect(() => {
    const getData = async () => {
      const DeID: string | null = decrypter(productId);
      if (DeID) {
        const product = await getProductByID(DeID);
        if (product?.status === true) {
          const ProductData = product.data;
          console.log({ ProductData });
          setName(ProductData.title);
          setDescriptions(ProductData.description);
          setDiscountedPrice(ProductData.discountedPrice);
          setSalePrice(ProductData.titlePrice);
          setPhotos(ProductData.images);
          setVariants(ProductData.variants);
          setColors(ProductData.colors);
          setCategory(ProductData.category_id);
          setDefaultCategory(ProductData.category_id);
          setIsLoaded(true);
        }
      } else {
        helper.showErrorMessage("Couldn't find category");
      }
      const results = await allCategory();
      if (results) {
        const resultsArray = results.data;
        const ComputedData: Categrory[] = resultsArray.map(
          ({ name, id }: { name: string; id: string }) => ({
            label: name,
            value: id,
          })
        );
        setCategories(ComputedData);
      }
    };
    getData();
  }, [productId]);

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

  const handleUpdateProduct = async () => {
    try {
      console.log(Array.from(category).join(""));
      const data: ProductData = {
        categoryID: Array.from(category).join(""),
        colors,
        description: descriptions,
        discountedPrice: parseInt(discountedPrice),
        titlePrice: parseInt(salePrice),
        images: photos,
        title: name,
        variants,
      };
      const result: { status: boolean; data: any } = await editProduct(
        productId,
        data
      );
      if (result?.status === true) {
        router.push("/admin/products/all-products");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isLoaded ? (
        <>
          <div className="m-10">
            <Card className="p-5">
              <CardHeader>
                <h2 className="text-3xl ">
                  Update Product: <span className="text-base"> {name}</span>
                </h2>
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
                    defaultSelectedKeys={[defaultCategory]}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {/* <CldUploadButton
                    uploadPreset="qxjurz62"
                    options={{ multiple: true }}
                    //@ts-ignore
                    onSuccess={handleUpload}
                  >
                    <span className="bg-pp-primary py-3 mt-6 px-5 text-white text-base font-medium rounded-md cursor-pointer">
                      Upload Images
                    </span>
                  </CldUploadButton> */}
                </div>
              </CardBody>
              <CardFooter>
                <Button color="primary" size="lg" onClick={handleUpdateProduct}>
                  Update Product
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      ) : (
        <>
          <Loader />
        </>
      )}
    </div>
  );
};

export default Page;
