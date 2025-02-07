import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const Estudiantes = () => {

  const back = import.meta.env.VITE_TRABAJOFINAL;
  const modalEstudiante = useRef();
  const modalEstudianteEdit = useRef();
  const [alumnos, setAlumnos] = useState([]);
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", fecha_nacimiento: "", telefono: "", direccion: "" });
  const [editingId, setEditingId] = useState(null);
  
  const fetchAlumnos = async () => {
    const { data } = await axios.get(`${back}estudiantes/`);
    setAlumnos(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.email || !form.fecha_nacimiento || !form.telefono || !form.direccion) {
      Swal.fire({
            icon: 'warning',
            title: 'Debe llenar todos los campos',
        });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        Swal.fire({
            icon: 'error',
            title: 'Ingrese un correo electrónico válido',
        });
        return;
    }

    try {
        if (editingId) {
            await axios.put(`${back}estudiantes/${editingId}`, form);
            Swal.fire({
                icon: 'success',
                title: '¡Estudiante editado!',
            });
            window.$(modalEstudianteEdit.current).modal("hide");
        } else {
            await axios.post(`${back}estudiantes`, form);
            Swal.fire({
                icon: 'success',
                title: '¡Estudiante registrado!',
            });
            window.$(modalEstudiante.current).modal('hide');
        }

        setForm({ nombre: "", apellido: "", email: "", fecha_nacimiento: "", telefono: "", direccion: "" });
        setEditingId(null);
        fetchAlumnos();
    } catch (error) {
        console.error("Error al guardar el estudiante:", error);
        toast.fire({
            icon: 'error',
            title: 'Error al guardar el estudiante',
        });
    }
};


  const handleEdit = (alumno) => {
    setForm({ nombre: alumno.nombre, apellido: alumno.apellido, email: alumno.email, fecha_nacimiento: alumno.fecha_nacimiento, telefono: alumno.telefono, direccion: alumno.direccion });
    setEditingId(alumno.id_estudiante);
    window.$("#editModal").modal("show");
  };


  const handleDelete = async (id_estudiante, nombre, apellido) => {
    Swal.fire({
      title: `¿Estás seguro?`,
      text: `Vas a eliminar a ${nombre} ${apellido} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${back}estudiantes/${id_estudiante}`);
          Swal.fire("Eliminado", `${nombre} ha sido eliminado.`, "success");
          fetchAlumnos();
          Swal.fire({
            icon: 'error',
            title: '¡Estudiante Eliminado!',

          });
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el estudiante.", "error");
        }
      }
    });
  };


  const openCreateModal = () => {
    setForm({ nombre: "", apellido: "", email: "", fecha_nacimiento: "", telefono: "", direccion: "" });
    setEditingId(null);
    window.$("#createModal").modal("show");
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);



  return (
    <>

   
          <div className="card mb-30 px-5" >

            <div className="pd-20 py-3">
              <h3 className="text-success  text-center">ESTUDIANTES</h3>
              <hr />
              <p className="mb-0 text-center"><button className="btn btn-info" onClick={openCreateModal}>
                <span className="icon-copy ti-user"></span> Registrar Estudiante
              </button></p>

            </div>
       

       

            <div className="table-responsive">
              <table className="table table-striped " style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th className="bg-primary text-white">ID</th>
                    <th className="bg-primary text-white">Nombre</th>
                    <th className="bg-primary text-white">Apellido</th>
                    <th className="bg-primary text-white">Email</th>
                    <th className="bg-primary  text-white">Fecha Nac.</th>
                    <th className="bg-primary text-white">Telefono</th>
                    <th className="bg-primary text-white">Direccion</th>
                    <th className="bg-primary text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.sort((a, b) => a.id_estudiante - b.id_estudiante).map((alumno) => (
                    <tr key={alumno.id_estudiante}>
                      <td className="border border-gray-400 p-2">{alumno.id_estudiante}</td>
                      <td className="border border-gray-400 p-2">{alumno.nombre}</td>
                      <td className="border border-gray-400 p-2">{alumno.apellido}</td>
                      <td className="border border-gray-400 p-2">{alumno.email}</td>
                      <td className="border border-gray-400 p-2">{String(alumno.fecha_nacimiento).split("T")[0]}</td>
                      <td className="border border-gray-400 p-2">{alumno.telefono}</td>
                      <td className="border border-gray-400 p-2">{alumno.direccion}</td>
                      <td className="border border-gray-400 p-2">
                        <button onClick={() => handleEdit(alumno)} className="btn btn-success btn-action">
                        <span className=" ti-pencil"></span>
                        </button>&nbsp;
                        <button onClick={() => handleDelete(alumno.id_estudiante, alumno.nombre, alumno.apellido)} className="btn btn-danger btn-action">
                        <span className="icon-copy ti-trash"></span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
       
          </div>
   

      <div className="modal fade" id="createModal" ref={modalEstudiante} tabIndex={-1} role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" style={{ maxWidth: '700px!important' }} role="document">
          <div className="modal-content">
            <div className="container text-center bg-info ">
              <h4 className="text-center text-white p-3">NUEVO ESTUDIANTE</h4>
            </div>
            <div className="card">
              <div className="card-body">

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="forms-sample needs-validation" noValidate>
                  <div className="row px-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Nombre </b></label>
                        <input type="text" className="form-control" value={form.nombre}
                          onChange={(e) => setForm({ ...form, nombre: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Apellido</b></label>
                        <input type="text" className="form-control" value={form.apellido}
                          onChange={(e) => setForm({ ...form, apellido: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Email </b></label>
                        <input type="email" className="form-control" value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Fecha Nacimiento</b></label>
                        <input type="date" className="form-control" 
                          value={form.fecha_nacimiento}
                          onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} required />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label><b>Telefono:</b></label>
                        <input type="number" className="form-control" value={form.telefono}
                          onChange={(e) => setForm({ ...form, telefono: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="form-group ">
                        <label htmlFor="descripcion"><b >Direccion:</b></label>
                        <div className="input-group input-group-alternative">
                          <textarea className="form-control" rows="2" value={form.direccion}
                            onChange={(e) => setForm({ ...form, direccion: e.target.value })} required  style={{ overflow: 'hidden', resize: 'none', lineHeight: '1.5em', height: '5em' }}
                          ></textarea>
                        </div>
                      </div></div>
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




  
      <div className="modal fade" id="editModal" ref={modalEstudianteEdit} tabIndex={-1} role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" style={{ maxWidth: '700px!important' }} role="document">
          <div className="modal-content">
            <div className="container text-center bg-info ">
              <h4 className="text-center text-white p-3">EDITAR ESTUDIANTE</h4>
            </div>
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="forms-sample needs-validation" noValidate>
                  <div className="row px-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Nombre </b></label>
                        <input type="text" className="form-control" value={form.nombre}
                          onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Apellido</b></label>
                        <input type="text" className="form-control" value={form.apellido}
                          onChange={(e) => setForm({ ...form, apellido: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Email </b></label>
                        <input type="email" className="form-control" value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Fecha Nacimiento</b></label>
                        <input type="date" className="form-control" 
                          value={form.fecha_nacimiento.split("T")[0]}
                          onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} required />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label><b>Telefono:</b></label>
                        <input type="number" className="form-control" value={form.telefono}
                          onChange={(e) => setForm({ ...form, telefono: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="form-group ">
                        <label htmlFor="descripcion"><b >Direccion:</b></label>
                        <div className="input-group input-group-alternative">
                          <textarea className="form-control" rows="2" value={form.direccion}
                            onChange={(e) => setForm({ ...form, direccion: e.target.value })} required  style={{ overflow: 'hidden', resize: 'none', lineHeight: '1.5em', height: '5em' }}
                          ></textarea>
                        </div>
                      </div></div>

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

export default Estudiantes;
