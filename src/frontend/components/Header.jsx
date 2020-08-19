import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import className from 'classnames';
import PropTypes from 'prop-types';

import gravatar from '../utils/gravatar';
import { logout } from '../actions/index';
import '../assets/styles/components/Header.scss';
import logo from '../assets/static/logo-platzi-video-BW2.png';
import userIcon from '../assets/static/user-icon.png';

function Header({ isLogin, isRegister }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const hasUser = Object.keys(user).length > 0;

  function handleLogut() {
    document.cookie = 'email=';
    document.cookie = 'name=';
    document.cookie = 'id=';
    document.cookie = 'token=';
    dispatch(logout({}));
    window.location.href = '/login';
  }

  const headerClass = className('header', {
    isLogin,
    isRegister,
  });

  return (
    <header className={headerClass}>
      <Link to="/">
        <img className="header__img" src={logo} alt="Logo of platzi" />
      </Link>
      <div className="header__menu">
        <div className="header__menu--profile">
          {
            hasUser
              ? <img src={gravatar(user.email)} alt={user.email} />
              : <img src={userIcon} alt="User" />
          }
          <p>Perfil</p>
        </div>
        <ul>
          {
            hasUser
              ? <li><a href="/">{user.name}</a></li>
              : null
          }
          {
            hasUser
              ? <li><a href="#logout" onClick={handleLogut}>Cerrar Sesión</a></li>
              : <li><Link to="/login">Iniciar Sesión</Link></li>
          }
        </ul>
      </div>
    </header>
  );
}

Header.propTypes = {
  isLogin: PropTypes.bool,
  isRegister: PropTypes.bool,
};

Header.defaultProps = {
  isLogin: false,
  isRegister: false,
};

export default Header;
