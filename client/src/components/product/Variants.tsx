import React, { useState } from "react";

const Variants = ({ variants }: { variants: string[] }) => {
  const [selected, setSelected] = useState<number>(0);
  return (
    <ul className="flex gap-5 my-5">
      {variants.map((variant: string, index: number) => (
        <li
          className={`cursor-pointer border-2 p-1 text-sm rounded-lg transition-all duration-500 font-semibold   ${
            selected === index ? "border-pp-primary" : ""
          }`}
          key={variant}
          style={{ backgroundColor: variant }}
          onClick={() => setSelected(index)}
        >{variant}</li>
      ))}
    </ul>
  );
};

export default Variants;
