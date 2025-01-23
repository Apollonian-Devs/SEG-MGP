/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customOrange: {
          light: "#FBBC05",
          dark: "#E48700",
        },
        customGray: {
          light: "#ADADAD",
          dark: "#808080",
        },
      },
    },
  },
  plugins: [],
};
