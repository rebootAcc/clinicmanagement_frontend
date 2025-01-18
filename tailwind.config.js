/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "280px",
        md: "760px",
        lg: "1024px",
        xlg: "1280px",
        xl: "1440px",
        xxl: "1780px",
      },

      colors: {
        "custom-orange": "#FA5503",
        "custom-blue": "#27B3FF",
        "custom-gray": "#555555",
        "custom-green": "#00B252",
        "custom-purple": "#7F03FA",
      },
      fontFamily: {
        "be-vietnam-pro": ["Be Vietnam Pro", "sans-serif"],
        jost: ["Jost", "sans-serif"],
        albertsans: ["Albert Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
