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
        cafe: {
          DEFAULT: "#6F4E37",
          light: "#8B6914",
          dark: "#4A3728",
          cream: "#F5E6D3",
          warm: "#D4A574",
          deep: "#3E2723",
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
