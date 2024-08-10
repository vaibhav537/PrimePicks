"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
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
      <div className="flex items-end gap-1 cursor-pointer ">
        <div className="flex flex-col gap-0 justify-around">
          <span className="text-sm h-4">Select</span>
          <span className="font-semibold">Category</span>
        </div>
        <div className="text-xl">
          <BiChevronDown />
        </div>
      </div>
      <div className="flex-1 flex ">
        <input
          type="text"
          placeholder="Search Products"
          className="w-full rounded-l-sm h-12 outline-none border-none pl-5 text-gray-800"
        />
        <button className="h-12 w-14 bg-pp-primary rounded-r-sm outline-none border-none text-2xl flex items-center justify-center hover:bg-pp-secondary transition-all duration-300">
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
          <span className="absolute bottom-5 left-[15px] w-4 text-xs flex items-center justify-center text-pp-secondary font-medium">5</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
