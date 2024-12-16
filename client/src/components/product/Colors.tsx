import React, { useState } from "react";

const Colors = ({ colors }: { colors: string[] }) => {
  const [selected, setSelected] = useState<number>(0);
  return (
    <ul className="flex gap-1">
      {colors.map((color: string, index: number) => (
        <li
          className={`h-7 w-7 rounded-full cursor-pointer border-4 transition-all duration-500 ${selected === index ? "border-pp-primary" : ""}`}
          key={color}
          style={{ backgroundColor: color }}
          onClick={() => setSelected(index)}
        ></li>
      ))}
    </ul>
  );
};

export default Colors;
