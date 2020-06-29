import React from 'react';

import '../assets/styles/components/Register.scss';

function Register() {
  return (
    <section className="register">
      <section className="register__container">
        <h2>Regístro</h2>
        <form className="register__container--form">
          <input className="input" type="name" placeholder="Nombre" />
          <input className="input" type="text" placeholder="Correo" />
          <input className="input" type="password" placeholder="Contraseña" />
          <button type="button" className="button">Registrame</button>
        </form>
        <button type="button" className="button-transparent">Iniciar sesión</button>
      </section>
    </section>
  );
}

export default Register;
