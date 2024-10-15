import React from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Specify the font weights you want
});

const Loader = () => {
  return (
    <div className={montserrat.className}>
      <div className="flex text-center justify-center items-center min-h-[100vh]">
        <div className="absolute w-[200px] h-[200px] rounded-[50%] before:absolute animate-loader before:left-0 before:top-0 before:h-[100%] before:w-[100%] before:shadow-loader before:rounded-[50%]"></div>
        <span className="text-[20px] uppercase tracking-[1px] leading-[200px]">Loading ...</span>
      </div>
    </div>
  );
};

export default Loader;
