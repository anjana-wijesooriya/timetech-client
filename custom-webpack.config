const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TailwindCSS = require('tailwindcss');
const Autoprefixer
    = require('autoprefixer');
const tailwindConfigModule = require('./tailwind.config');

module.exports = {
    mode:
        'development', // Change to 'production' for minification
    entry: './js/index.js',
    output: {
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'tailwindcss',
                                    'autoprefixer',
                                ],
                            },
                        },
                    },

                ],
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
    ],
    resolve: {
        alias: {
            alpine$: 'alpinejs', // Resolve Alpine.js
            tailwind$: 'tailwindcss', // Resolve Alpine.js
        },
        extensions: ['.js', '.config.js']
    },
    // devServer: {
    //     static: {
    //         directory: path.join(__dirname, 'dist'),
    //     },
    //     compress: true,
    //     port: 9000, // Customize development server port
    // }
};