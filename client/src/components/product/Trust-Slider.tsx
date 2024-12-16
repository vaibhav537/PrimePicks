import { TrustSilderImages } from "@/lib/utils/HelperClient";
import Image from "next/image";
import React from "react";

const TrustSlider = () => {
  return (
    <div className="flex gap-2 items-center justify-center my-4">
      {TrustSilderImages.map((img) => (
        <div
          key={img.name}
          className="flex flex-col items-center justify-center "
        >
          <Image src={img.image} height={25} width={25} alt="pp_IMAGES" />
          <span className="text-xs text-center">{img.name}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustSlider;
