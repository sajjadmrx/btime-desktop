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
      xs: '200px',
      sm: '226px',
      md: '300px',
      lg: '400px',
      xl: '500px',
      '2xl': '600px',
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
