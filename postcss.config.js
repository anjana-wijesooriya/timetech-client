/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // specify the files you want Tailwind to scan
        './src/**/*.{html,js,jsx,ts,tsx}',
    ],
    syntax: 'postcss-scss',
    plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer')
    ],

}