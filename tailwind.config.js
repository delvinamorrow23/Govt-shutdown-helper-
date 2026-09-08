/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canonical Gleea palette: twilight ground, gold accent, parchment cards.
        twilight: {
          900: "#171233",
          800: "#241a4d",
          700: "#332963",
        },
        gold: {
          DEFAULT: "#D4AF37",
          soft: "#E6C868",
          deep: "#B8942B",
        },
        parchment: {
          DEFAULT: "#F5ECD8",
          shade: "#EADFC4",
          ink: "#3B3218",
        },
      },
      fontFamily: {
        rounded: ['"Baloo 2"', '"Nunito"', "ui-rounded", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 34px rgba(212, 175, 55, 0.30)",
        card: "0 10px 30px rgba(0,0,0,0.28)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
