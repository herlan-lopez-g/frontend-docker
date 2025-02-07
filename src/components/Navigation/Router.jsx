
import {Routes,Route} from "react-router"
import Estudiantes from '../Estudiantes'
import Instructor from '../Instructor'
import Curso from '../Curso'
import Inicio from '../Inicio'
import Inscripcion from "../Inscripcion"
const Router = () => {
  return (
    <>
       <Routes>
            <Route path="/"element={<Inicio/>} />
            <Route path="estudiante" element={<Estudiantes />} />
            <Route path="instructor" element={<Instructor />} />
            <Route path="curso" element={<Curso/>} />
            <Route path="inscripcion" element={<Inscripcion />} />
        </Routes>
    </>
  )
}

export default Router