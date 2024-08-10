const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      fontFamily: {
        display: ['"Lobster"', ...defaultTheme.fontFamily.sans],
        sans: ['"Poetsen"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
