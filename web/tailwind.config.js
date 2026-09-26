/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#070a12',
          800: '#0f172a',
          700: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
