import React,{ useEffect }  from 'react'
import '../Pru.css'

const Inicio = () => {




  return (
    <>
       <style>
        {`         
          body {
    background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/images/programming.jpg');
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    backdrop-filter: blur(2px);

}
        `}
      </style>
 <div className="nosotros">
  <div className="nosotros-content">
    <h2>GRUPO 1 - SISTEMA DE INSCRIPCIONES</h2>
    <p className="intro-text">Como programadores, no solo escribimos código. Creamos soluciones que resuelven problemas, innovamos en cada línea, y aprendemos de cada desafío. La programación es nuestra herramienta para construir un futuro mejor, un proyecto a la vez.</p>
    <div className="team">
      <div className="team-members">
        <div className="team-member">
          <img src="./assets/images/perfil2.jpg" alt="" className="member-photo" />
          <h3>Herlan Alan Lopez Gonzales</h3>
          <p>Developer - Frontend</p>
        </div>
        <div className="team-member">
          <img src="./assets/images/perfil2.jpg" alt="" className="member-photo" />
          <h3>Marcelo Erik Guzman Morales</h3>
          <p>Developer - Docker</p>
        </div>
        <div className="team-member">
          <img src="./assets/images/perfil2.jpg" alt="" className="member-photo" />
          <h3>Gonzalo Moreno Dolz</h3>
          <p>Project Owner</p>
        </div>
        <div className="team-member">
          <img src="./assets/images/perfil2.jpg" alt="" className="member-photo" />
          <h3>Cesar Calvimontes</h3>
          <p>Dev-Ops</p>
        </div>
        <div className="team-member">
          <img src="./assets/images/perfil1.jpg" alt="" className="member-photo" />
          <h3>Gianella Ariadna Velez Zambrana</h3>
          <p>Scrum Master</p>
        </div>
        <div className="team-member">
          <img src="./assets/images/perfil2.jpg" alt="" className="member-photo" />
          <h3>Javier Jose Choque Quispe</h3>
          <p>Developer - Backend</p>
        </div>
      </div>
    </div>
  </div>
</div>


    </>
  )
}

export default Inicio