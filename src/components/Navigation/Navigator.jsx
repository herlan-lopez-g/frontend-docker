import { Link } from "react-router";

const Navigator = () => {

  return (


    <nav className="navbar navbar-expand-lg navbar-dark " style={{backgroundColor:'black'}}>
      <a className="navbar-brand" href="#">GRUPO 1</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link to="/" className="nav-link"><b>Inicio</b></Link>
          </li>
          <li className="nav-item">
            <Link to="estudiante" className="nav-link"><b>Estudiantes</b></Link>
          </li>
          <li className="nav-item">
            <Link to="instructor" className="nav-link"><b>Instructores</b></Link>
          </li>
          <li className="nav-item">
            <Link to="curso" className="nav-link"><b>Cursos</b></Link>
          </li>
          <li className="nav-item">
            <Link to="inscripcion" className="nav-link"><b>Inscripciones</b></Link>
          </li>
        </ul>
      </div>
    </nav>

  )
}

export default Navigator