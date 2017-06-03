const gulp = require('gulp');
const lazypipe = require('lazypipe');
const path = require('path');
const pump = require('pump');
const rename = require('gulp-rename');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify');

function webpackBuild(filename, libraryName, version) {
  const config = {
    module: {
      loaders: [
        {
          //exclude: /node_modules/,
          test: /\.js$/,
          loader: 'babel',
          query: {
            // Some of the node_modules may have their own "babel" section in
            // their project.json (or a ".babelrc" file). We need to ignore
            // those as we're using our own Babel options.
            babelrc: false,
            presets: ['flow', 'es2015', 'stage-0'],
          }
        },
        {
          test: /\.json$/,
          loader: 'json'
        }
      ]
    },
    node: {
      // Mock Node.js modules that Babel require()s but that we don't
      // particularly care about.
      fs: 'empty',
      module: 'empty',
      net: 'empty'
    },
    output: {
      filename: filename,
      library: libraryName,
      libraryTarget: 'umd'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        BABEL_VERSION: JSON.stringify(require('babel-core/package.json').version),
        VERSION: JSON.stringify(version),
      }),
      // Use browser version of visionmedia-debug
      new webpack.NormalModuleReplacementPlugin(
        /debug\/node/,
        'debug/src/browser'
      ),
      new webpack.NormalModuleReplacementPlugin(
        /..\/..\/package/,
        '../../../../src/babel-package-shim'
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^babylon/,
        path.join(__dirname, "src", "babylon")
      ),
      new webpack.NormalModuleReplacementPlugin(
        /.\/source-map/,
        path.join(__dirname, "src", "source-map")
      ),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin()
    ]
  };

  if (libraryName !== 'Babel') {
    // This is a secondary package (eg. Babili), we should expect that Babel
    // was already loaded, rather than bundling it in here too.
    config.externals = {
      'babel-standalone': 'Babel',
    };
  }
  return webpackStream(config);
}

const minifyAndRename = lazypipe()
  .pipe(uglify, {
    output: {
      // Babylon source code contains some string literals with characters outside the ascii range, using the \uxxxx form. Uglify want to transform these into UTF-8 encoded Unicode characters.
      // Since this would not save a significant amount of file size and the original encoding potentially avoids character encoding ambiguities, prefer to retain the original encoding.
      ascii_only: true,
    },
  })
  .pipe(rename, { extname: '.min.js' });

gulp.task('default', ['build']);
gulp.task('build', ['build-babel-to-go']);

gulp.task('build-babel-to-go', cb => {
  pump([
    gulp.src('src/index.js'),
    webpackBuild('babel-to-go.js', 'babel-to-go', require('./package.json').version),
    gulp.dest('.'),
    minifyAndRename(),
    gulp.dest('.'),
  ], cb);
});
