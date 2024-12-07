"use client";
import { allCategory } from "@/lib/api/category";
import { encrypter } from "@/lib/utils/crypto";
import {
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";

type Category = {
  id: string;
  name: string;
  product_count: number;
};

const Navbar = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesPopover, setCategoriesPopover] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  useEffect(() => {
    const getData = async () => {
      const response = await allCategory();
      const categoryData = response?.data;
      const computedCategory: Category[] = [];
      console.log(categoryData);
      categoryData.forEach((category: Category) => {
        if (category.product_count > 0) {
          computedCategory.push(category);
        }
      });
      setCategories(computedCategory);
    };
    getData();
  }, []);

  const handleSearch = () => {
    router.push(`/search?query=${searchTerm}`);
  };
  return (
    <nav className="bg-pp-dark min-h-[12vh] flex items-center px-10 h-full text-white gap-10">
      <Link href="/">
        <Image
          src="/primepicks_secondary_logo.png"
          alt="PrimePicks Logo"
          height={100}
          width={100}
        />
      </Link>
      <Popover
        placement="bottom"
        showArrow
        backdrop="blur"
        onOpenChange={(open) => setCategoriesPopover(open)}
        isOpen={categoriesPopover}
      >
        <PopoverTrigger>
          <div className="flex items-end gap-1 cursor-pointer ">
            <div className="flex flex-col gap-0 justify-around">
              <span className="text-sm h-4">Select</span>
              <span className="font-semibold">Category</span>
            </div>
            <div className="text-xl">
              <BiChevronDown />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="w-full max-w-[660px]">
              <Listbox
                onAction={(key) => {
                  const newKey = encrypter(key.toString());
                  router.push(`/search?category=${newKey}`);
                  setCategoriesPopover(false);
                }}
                aria-label="Categories"
                className="grid grid-cols-3 gap-2"
              >
                {categories.map((category) => (
                  <ListboxItem key={category.id}>{category.name}</ListboxItem>
                ))}
              </Listbox>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex-1 flex ">
        <input
          type="text"
          placeholder="Search Products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-l-sm h-12 outline-none border-none pl-5 text-gray-800"
        />
        <button
          className="h-12 w-14 bg-pp-primary rounded-r-sm outline-none border-none text-2xl flex items-center justify-center hover:bg-pp-secondary transition-all duration-300"
          onClick={handleSearch}
        >
          <FiSearch />
        </button>
      </div>
      <div className="flex items-end gap-1 cursor-pointer ">
        <div className="flex flex-col gap-0 justify-around">
          <span className="text-sm h-4">Hello Vaibhav</span>
          <span className="font-semibold">Account & Orders</span>
        </div>
        <div className="text-xl">
          <BiChevronDown />
        </div>
      </div>
      <div className="cursor-pointer ">
        <div className="flex items-end relative ">
          <Image src="/cart.png" alt="cart" height={40} width={40} />
          <span className="font-medium">Cart</span>
          <span className="absolute bottom-5 left-[15px] w-4 text-xs flex items-center justify-center text-pp-secondary font-medium">
            5
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
