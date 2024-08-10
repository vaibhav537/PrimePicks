"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { footerLinks } from "@/lib/utils/HelperClient";

const Footer = () => {
  return (
    <div className="bg-pp-dark min-h-[12vh] flex items-center px-20 h-full text-white gap-10 py-16">
      <div>
        <Link href="/">
          <Image
            src="/primepicks_secondary_logo.png"
            alt="PrimePicks Logo"
            height={100}
            width={100}
          />
        </Link>
      </div>
      <div className="flex flex-1 justify-between px-20">
        {footerLinks.map((sections) => {
          return (
            <div className="flex flex-col gap-2" key={sections.title}>
              <span className="text-base">{sections.title}</span>
              <ul className=" text-base flex flex-col gap-1 font-light">
                {sections.links.map((link) => (
                  <li key={link} className="cursor-pointer link-hover">{link}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
