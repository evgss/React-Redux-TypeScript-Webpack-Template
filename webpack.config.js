const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
const cssLoaders = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        "css-loader",
    ];
    if (extra) {
        loaders.push(extra);
    }
    return loaders;
};

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all",
        },
    };
    if (!isDev) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
        ];
    }
    return config;
};

module.exports = {
    context: path.resolve(__dirname, "src"),
    entry: ["@babel/polyfill", "./index"],
    mode: isDev ? "development" : "production",
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [
            ".ico",
            ".js",
            ".json",
            ".png",
            ".gif",
            ".jpeg",
            ".jpg",
            ".ts",
            ".jsx",
            ".tsx",
        ],
    },
    optimization: optimization(),
    devServer: {
        port: "3000",
        hot: isDev,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: !isDev,
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/assets/favicon.ico"),
                    to: path.resolve(__dirname, "dist"),
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: filename("css"),
        }),
    ],
    devtool: isDev ? "source-map" : false,
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: cssLoaders(),
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders("sass-loader"),
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                use: "file-loader",
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/i,
                use: "file-loader",
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-typescript",
                                "@babel/preset-react",
                            ],
                        }
                    },
                    "ts-loader",
                    "eslint-loader",
                ]
            },
        ],
    },
};
