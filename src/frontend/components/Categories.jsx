import React from 'react';

import '../assets/styles/components/Categories.scss';

function Categories({ children, title }) {
  return (
    <div className="categories">
      <h3 className="categories__title">{title}</h3>
      {children}
    </div>
  );
}

export default Categories;
