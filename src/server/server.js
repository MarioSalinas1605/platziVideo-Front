/* eslint-disable no-underscore-dangle */
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

// eslint-disable-next-line import/extensions
import Layout from '../frontend/components/Layout.jsx';
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
require('./utils/auth/strategies/google');
require('./utils/auth/strategies/facebook');

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

async function renderApp(req, res) {
  let initialState;
  const {
    email, name, id, token,
  } = req.cookies;

  try {
    let movieList = await axios({
      url: `${process.env.API_URL}/api/movies`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'get',
    });
    let { data: userMovieIds } = await axios({
      url: `${process.env.API_URL}/api/user-movies?userId=${id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'get',
    });
    userMovieIds = userMovieIds.data;
    movieList = movieList.data.data;

    const userList = [];
    userMovieIds.forEach((userMovie) => {
      let movieData = movieList.find((movie) => movie._id === userMovie.movieId);
      if (movieData) {
        movieData = { ...movieData };
        movieData._id = userMovie._id;
        userList.push(movieData);
      }
    });

    initialState = {
      user: {
        id,
        email,
        name,
      },
      myList: userList || [],
      trends: movieList.filter((movie) => movie.contentRating === 'PG' && movie._id),
      originals: movieList.filter((movie) => movie.contentRating === 'G' && movie._id),
      playing: {},
    };
  } catch (error) {
    initialState = {
      user: {},
      myList: [],
      trends: [],
      originals: [],
      playing: {},
    };
  }

  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const isLogged = (initialState.user.id);
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        <Layout>{renderRoutes(serverRoutes(isLogged))}</Layout>
      </StaticRouter>
    </Provider>,
  );
  res.send(setResponse(html, preloadedState, req.hashManifest));
}

app.get('/auth/google-auth', passport.authenticate('google-oauth', {
  scope: ['email', 'profile', 'openid'],
}));

app.get('/auth/google-oauth/callback',
  passport.authenticate('google-oauth', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
    }

    const { token, ...user } = req.user;

    res.cookie('token', token, {
      httpOnly: !ENV === 'development',
      secure: !ENV === 'development',
    });

    res.cookie('id', user.user.id, {
      httpOnly: !ENV === 'development',
      secure: !ENV === 'development',
    });
    res.cookie('name', user.user.name, {
      httpOnly: !ENV === 'development',
      secure: !ENV === 'development',
    });
    res.cookie('email', user.user.email, {
      httpOnly: !ENV === 'development',
      secure: !ENV === 'development',
    });

    res.redirect('/');
  });

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
    }

    const { token, ...user } = req.user;

    res.cookie('token', token, {
      httpOnly: !ENV === 'development',
      secure: !ENV === 'development',
    });

    res.cookie('id', user.user.id, {
      httpOnly: !ENV === 'development',
      secure: !ENV === 'development',
    });
    res.cookie('name', user.user.name, {
      httpOnly: !ENV === 'development',
      secure: !ENV === 'development',
    });
    res.cookie('email', user.user.email, {
      httpOnly: !ENV === 'development',
      secure: !ENV === 'development',
    });

    res.redirect('/');
  },
);

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

app.post('/user-movies', async (req, res, next) => {
  const { body: movie } = req;
  const { id: userId, token } = req.cookies;
  const userMovie = {
    userId,
    movieId: movie._id,
  };

  try {
    const { data: movieSaved } = await axios({
      url: `${process.env.API_URL}/api/user-movies`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'post',
      data: userMovie,
    });
    res.status(201).json(movieSaved);
  } catch (error) {
    next(error);
  }
});

app.delete('/user-movies/:userMovieId', async (req, res, next) => {
  const { userMovieId } = req.params;
  const { token } = req.cookies;
  try {
    const { data: movieDeleted } = await axios({
      url: `${process.env.API_URL}/api/user-movies/${userMovieId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'delete',
    });
    res.status(200).json(movieDeleted.data);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server running on ${PORT}`);
});
