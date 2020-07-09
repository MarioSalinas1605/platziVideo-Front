import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import gravatar from '../utils/gravatar';
import '../assets/styles/components/Header.scss';
import logo from '../assets/static/logo-platzi-video-BW2.png';
import userIcon from '../assets/static/user-icon.png';

function Header() {
  const user = useSelector((state) => state.user);
  const hasUser = Object.keys(user).length > 0;
  return (
    <header className="header">
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
          <li><a href="/">Cuenta</a></li>
          <li><Link to="/login">Iniciar Sesión</Link></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
