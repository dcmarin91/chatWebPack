const htmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: './src/app.js',
    output: {
        path: __dirname +'/dist',
        filename: 'bundle.js'
    },
    devServer :{
        port:5000
    },
    module :{
        rules: [
            {
                test: /\.css$/,
                use: [
                    {loader:"style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ]
            }
        ]
    },
    plugins :[
        new htmlWebpackPlugin({
            template: "./src/index.html"
        })

    ]
}