/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
const svgToDataUri = require('mini-svg-data-uri')
const {default: flattenColorPalette} = require('tailwindcss/lib/util/flattenColorPalette');
const { palettes } = require('@tailus/themer'); 

module.exports = {
    corePlugins: {
        preflight: false,
    },
    prefix: '',
    content: [
        './src/**/*.{html,ts}',
        "./node_modules/flowbite/**/*.js",
        './node_modules/preline/dist/*.js',
        './node_modules/preline/preline.js',
        "./node_modules/tw-elements/js/**/*.js",
        "./node_modules/@tailus/themer-**/dist/**/*.{js,ts}"
    ],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            colors: palettes.trust, 
        },
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
        // require('@headlessui/tailwindcss'),
        require('tailwindcss-3d'),

        require('tailwindcss-ripple')(),
        require('tailwindcss-animated'),

        require('@kamona/tailwindcss-perspective'),
        require("@xpd/tailwind-3dtransforms"),

        // require("@designbycode/tailwindcss-mask-image"),
        require("@designbycode/tailwindcss-conic-gradient"),
        // require("@designbycode/tailwindcss-reflection"),

        require('flowbite/plugin'),
        // require("tailwindcss-animate"),
        // require('tailwindcss-animated'),
        // require("tw-elements/plugin.cjs"),
        require('tailwindcss-primeui'),
        require('tailwind-glassmorphism'),

        require('@tailus/themer'),
        require('@tailus/themer-form'),
//    require("./js/components/reflect"),
        function ({addVariant}) {
            addVariant(
                'supports-backdrop-blur',
                '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))'
            )
            addVariant('supports-scrollbars', '@supports selector(::-webkit-scrollbar)')
            addVariant('children', '& > *')
            addVariant('scrollbar', '&::-webkit-scrollbar')
            addVariant('scrollbar-track', '&::-webkit-scrollbar-track')
            addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb')
            addVariant('demo-dark', '.demo-dark &')
        },
        function ({matchUtilities, theme}) {
            matchUtilities(
                {
                    'bg-grid': (value) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`,
                    }),
                },
                {values: flattenColorPalette(theme('backgroundColor')), type: 'color'}
            )

            matchUtilities(
                {
                    highlight: (value) => ({boxShadow: `inset 0 1px 0 0 ${value}`}),
                },
                {values: flattenColorPalette(theme('backgroundColor')), type: 'color'}
            )
        },
        function ({addUtilities, theme}) {
            let backgroundSize = '7.07px 7.07px'
            let backgroundImage = (color) =>
                `linear-gradient(135deg, ${color} 10%, transparent 10%, transparent 50%, ${color} 50%, ${color} 60%, transparent 60%, transparent 100%)`
            let colors = Object.entries(theme('backgroundColor')).filter(
                ([, value]) => typeof value === 'object' && value[400] && value[500]
            )

            addUtilities(
                Object.fromEntries(
                    colors.map(([name, colors]) => {
                        let backgroundColor = colors[400] + '1a' // 10% opacity
                        let stripeColor = colors[500] + '80' // 50% opacity

                        return [
                            `.bg-stripes-${name}`,
                            {
                                backgroundColor,
                                backgroundImage: backgroundImage(stripeColor),
                                backgroundSize,
                            },
                        ]
                    })
                )
            )

            addUtilities({
                '.bg-stripes-white': {
                    backgroundImage: backgroundImage('rgba(255 255 255 / 0.75)'),
                    backgroundSize,
                },
            })

            addUtilities({
                '.ligatures-none': {
                    fontVariantLigatures: 'none',
                },
            })
        },
//        require('./')
    ],
};


