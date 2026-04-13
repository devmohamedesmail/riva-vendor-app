/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo_400Regular"],
        cairoBold: ["Cairo_700Bold"],
        poppins: ["Poppins_400Regular"],
        poppinsBold: ["Poppins_600SemiBold"],
      },
      colors: {
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#0F172A",
        },
        text: {
          DEFAULT: "#0F172A",
          dark: "#F8FAFC",
        },
        primary: {
          DEFAULT: "#fd4a12",
          dark: "#fd4a12",
        },
        card: {
          DEFAULT: "#F1F5F9",
          dark: "#1E293B",
        },
        border: {
          DEFAULT: "#E2E8F0",
          dark: "#334155",
        },
      }
    },
  },
  plugins: [],
}

