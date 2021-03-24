import React from 'react';
import Footer from './Footer';
import PropTypes from 'prop-types';

function Layout({ children }) {
  return (
    <div className="App">
      {children}
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node
}

export default Layout;