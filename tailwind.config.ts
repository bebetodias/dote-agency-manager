import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sora)', 'sans-serif'],
      },
      colors: {
        primary: '#DC2626', // Vibrant Red
        primaryDark: '#B91C1C',
        dark: '#000000',
        light: '#FFFFFF',
        gray: {
          800: '#1F2937',
          900: '#111827',
        }
      }
    },
  },
  plugins: [],
};
export default config;
