/* eslint-disable global-require */
import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';

dotenv.config();

const { ENV, PORT } = process.env;

const app = express();

if (ENV === 'development') {
  console.log('Development config');
  const webpackConfig = require('../../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const serverConfig = {
    port: PORT,
    hot: true,
  };

  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
}

app.get('*', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <link type="text/css" rel="stylesheet" href="assets/app.css">
    <title>Platzi video</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript" src="assets/app.js"></script>
  </body>
  </html>
  `);
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log('Server running on 3000');
});
