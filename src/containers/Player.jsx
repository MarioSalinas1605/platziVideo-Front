import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import NotFound from './NotFound';
import { getVideoSource } from '../actions/index';
import '../assets/styles/components/Player.scss';

function Player({history, match}) {
  const dispatch = useDispatch();
  const { id } = match.params;
  const { playing } = useSelector((state) => state);
  const hasPlaying = Object.keys(playing).length > 0;

  useEffect(() => {
    dispatch(getVideoSource(id));
  }, []);

  return hasPlaying ? (
    <div className="Player">
      <video controls autoPlay>
        <source src={playing.source} type="video/mp4" />
      </video>
      <div className="Player-back">
        <button type="button" onClick={() => history.goBack()}>
          Regresar
        </button>
      </div>
    </div>
  ) : <NotFound />;
}

export default Player;
