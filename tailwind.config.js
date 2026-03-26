/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gleea: {
          pink:        "#E8739A",
          "pink-light":"#F5C6D8",
          "pink-soft":  "#FFF0F5",
          gold:        "#D4A843",
          "gold-glow": "#F5E6A3",
          forest:      "#3D7A4A",
          "forest-light": "#A8D5B0",
          bark:        "#8B6F47",
          twilight:    "#9B8EC4",
          sky:         "#B8D4E8",
          cream:       "#FFF8F0",
          "warm-gray": "#6B5E54",
        },
      },
      fontFamily: {
        display: ['"Nunito"', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'gleea': '1.25rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 168, 67, 0.3)',
        'glow-pink': '0 0 20px rgba(232, 115, 154, 0.3)',
        'soft': '0 2px 12px rgba(107, 94, 84, 0.08)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
