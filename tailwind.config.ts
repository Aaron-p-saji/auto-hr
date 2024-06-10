import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        uber_move: ["ubermove", "sans-serif"],
      },
      scale: {
        "60": "0.60",
        "75": "0.75",
        "50": "0.50",
        "40": "0.40",
      },
    },
    scrollbar: {
      // Example thin scrollbar for light mode
      thin: {
        track: "bg-black",
        thumb: "bg-gray-400 hover:bg-gray-500",
      },
      // Example thin scrollbar for dark mode (if using)
      "thin-dark": {
        track: "bg-transparent",
        thumb: "bg-gray-600 hover:bg-gray-500",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
  daisyui: {
    themes: ["winter"],
  },
};
export default config;
