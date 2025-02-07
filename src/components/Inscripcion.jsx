import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const Inscripcion = () => {

  const back = import.meta.env.VITE_TRABAJOFINAL;
  const modalCurso = useRef();
  const modalCursoEdit = useRef();
  const [Cursos, setCursos] = useState([]);
  const [Cursoss, setCursoss] = useState([]);
  const [Estudiantes, setEstudiantes] = useState([]);
  const [form, setForm] = useState({ id_estudiante: "", id_curso: "", fecha_inscripcion: "", estado: "" });
  const [editingId, setEditingId] = useState(null);



  const fetchCursos = async () => {
    const { data } = await axios.get(`${back}inscripciones/`);
    setCursos(data);
  
  };

  const fetchEstudiantes = async () => {
    const { data } = await axios.get(`${back}estudiantes/`);
    setEstudiantes(data);
  };


  const fetchCursoss = async () => {
    const { data } = await axios.get(`${back}cursos/`);
    setCursoss(data);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id_estudiante || !form.id_curso ||  !form.estado ) {
      Swal.fire({
        icon: 'warning',
        title: 'Debe llenar todos los campos',
      });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${back}inscripciones/${editingId}`, form);
        Swal.fire({
          icon: 'success',
          title: '¡Inscripcion editado!',
        });
        window.$(modalCursoEdit.current).modal("hide");
      } else {
        form.fecha_inscripcion = new Date().toISOString().split('T')[0]; 
        await axios.post(`${back}inscripciones`, form);
        Swal.fire({
          icon: 'success',
          title: '¡Inscripcion registrado!',
        });
        window.$(modalCurso.current).modal('hide');
      }

      setForm({id_estudiante: "", id_curso: "", fecha_inscripcion: "", estado: "" });
      setEditingId(null);
      fetchCursos();
    } catch (error) {
      console.error("Error al guardar el Cursos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar el Cursos',
      });
    }
  };


  const handleEdit = (inst) => {
    setForm({ id_estudiante: inst.id_estudiante, id_curso: inst.id_curso, fecha_inscripcion: inst.fecha_inscripcion, estado: inst.estado });
    setEditingId(inst.id_inscripcion);
    window.$("#editModal").modal("show");
  };


  const handleDelete = async (id_inscripcion) => {
    Swal.fire({
      title: `¿Estás seguro?`,
      text: `Vas a eliminar a ${id_inscripcion} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${back}inscripciones/${id_inscripcion}`);
          Swal.fire("Eliminado", `${id_inscripcion} ha sido eliminado.`, "success");
          fetchCursos();
          Swal.fire({
            icon: 'error',
            title: '¡estudiante Eliminado!',

          });
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el estudiante.", "error");
        }
      }
    });
  };


  const openCreateModal = () => {
    setForm({ id_estudiante: "", id_curso: "", fecha_inscripcion: "", estado: "" });
    setEditingId(null);
    window.$("#createModal").modal("show");
  };

  useEffect(() => {
    fetchCursos();
    fetchCursoss();
    fetchEstudiantes();
  }, []);



  return (
    <>

      
          <div className="card-box mb-30 px-5" >

            <div className="pd-20 py-3">
              <h3 className="text-success  text-center">INSCRIPCIONES</h3>
              <hr />
              <p className="mb-0 text-center"><button className="btn btn-info" onClick={openCreateModal}>
              <span className="icon-copy ti-layout-media-overlay"></span> Registrar Inscripcion
              </button></p>

            </div>


            <div className="table-responsive">
              <table className="table table-striped " style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th className="bg-secondary text-white">ID</th>
                    <th className="bg-secondary text-white">Fecha Incripcion</th>
                    <th className="bg-secondary  text-white">Estado</th>
                    <th className="bg-secondary text-white">Estudiante</th>
                    <th className="bg-secondary  text-white">Curso</th>
                    <th className="bg-secondary text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Cursos.sort((a, b) => a.id_inscripcion - b.id_inscripcion).map((curso) => (
                    <tr key={curso.id_inscripcion}>
                      <td className="border border-gray-400 p-2">{curso.id_inscripcion}</td>                   
                      <td className="border border-gray-400 p-2">{String(curso.fecha_inscripcion).split("T")[0]}</td>
                      <td className="border border-gray-400 p-2">{curso.estado}</td>
                      <td className="border border-gray-400 p-2">
                        {Estudiantes.length > 0 ? (
                          Estudiantes.find((estudiante) => estudiante.id_estudiante === curso.id_estudiante)
                            ? Estudiantes.find((estudiante) => estudiante.id_estudiante === curso.id_estudiante).nombre +
                            " " +
                            Estudiantes.find((estudiante) => estudiante.id_estudiante === curso.id_estudiante).apellido
                            : "estudiante no encontrado"
                        ) : (
                          "Cargando Estudiantes..."
                        )}
                      </td>
                      <td className="border border-gray-400 p-2">
                        {Cursoss.length > 0 ? (
                          Cursoss.find((estudiante) => estudiante.id_curso === curso.id_curso)
                            ? Cursoss.find((estudiante) => estudiante.id_curso === curso.id_curso).nombre_curso 
             
                            : "estudiante no encontrado"
                        ) : (
                          "Cargando Estudiantes..."
                        )}
                      </td>
                      <td className="border border-gray-400 p-2">
                        <button onClick={() => handleEdit(curso)} className="btn btn-success btn-action">
                        <span className="icon-copy ti-pencil"></span>
                        </button>&nbsp;
                        <button onClick={() => handleDelete(curso.id_inscripcion, curso.nombre_curso)} className="btn btn-danger btn-action">
                        <span className="icon-copy ti-trash"></span>  
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

        
          </div>
       


      <div className="modal fade" id="createModal" ref={modalCurso} tabIndex={-1} role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" style={{ maxWidth: '700px!important' }} role="document">
          <div className="modal-content">
            <div className="container text-center bg-info ">
              <h4 className="text-center text-white p-3">NUEVA INSCRIPCION</h4>
            </div>
            <div className="card">
              <div className="card-body">

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="forms-sample needs-validation" noValidate>
                  <div className="row px-3">
                

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Estudiante: </b></label>
                        <select className="form-control" required value={form.id_estudiante} onChange={(e) => setForm({ ...form, id_estudiante: e.target.value })} >
                          <option value=""></option>
                          {Estudiantes.map((estudiante) => (
                            <option key={estudiante.id_estudiante} value={estudiante.id_estudiante}>
                              {estudiante.nombre} {estudiante.apellido}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>


                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Curso: </b></label>
                        <select className="form-control" required value={form.id_curso} onChange={(e) => setForm({ ...form, id_curso: e.target.value })} >
                          <option value=""></option>
                          {Cursoss.map((estudiante) => (
                            <option key={estudiante.id_curso} value={estudiante.id_curso}>
                              {estudiante.nombre_curso} 
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Estado: </b></label>
                        <select className="form-control" required value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                          <option value=""></option>
                          <option value="pendiente">pendiente</option>
                          <option value="completado">completado</option>
                          <option value="cancelado">cancelado</option>
                        </select>
                      </div>
                    </div>



                  </div>
                  <div className="modal-footer no-bd">
                    <button className="btn btn-info" ><span className="btn-label">
                      <span className="icon-copy ti-save"></span>

                    </span></button>
                    <button type="button" className="btn btn-dark" data-dismiss="modal"><span className="btn-label">
                      <span className="icon-copy ti-close"></span>

                    </span></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>





      <div className="modal fade" id="editModal" ref={modalCursoEdit} tabIndex={-1} role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" style={{ maxWidth: '700px!important' }} role="document">
          <div className="modal-content">
            <div className="container text-center bg-info ">
              <h4 className="text-center text-white p-3">EDITAR INSCRIPCION</h4>
            </div>
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="forms-sample needs-validation" noValidate>
                  <div className="row px-3">
                  
                  <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Fecha Inscripcion</b></label>
                        <input type="date" className="form-control" 
                          value={form.fecha_inscripcion.split("T")[0]}
                          onChange={(e) => setForm({ ...form, fecha_inscripcion: e.target.value })} required />
                      </div>
                    </div>

                

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Estado: </b></label>
                        <select className="form-control" required value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                          <option value=""></option>
                          <option value="pendiente">pendiente</option>
                          <option value="completado">completado</option>
                          <option value="cancelado">cancelado</option>
                        </select>
                      </div>
                    </div>


                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Estudiante: </b></label>
                        <select className="form-control" required value={form.id_estudiante} onChange={(e) => setForm({ ...form, id_estudiante: e.target.value })} >
                          <option value=""></option>
                          {Estudiantes.map((estudiante) => (
                            <option key={estudiante.id_estudiante} value={estudiante.id_estudiante}>
                              {estudiante.nombre} {estudiante.apellido}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>


                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Curso: </b></label>
                        <select className="form-control" required value={form.id_curso} onChange={(e) => setForm({ ...form, id_curso: e.target.value })} >
                          <option value=""></option>
                          {Cursoss.map((estudiante) => (
                            <option key={estudiante.id_curso} value={estudiante.id_curso}>
                              {estudiante.nombre_curso} 
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>

                  <div className="modal-footer no-bd">
                    <button className="btn btn-info" ><span className="btn-label">
                      <span className="icon-copy ti-save"></span>

                    </span></button>
                    <button type="button" className="btn btn-dark" data-dismiss="modal"><span className="btn-label">
                      <span className="icon-copy ti-close"></span>

                    </span></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inscripcion;
