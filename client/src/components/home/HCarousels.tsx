import Image from "next/image";
import React from "react";

const HomeCarousels = () => {
  return (
    <div className="h-[69vh] bg-red-100">
      <div className="relative h-full w-full bg-cover">
        <Image src={"/home/home.png"} alt="home" fill />
      </div>
    </div>
  );
};

export default HomeCarousels;
