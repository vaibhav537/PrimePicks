import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import { transform } from "next/dist/build/swc";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff9900",
        "pp-dark": "#141B24",
        "pp-background": "#eef3f9",
        "pp-primary": "#ff9900",
        "pp-secondary": "#ffb700",
        "pp-blue": "#00a8e1",
      },
      boxShadow: {
        loader: "0 0 5px rgba(255,255,255,0.3)",
      },
      animation: {
        loader: "ring 2s linear infinite",
      },
      keyframes: {
        ring: {
          "0%": {
            transform: "rotate(0deg)",
            boxShadow: "1px 5px 2px #e65c00",
          },
          "50%": {
            transform: "rotate(180deg)",
            boxShadow: "1px 5px 2px #18b201",
          },
          "100%": {
            transform: "rotate(360deg)",
            boxShadow: "1px 5px 2px #0456c8",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
