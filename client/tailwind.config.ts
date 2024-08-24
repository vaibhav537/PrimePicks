import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";

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
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
