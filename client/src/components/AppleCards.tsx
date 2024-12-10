import Image from "next/image";
import React from "react";
import { FaApple, FaCaretRight } from "react-icons/fa";

const AppleCards = () => {
  return (
    <div
      className="grid gap-10 mx-20  justify-center"
      style={{ gridTemplateColumns: "50% 40%" }}
    >
      <div className="bg-pp-background rounded  px-20 py-10 hover:shadow-4xl transition-all duration-400 relative overflow-hidden">
        <div className="w-[70%] flex gap-4 flex-col">
          <div className="flex flex-col items-center">
            <div className="flex gap-1 items-center text-4xl">
              <FaApple className="text-4xl" />
              <span>Watch</span>
            </div>
            <div>Series 9</div>
          </div>
          <div className="text-5xl flex flex-col gap-2">
            <h3>Heavy on features</h3>
            <h3>Light on price</h3>
          </div>
          <div className="text-xl">From &#x20B9;40900.00</div>
          <div className="flex  gap-4">
            <button className="font-semibold bg-pp-secondary py-4 px-8 rounded ">
              Buy Now
            </button>
            <button className="flex gap-2 items-center text-pp-primary font-semibold">
              <span>Learn more</span>
              <FaCaretRight />
            </button>
          </div>
        </div>
        <div className="absolute right-[-16%] top-0">
          <Image
            src="/home/watch.png"
            height={350}
            width={400}
            alt="apple watch"
          />
        </div>
      </div>
      <div className="bg-pp-background rounded px-20 py-10 flex hover:shadow-4xl transition-all duration-400 flex-col gap-5">
        <div className="flex gap-4 flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="flex gap-1 items-center text-4xl">
              <FaApple className="text-4xl" />
              <span>Homepod</span>
            </div>
          </div>
          <div className="text-3xl flex flex-col gap-2 items-center justify-center text-center">
            <h3>Expereince Music like Never Before</h3>
          </div>
          <div className="text-xl">From &#x20B9;19,900</div>
          <div className="relative w-[11rem] h-[12rem]">
            <Image src="/home/homepod.png" fill alt="apple homepod" />
          </div>
          <div className="flex  gap-4">
            <button className="flex gap-2 items-center text-pp-primary font-semibold">
              <span>Learn more</span>
              <FaCaretRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppleCards;
