import React from 'react';
import PropTypes from 'prop-types';

import '../assets/styles/components/Categories.scss';

function Categories({ children, title }) {
  return (
    <div className="categories">
      <h3 className="categories__title">{title}</h3>
      {children}
    </div>
  );
}

Categories.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
}

export default Categories;
