const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports= {
    module: {
        rules: [
            {
                test: /\.s(a|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
                filename: 'style.[contenthash:6].css',
        }),
        new CopyPlugin({
            patterns: [{
                from: "./public/images",
                to: "images",
            }]
        }),
    ]   
}
