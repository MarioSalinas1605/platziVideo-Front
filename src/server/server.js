/* eslint-disable global-require */
import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';
import helmet from 'helmet';
import React from 'react';
import passport from 'passport';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import boom from '@hapi/boom';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

// import initialState from '../frontend/initialState';
import reducer from '../frontend/reducers/index';
import serverRoutes from '../frontend/routes/serverRoutes';
import getManifest from './getManifest';

dotenv.config();

const { ENV, PORT } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

require('./utils/auth/strategies/basic');

const THIRTY_DAYS_IN_SEC = 2592000000;
const TWO_HOURS_IN_SEC = 7200000;

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
} else {
  app.use((req, res, next) => {
    if (!req.hashManifest) req.hashManifest = getManifest();
    next();
  });
  app.use(express.static(`${__dirname}/public`));
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

function setResponse(html, preloadedState, manifest) {
  const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css';
  const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
  const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';
  return (`
  <!DOCTYPE html>
  <html>
  <head>
    <link type="text/css" rel="stylesheet" href="${mainStyles}">
    <title>Platzi video</title>
  </head>
  <body>
    <div id="app">${html}</div>
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script type="text/javascript" src="${mainBuild}"></script>
    <script type="text/javascript" src="${vendorBuild}"></script>
  </body>
  </html>
  `);
}

function renderApp(req, res) {
  let initialState;
  const { email, name, id } = req.cookies;
  if (id) {
    initialState = {
      user: {
        email, name, id,
      },
      myList: [],
      trends: [],
      originals: [],
    };
  } else {
    initialState = {
      user: {},
      myList: [],
      trends: [],
      originals: [],
    };
  }
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const isLogged = (initialState.user.id);
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(serverRoutes(isLogged))}
      </StaticRouter>
    </Provider>,
  );
  res.send(setResponse(html, preloadedState, req.hashManifest));
}

app.get('*', renderApp);

app.post('/auth/sign-in', async (req, res, next) => {
  const { rememberMe } = req.body;

  passport.authenticate('basic', (error, data) => {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }

      req.login(data, { session: false }, async (errorLogin) => {
        if (errorLogin) {
          next(errorLogin);
        }

        const { token, ...user } = data;

        res.cookie('token', token, {
          httpOnly: !ENV === 'development',
          secure: !ENV === 'development',
          maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC,
        });

        res.status(200).json(user);
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async (req, res, next) => {
  const { body: user } = req;
  try {
    const userData = await axios({
      url: `${process.env.API_URL}/api/auth/sign-up`,
      method: 'post',
      data: user,
    });

    res.status(201).json({
      name: req.body.name,
      email: req.body.email,
      id: userData.data.id,
    });
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server running on ${PORT}`);
});
