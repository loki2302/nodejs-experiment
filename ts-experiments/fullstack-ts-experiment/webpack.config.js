const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/frontend/index.tsx',
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
};
