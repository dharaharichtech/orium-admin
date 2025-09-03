/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          text: "#747474",
          gradientStart: "#05A750",
          gradientEnd: "#8AC53F",
        },
         layoutBg: "#F9F9FC",
      },
    },
  },
  plugins: [],
};
