import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const Curso = () => {

  const back = import.meta.env.VITE_TRABAJOFINAL;
  const modalCurso = useRef();
  const modalCursoEdit = useRef();
  const [Cursos, setCursos] = useState([]);
  
  const [Instructores, setInstructores] = useState([]);
  const [form, setForm] = useState({ nombre_curso: "", descripcion: "", fecha_inicio: "", fecha_fin: "", precio: "", estado_curso: "", id_instructor: "" });
  const [editingId, setEditingId] = useState(null);



  const fetchCursos = async () => {
    const { data } = await axios.get(`${back}cursos/`);
    setCursos(data);
  
  };

  const fetchInstructores = async () => {
    const { data } = await axios.get(`${back}instructores/`);
    setInstructores(data);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre_curso || !form.descripcion || !form.fecha_inicio || !form.fecha_fin || !form.precio || !form.estado_curso || !form.id_instructor) {
      Swal.fire({
        icon: 'warning',
        title: 'Debe llenar todos los campos',
      });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${back}cursos/${editingId}`, form);
        Swal.fire({
          icon: 'success',
          title: '¡Curso editado!',
        });
        window.$(modalCursoEdit.current).modal("hide");
      } else {
        await axios.post(`${back}cursos`, form);
        Swal.fire({
          icon: 'success',
          title: '¡Curso registrado!',
        });
        window.$(modalCurso.current).modal('hide');
      }

      setForm({ nombre_curso: "", descripcion: "", fecha_inicio: "", fecha_fin: "", precio: "", estado_curso: "", id_instructor:"" });
      setEditingId(null);
      fetchCursos();
    } catch (error) {
      console.error("Error al guardar el Cursos:", error);
      toast.fire({
        icon: 'error',
        title: 'Error al guardar el Cursos',
      });
    }
  };


  const handleEdit = (inst) => {
    setForm({ nombre_curso: inst.nombre_curso, descripcion: inst.descripcion, fecha_inicio: inst.fecha_inicio, fecha_fin: inst.fecha_fin, precio: inst.precio,estado_curso: inst.estado_curso, id_instructor: inst.id_instructor });
    setEditingId(inst.id_curso);
    window.$("#editModal").modal("show");
  };


  const handleDelete = async (id_curso, nombre) => {
    Swal.fire({
      title: `¿Estás seguro?`,
      text: `Vas a eliminar a ${nombre} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${back}cursos/${id_curso}`);
          Swal.fire("Eliminado", `${nombre} ha sido eliminado.`, "success");
          fetchCursos();
          Swal.fire({
            icon: 'error',
            title: '¡Instructor Eliminado!',

          });
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el estudiante.", "error");
        }
      }
    });
  };


  const openCreateModal = () => {
    setForm({ nombre_curso: "", descripcion: "", fecha_inicio: "", fecha_fin: "", precio: "", estado_curso: "", id_instructor: "" });
    setEditingId(null);
    window.$("#createModal").modal("show");
  };

  useEffect(() => {
    fetchCursos();
    fetchInstructores();
  }, []);



  return (
    <>

    
          <div className="card-box mb-30 px-5" >

            <div className="pd-20  py-3">
              <h3 className="text-success  text-center">CURSOS</h3>
              <hr />
              <p className="mb-0 text-center"><button className="btn btn-info" onClick={openCreateModal}>
              <span className="icon-copy ti-bookmark-alt"></span> Registrar Curso
              </button></p>

            </div>


         

            <div className="table-responsive">
              <table className="table table-striped " style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th className="bg-primary text-white">ID</th>
                    <th className="bg-primary  text-white">Nombre</th>
                    <th className="bg-primary  text-white">Descricpion</th>
                    <th className="bg-primary  text-white">Fecha inicio</th>
                    <th className="bg-primary  text-white">Fecha fin</th>
                    <th className="bg-primary  text-white">Precio</th>
                    <th className="bg-primary  text-white">Estado</th>
                    <th className="bg-primary  text-white">instructor</th>
                    <th className="bg-primary  text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Cursos.sort((a, b) => a.id_curso - b.id_curso).map((curso) => (
                    <tr key={curso.id_curso}>
                      <td className="border border-gray-400 p-2">{curso.id_curso}</td>
                      <td className="border border-gray-400 p-2">{curso.nombre_curso}</td>
                      <td className="border border-gray-400 p-2">{curso.descripcion}</td>
                      <td className="border border-gray-400 p-2">{String(curso.fecha_inicio).split("T")[0]}</td>
                      <td className="border border-gray-400 p-2">{String(curso.fecha_fin).split("T")[0]}</td>

                      <td className="border border-gray-400 p-2">{curso.precio}</td>
                      <td className="border border-gray-400 p-2">{curso.estado_curso}</td>
                      <td className="border border-gray-400 p-2">
                        {Instructores.length > 0 ? (
                          Instructores.find((instructor) => instructor.id_instructor === curso.id_instructor)
                            ? Instructores.find((instructor) => instructor.id_instructor === curso.id_instructor).nombre_instructor +
                            " " +
                            Instructores.find((instructor) => instructor.id_instructor === curso.id_instructor).apellido_instructor
                            : "Instructor no encontrado"
                        ) : (
                          "Cargando instructores..."
                        )}
                      </td>
                      <td className="border border-gray-400 p-2">
                        <button onClick={() => handleEdit(curso)} className="btn btn-success btn-action">
                        <span className="icon-copy ti-pencil"></span>
                        </button>&nbsp;
                        <button onClick={() => handleDelete(curso.id_curso, curso.nombre_curso)} className="btn btn-danger btn-action">
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
              <h4 className="text-center text-white p-3">NUEVO CURSO</h4>
            </div>
            <div className="card">
              <div className="card-body">

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="forms-sample needs-validation" noValidate>
                  <div className="row px-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Nombre Curso</b></label>
                        <input type="text" className="form-control" value={form.nombre_curso}
                          onChange={(e) => setForm({ ...form, nombre_curso: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="descripcion"><b >Descripcion:</b></label>
                        <div className="input-group input-group-alternative">
                          <textarea className="form-control" rows="2" value={form.descripcion}
                            onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required  style={{ overflow: 'hidden', resize: 'none', lineHeight: '1.5em', height: '5em' }}
                          ></textarea>
                        </div>
                      </div></div>


                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Fecha Inicio</b></label>
                        <input type="date" className="form-control" 
                          value={form.fecha_inicio}
                          onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Fecha Fin</b></label>
                        <input type="date" className="form-control" 
                          value={form.fecha_fin}
                          onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Precio:</b></label>
                        <input type="number" className="form-control" value={form.precio}
                          onChange={(e) => setForm({ ...form, precio: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Estado: </b></label>
                        <select className="form-control" required value={form.estado_curso} onChange={(e) => setForm({ ...form, estado_curso: e.target.value })}>
                          <option value=""></option>
                          <option value="activo">activo</option>
                          <option value="inactivo">inactivo</option>

                        </select>
                      </div>
                    </div>


                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Instructor: </b></label>
                        <select className="form-control" required value={form.id_instructor} onChange={(e) => setForm({ ...form, id_instructor: e.target.value })} >
                          <option value=""></option>
                          {Instructores.map((instructor) => (
                            <option key={instructor.id_instructor} value={instructor.id_instructor}>
                              {instructor.nombre_instructor} {instructor.apellido_instructor}
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





      <div className="modal fade" id="editModal" ref={modalCursoEdit} tabIndex={-1} role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" style={{ maxWidth: '700px!important' }} role="document">
          <div className="modal-content">
            <div className="container text-center bg-info ">
              <h4 className="text-center text-white p-3">EDITAR CURSO</h4>
            </div>
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="forms-sample needs-validation" noValidate>
                  <div className="row px-3">
                  <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Nombre Curso</b></label>
                        <input type="text" className="form-control" value={form.nombre_curso}
                          onChange={(e) => setForm({ ...form, nombre_curso: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="descripcion"><b >Descripcion:</b></label>
                        <div className="input-group input-group-alternative">
                          <textarea className="form-control" rows="2" value={form.descripcion}
                            onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required  style={{ overflow: 'hidden', resize: 'none', lineHeight: '1.5em', height: '5em' }}
                          ></textarea>
                        </div>
                      </div></div>


                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Fecha Inicio</b></label>
                        <input type="date" className="form-control" 
                          value={form.fecha_inicio.split("T")[0]}
                          onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Fecha Fin</b></label>
                        <input type="date" className="form-control" 
                          value={form.fecha_fin.split("T")[0]}
                          onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Precio:</b></label>
                        <input type="number" className="form-control" value={form.precio}
                          onChange={(e) => setForm({ ...form, precio: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Estado: </b></label>
                        <select className="form-control" required value={form.estado_curso} onChange={(e) => setForm({ ...form, estado_curso: e.target.value })}>
                          <option value=""></option>
                          <option value="activo">activo</option>
                          <option value="inactivo">inactivo</option>

                        </select>
                      </div>
                    </div>


                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Instructor: </b></label>
                        <select className="form-control" required value={form.id_instructor} onChange={(e) => setForm({ ...form, id_instructor: e.target.value })} >
                          <option value=""></option>
                          {Instructores.map((instructor) => (
                            <option key={instructor.id_instructor} value={instructor.id_instructor}>
                              {instructor.nombre_instructor} {instructor.apellido_instructor}
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

export default Curso;
