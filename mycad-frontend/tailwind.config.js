import flowbite from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} \*/
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },

      colors: {
        'mycad-danger': '#EF476F',
        'mycad-warning': '#FFD166',
        'mycad-success': '#06D6A0',
        'mycad-info': '#118AB2',
        'mycad-primary': '#FF8E3C',
        'mycad-secondary': '#D9376E',
        'mycad-dark': '#0D0D0D',
        'mycad-light': '#FFFFFE',
        'mycad-gray': '#e7e5e4',
        'mycad-blue-dark': '#073B4C',
        'mycad-gray-dark': '#44403c',
      },
      animation: {
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)',
          },
          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)',
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)',
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)',
          },
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};
