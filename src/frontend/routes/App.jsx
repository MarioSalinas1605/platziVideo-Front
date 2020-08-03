import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../containers/Home';
import Login from '../containers/Login';
import Register from '../containers/Register';
import NotFound from '../containers/NotFound';
import Layout from '../components/Layout';
import Player from '../containers/Player';

function App({ isLogged }) {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/" component={isLogged ? Home : Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/player/:id" component={isLogged ? Player : Login} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

App.propTypes = {
  isLogged: PropTypes.bool,
};

App.defaultProps = {
  isLogged: false,
};

export default App;
