import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import googleIcon from '../assets/static/google-icon.png';
import twitterIcon from '../assets/static/twitter-icon.png';
import { loginUser } from '../actions/index';

import '../assets/styles/Login.scss';
import Header from '../components/Header';

function Login({ history }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: '',
  });

  function handleInput(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(form, '/'));
  }

  return (
    <>
      <Header isLogin />
      <section className="login">
        <section className="login__container">
          <h2>Inicia sesión</h2>
          <form className="login__container--form" onSubmit={handleSubmit}>
            <input
              name="email"
              className="input"
              type="text"
              placeholder="Correo"
              onChange={handleInput}
            />
            <input
              name="password"
              className="input"
              type="password"
              placeholder="Contraseña"
              onChange={handleInput}
            />
            <button type="submit" className="button">Iniciar sesión</button>
            <div className="login__container--remember-me">
              <label htmlFor="cbox1">
                <input type="checkbox" name="" id="cbox1" value="checkbos" />
                Recuérdame
              </label>
              <a href="/">Olvidé mi contraseña</a>
            </div>
          </form>
          <section className="login__container--social-media">
            <div>
              <img src={googleIcon} alt="Google" />
              Inicia sesión con Google
            </div>
            <div>
              <img src={twitterIcon} alt="Twitter" />
              Inicia sesión con Twitter
            </div>
          </section>
          <p className="login__container--register">
            No tienes ninguna cuenta {' '}
            <Link to="/register">Regístrate</Link>
          </p>
        </section>
      </section>
    </>
  );
}

export default Login;
