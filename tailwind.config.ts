import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2B4B3C",
          light: "#3D6B54",
          dark: "#1E352A",
        },
        cream: {
          DEFAULT: "#F5F0E6",
          dark: "#E8E0D0",
          light: "#FAF8F3",
        },
        accent: {
          DEFAULT: "#C4A35A",
          light: "#D4B87A",
          dark: "#A4833A",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
        sans: ["system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
