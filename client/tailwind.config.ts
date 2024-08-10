import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
     colors:{
      primary: "#ff9900",
      "pp-dark": "#141B24",
      "pp-background": "#eef3f9",
      "pp-primary":"#ff9900",
      "pp-secondary":"#ffb700",
      "pp-blue": "#00a8e1"
     }
    },
  },
  plugins: [],
};
export default config;
