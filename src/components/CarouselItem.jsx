import React from 'react';

import '../assets/styles/components/CarouselItem.scss';
import playIcon from '../assets/static/play-icon.png';
import plusIcon from '../assets/static/plus-icon.png';

function CarouselItem() {
  return (
    <div className="carousel-item">
      <img
        className="carousel-item__img"
        src="https://images.pexels.com/photos/4319664/pexels-photo-4319664.jpeg?cs=srgb&dl=ligero-puesta-de-sol-hombre-gente-4319664.jpg&fm=jpg"
        alt="People"
      />
      <div className="carousel-item__details">
        <div>
          <img className="carousel-item__details--img" src={playIcon} alt="Play" />
          <img className="carousel-item__details--img" src={plusIcon} alt="Plus" />
        </div>
        <p className="carousel-item__details--title">Título descríptivo</p>
        <p className="carousel-item__details--subtitle">2019 16+ 114 minutos</p>
      </div>
    </div>
  );
}

export default CarouselItem;
