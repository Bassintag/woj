const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: defaultTheme.spacing["3"],
    },
    extend: {
      aria: {
        "current-page": 'current="page"',
      },
      fontFamily: {
        sans: ['"Poppins"', ...defaultTheme.fontFamily.sans],
        display: ['"Lobster"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        accent: colors.orange,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
