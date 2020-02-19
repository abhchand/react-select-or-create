var path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

// Github Pages only reads from a folder named `docs/`
var DEMO_DIR = path.resolve(__dirname, 'docs');
var DIST_DIR = path.resolve(__dirname, 'dist');
var EXAMPLE_DIR = path.resolve(__dirname, 'examples');
var ROOT_DIR = path.resolve(__dirname);
var SRC_DIR = path.resolve(__dirname, 'src');

var config = {
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.js', '.jsx', '.sass', '.scss', '.css'],
    modules: [
      SRC_DIR + '/styles',
      SRC_DIR + '/js',
      'node_modules'
    ]
  },
  resolveLoader: {
    modules: ['node_modules']
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: process.env.NODE_ENV == 'development' },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: process.env.NODE_ENV == 'development' },
          },
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

var componentConfig = Object.assign({}, config, {
  entry: [
    // Order is important here for exposing the final component
    // From the Webpack docs:
    //
    //  > Note that if an array is provided as an entry point,
    //  > only the last module in the array will be exposed.
    SRC_DIR + '/styles/main.scss',
    SRC_DIR + '/js/react-select-or-create.jsx'
  ],
  output: {
    path: DIST_DIR,
    filename: 'index.js',
    library: 'ReactSelectOrCreate',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    }
  },
  plugins: [
    new MiniCssExtractPlugin()
  ],
  devtool: 'source-map'
});

var exampleConfig = Object.assign({}, config, {
  entry: [
    SRC_DIR + '/styles/main.scss',
    EXAMPLE_DIR + '/customized-example.scss',
    EXAMPLE_DIR + '/index.jsx'
  ],
  output: {
    path: DEMO_DIR,
    filename: 'index.js'
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: './examples/template.html'
    })
  ]
});

// DEVELOPMENT////////////////////////////////////////////
//

if (config.mode == 'development') {

  // Use the 'example' for convenient development
  exampleConfig.devServer = {
    contentBase: EXAMPLE_DIR + '/index',
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    host: 'localhost',
    hot: true,
    overlay: true,
    port: 3035,
    quiet: false,
    stats: {
      errorDetails: true
    },
    useLocalIp: false,
    watchOptions: {
      ignored: '/node_modules/'
    }
  }

  exampleConfig.output.publicPath = '/';
}

// ///////////////////////////////////////////////////////

module.exports = [
  // Order matters! From the docs:
  //
  //  > When exporting multiple configurations only the `devServer`
  //  > options for the first configuration will be taken into
  //  > account and used for all the configurations in the array.
  //
  exampleConfig,
  componentConfig
];
