let isLocal
const
    mode = getMode(),
    hash = Date.now(),
    path = require('path'),
    production = mode == 'production',
    packageJson = require('./package'),
    entryPath = path.join(__dirname, 'dev'),
    publicPath = path.join(__dirname, 'public'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    htmlTemplatePath = path.join('./html-template.ejs'),
    htmlPublicPath = path.join(publicPath, 'index.html'),
    stylePublicPath = `style-${styleVars.direction}.css`,
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    lessLoader = { loader: 'less-loader', options: { modifyVars: styleVars } },
    fileLoader = { loader: 'file-loader', options: { name: `${isLocal ? '/' : ''}imgs/[name]_[hash].[ext]` } },
    postcssLoader = { loader: 'postcss-loader', options: { ident: 'postcss', plugins: () => [...(production ? [require('cssnano')] : []), require('autoprefixer')({ grid: true })] } },
    cssLoader = { loader: 'css-loader', options: { modules: { mode: 'local', localIdentName: '[name]_[local]', }, importLoaders: 2, } }

console.log('mode:', mode, styleVars.direction)

module.exports = {
    mode,
    resolve: {
        alias: {
            Base: entryPath,
            Actions: path.join(entryPath, 'actions'),
            Functions: path.join(entryPath, 'functions'),
            Components: path.join(entryPath, 'components'),
            Dashboard: path.join(entryPath, 'dashboard'),
            Pages: path.join(entryPath, 'pages'),
            Loader: path.join(entryPath, 'components', 'loader'),
            Config: path.join(entryPath, 'config'),
            Icon: path.join(entryPath, 'components', 'icon'),
            Img: path.join(entryPath, 'components', 'img'),
            Inputs: path.join(entryPath, 'components', 'inputs')
        }
    },
    devServer: {
        port: 4444,
        inline: true,
        contentBase: publicPath,
        historyApiFallback: true
    },
    devtool: production ? undefined : 'inline-sourcemap',
    entry: ['babel-polyfill', 'less', entryPath],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader', options: {
                        presets: ['@babel/react', '@babel/preset-env'], plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }],
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.css$/i,
                use: production ?
                    ExtractTextPlugin.extract({ use: ['css-loader', postcssLoader] }) :
                    ['style-loader', 'css-loader', postcssLoader]
            },
            {
                test: /\.less$/i,
                use: production ?
                    ExtractTextPlugin.extract({ use: [cssLoader, postcssLoader, lessLoader] }) :
                    ['style-loader', cssLoader, postcssLoader, lessLoader]
            },
            {
                test: /\.(jpe?g|png|gif|svg|ttf|woff|eot)$/i,
                use: [fileLoader, 'image-webpack-loader']
            }
        ]
    },
    output: {
        path: publicPath,
        filename: 'main.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            h: hash,
            production,
            inject: false,
            stylePublicPath,
            info: packageJson,
            filename: htmlPublicPath,
            assetsRep: isLocal ? '' : '/assets',
            template: `ejs-loader!${htmlTemplatePath}`,
            minify: production ? { collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true } : undefined
        }),
        ...(production ? [new ExtractTextPlugin(stylePublicPath)] : [])
    ]
}

function getMode() {
    if (!global.styleVars) global.styleVars = require('./styleVars')
    let mode = 'development'
    try {
        mode1 = process.argv.find(a => a.includes('mode')).split('=')[1]
        if (mode1 == 'production') mode = mode1
    } catch (error) {
        isLocal = true
    }
    return mode
}