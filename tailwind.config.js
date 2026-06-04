/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gleea palette: warm storybook night sky with pink accents.
        night: {
          900: "#0e1030",
          800: "#161a47",
          700: "#222a6b",
        },
        gleea: {
          pink: "#FF7AA8",
          rose: "#FFB3CE",
          gold: "#FFD479",
          mint: "#7AD0C0",
          lilac: "#C9A7FF",
        },
      },
      fontFamily: {
        rounded: ['"Baloo 2"', '"Nunito"', "ui-rounded", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 122, 168, 0.35)",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        floaty: "floaty 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
