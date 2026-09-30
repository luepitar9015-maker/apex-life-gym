/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          blue: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E40AF',
            900: '#1E3A8A',
          },
          green: {
            50: '#ECFDF5',
            500: '#10B981',
            600: '#059669',
          }
        }
      }
    },
  },
  plugins: [],
}
