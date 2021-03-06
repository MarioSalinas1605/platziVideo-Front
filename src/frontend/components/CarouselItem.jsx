import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFavoriteRequest, deleteFavoriteRequest } from '../actions';
import '../assets/styles/components/CarouselItem.scss';
import playIcon from '../assets/static/play-icon.png';
import plusIcon from '../assets/static/plus-icon.png';
import removeIcon from '../assets/static/remove-icon.png';

function CarouselItem({
  _id,
  cover,
  title,
  year,
  contentRating,
  duration,
  isList,
}) {
  const dispatch = useDispatch();

  function handleSetFavorite() {
    dispatch(
      addFavoriteRequest({
        _id,
        cover,
        title,
        year,
        contentRating,
        duration,
      }),
    );
  }

  function handleDeleteFavorite(itemId) {
    dispatch(deleteFavoriteRequest(itemId));
  }

  return (
    <div className="carousel-item">
      <img
        className="carousel-item__img"
        src={cover}
        alt={title}
      />
      <div className="carousel-item__details">
        <div>
          <Link to={`/player/${_id}`}>
            <img
              className="carousel-item__details--img"
              src={playIcon}
              alt="Play"
            />
          </Link>
          {
            isList
              ? <img
                  className="carousel-item__details--img"
                  src={removeIcon}
                  onClick={() => handleDeleteFavorite(_id)}
                  alt="Remove Icon"
              />
              : <img
                  className="carousel-item__details--img"
                  src={plusIcon}
                  onClick={handleSetFavorite}
                  alt="Plus Icon"
              />
          }
        </div>
        <p className="carousel-item__details--title">{title}</p>
        <p className="carousel-item__details--subtitle">{`${year} ${contentRating} ${duration}`}</p>
      </div>
    </div>
  );
}

CarouselItem.propTypes = {
    _id: PropTypes.string,
    cover: PropTypes.string,
    title: PropTypes.string,
    year: PropTypes.number,
    contentRating: PropTypes.string,
    duration: PropTypes.number,
    isList: PropTypes.bool
}

export default CarouselItem;
