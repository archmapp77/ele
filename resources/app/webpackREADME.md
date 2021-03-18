<!-- https://qiita.com/melito/items/3e49a497d459212f5c84 -->

webpack でマルチターゲットの設定
webpack
この記事は最終更新日から1年以上が経過しています。
マルチエントリ，マルチターゲットの設定は異なる設定を配列に入れて export してやれば良いようなので，
Electron の　main と renderer のバンドル設定を　entry, output, target を変えて配列に入れて
返せば良いと思われる．

webpack.config.js
var path = require('path');
const webpack = require('webpack');
var webpackMerge = require('webpack-merge');

var baseConfig = {
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false
    })
  ]
};

var mainConfig = webpackMerge(baseConfig, {
  target: 'electron-main',
  entry: './app/main.js',
});

var rendererConfig = webpackMerge(baseConfig, {
  target: 'electron-renderer',
  entry: './app/renderer.js',
});

module.exports = [mainConfig, rendererConfig];


<!-- https://www.subarunari.com/entry/electronWebpackConfig -->

Targets について
JavaScriptはバックエンド、フロントエンドの双方を記述でき、デスクトップアプリケーションも作成できる言語です。webpackの target オプションは、どの環境に向けて書かれたソースコードであるかを示すものです。 指定された環境に応じて色々と裏側で設定してくれます。

デフォルト値は web です。 web はブラウザ向けであることを示しています。Electron向けには、 electron-main と electron-renderer の2つの値が存在します。その名の通り、前者がメインプロセス、後者がレンダラープロセスのための設定値です。

Electron関連のバンドルファイルを作成する際には、target にこれら2つの値を指定すればよいです。しかしながら、 target には複数の値を設定できません。targetごとに設定を作成しなければなりません。

const mainConfig = {
  target: 'electron-main',
  ...
}
const rendererConfig ={ 
  target: 'electron-renderer',
  ...
}
module.exports = [ mainConfig, rendererConfig ]
わざわざ mainConfig などの変数に格納する必要もありませんが、個人的にはこちらの方が読みやすくて好きです。

設定例
以上を踏まえて、webpack.config.js は以下のようにしました。Webページの描画を担当するRenderer Process側の設定には .jsx と css を、Main Process側の設定には js のみを含めています。

const path = require('path');

const outputPath = path.join(__dirname, 'dist')
const mainConfig = {
  target: 'electron-main',
  entry: './src/main',
  output: {
    path: outputPath,
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
const rendererConfig = {
  target: 'electron-renderer',
  entry: './src/renderer/index.jsx',
  output: {
    path: outputPath,
    filename: 'renderer.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}

module.exports = [mainConfig, rendererConfig]
view rawwebpack.config.js hosted with ❤ by GitHub
rulesオプションの中を test: /\.(js|jsx)$/ として、メインプロセスとレンダラープロセスで設定を使いまわしてもよかったのですが、今回は別々に設定を作成しました。「メインに画面描画に関するモジュールを混ぜない！」という意思表示のためです。



Essential Electron
http://jlord.us/essential-electron/


Deep dive into Electron’s main and renderer processes
https://medium.com/cameron-nokes/deep-dive-into-electrons-main-and-renderer-processes-7a9599d5c9e2
