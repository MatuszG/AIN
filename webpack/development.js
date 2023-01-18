const path = require('path');

module.exports= {
    devServer: {
        open: {
            app: {
                name: 'chrome'
            }
        },
        port: 3000,
        static: path.join(__dirname, '..', 'public'),
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.s(a|c)ss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            }
        ]
    }
}