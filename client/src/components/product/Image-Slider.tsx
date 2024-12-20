import Image from "next/image";
import React, { useState } from "react";

const ImageSlider = ({ images }: { images: string[] }) => {
  const [selected, setSelected] = useState<string>(images[0]);
  return (
    <div className="flex gap-5">
      <ul className="flex flex-col gap-2">
        {images.map((img) => (
          <li
            key={img}
            className="p-2 bg-gray-200 rounded-sm w-max cursor-pointer"
            onClick={() => setSelected(img)}
          >
            <div className="relative h-10 w-16">
              <Image src={img} alt="Product" fill />
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center w-full">
        <div className="h-[45rem] w-full relative">
          <Image src={selected} alt="product" fill />
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
