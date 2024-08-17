const withMT = require('@material-tailwind/react/utils/withMT')

module.exports = withMT({
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './**/@material-tailwind/**/*.{html,js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {},
      keyframes: {
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
    },
  },

  plugins: [],
})
