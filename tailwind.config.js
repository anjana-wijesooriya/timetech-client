/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  prefix: '',
  content: [
    './src/**/*.{html,ts}',
    "./node_modules/flowbite/**/*.js",
    './node_modules/preline/dist/*.js',
    "./node_modules/tw-elements/js/**/*.js",
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('daisyui'),
    require('preline/plugin'),
    require('@headlessui/tailwindcss'),
    require('tailwindcss-3d')({ legacy: true }),
    require('flowbite/plugin'),
    require("tailwindcss-animate"),
    require('tailwindcss-animated'),
    require("tw-elements/plugin.cjs"),
    require('tailwindcss-primeui')
  ],
};
