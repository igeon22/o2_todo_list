const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry : './src/main.js',
    devtool : 'inline-source-map',
    devServer : {
      static : './dist',
    },
    // plugins: [
    //   new HtmlwebpackPlugin({
    //     title: 'Output Management',
    //   }),
    // ],
    output: {
        filename : '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // clean:true,
    },
    optimization: {
      runtimeChunk: 'single',
    },

    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },

          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
          },

          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
          },

          {
            test: /\.(csv|tsv)$/i,
            use: ['csv-loader'],
          },
          {
            test: /\.xml$/i,
            use: ['xml-loader'],
          },
        ],
      },
};