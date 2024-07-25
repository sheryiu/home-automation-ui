/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  presets: [
    require('portal-ui-ng/assets/tailwind-preset.js')
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

