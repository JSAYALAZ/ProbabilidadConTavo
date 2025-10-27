import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}", // si usas pages, puede estar oculto por layout
    "./src/components/**/*.{ts,tsx}",
    "./src/sources/**/*.{ts,tsx}",
    "./mod/**/*.{ts,tsx}",
    "./styles/**/*.{css,scss}", // para detectar globals.css con @tailwind
  ],
  darkMode: ["class", 'html[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        search: {
          light: "#f4f4f4",
          dark: "#2f2f2f",
        },
        input: {
          light: "#f4f4f0",
          dark: "#404040",
        },
        button: {
          light: "#d7d7d7",
          dark: "#676767",
        },
        background: {
          light: "#ffffff",
          dark: "#212121",
        },
        sidebar: {
          light: "#f9f9f9",
          dark: "#171717",
        },
        //
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },

  plugins: [],
};
export default config;
