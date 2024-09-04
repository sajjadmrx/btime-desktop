const withMT = require('@material-tailwind/react/utils/withMT')
module.exports = withMT({
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './**/node_modules/react-tailwindcss-select/**/*/*.esm.js',
    './**/@material-tailwind/**/*.{html,js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      xs: { min: '0px', max: '200px' },
      sm: { min: '200px', max: '400px' },
      md: { min: '400px', max: '500px' },
      lg: { min: '500px' },
      'h-xs': { raw: '(max-height: 150px)' },
    },
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

  plugins: [
    // ...
    require('tailwind-scrollbar'),
  ],
})
