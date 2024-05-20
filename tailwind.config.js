/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      Poetsen: ["Poetsen One", "sans-serif"],
      RobotoMono: ["Roboto Mono", "monospace"]
    },
    boxShadow: {
      '3xl': '0 10px 20px rgba(0, 0, 0, 0.25)',
      '4xl': '0 15px 30px rgba(0, 0, 0, 0.30)',
      '5xl,': '0 20px 40px rgba(0, 0, 0, 0.35)',
    },
    screens: {
      'xs': '150px',
    }
  },
  plugins: [],
}

