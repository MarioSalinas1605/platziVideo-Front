import React from 'react';
import PropTypes from 'prop-types'

import '../assets/styles/components/Carousel.scss';

function Carousel({ children }) {
  return (
    <section className="carousel">
      <div className="carousel__container">
          {children}
      </div>
    </section>
  );
}

Carousel.propTypes = {
  children: PropTypes.node
}

export default Carousel;
