/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';

import App from './routes/App';
import reducer from './reducers';

const preloadedState = window.__PRELOADED_STATE__;
const history = createBrowserHistory();
const store = createStore(reducer, preloadedState, composeWithDevTools());

delete window.__PRELOADED_STATE__;
ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
