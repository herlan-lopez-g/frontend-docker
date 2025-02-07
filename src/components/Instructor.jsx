import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const Instructor = () => {

  const back = import.meta.env.VITE_TRABAJOFINAL;
  const modalInstructor = useRef();
  const modalInstructorEdit = useRef();
  const [Instructores, setInstructores] = useState([]);

  const [form, setForm] = useState({ nombre_instructor: "", apellido_instructor: "", email_instructor: "", telefono_instructor: "", direccion_instructor: "",especialidad:"" });
  const [editingId, setEditingId] = useState(null);



  const fetchInstructores = async () => {
    const { data } = await axios.get(`${back}instructores/`);
    setInstructores(data);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre_instructor || !form.apellido_instructor || !form.email_instructor || !form.especialidad || !form.telefono_instructor || !form.direccion_instructor) {
      Swal.fire({
            icon: 'warning',
            title: 'Debe llenar todos los campos',
        });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email_instructor)) {
            Swal.fire({
                icon: 'error',
                title: 'Ingrese un correo electrónico válido',
            });
            return;
        }

    try {
        if (editingId) {
            await axios.put(`${back}instructores/${editingId}`, form);
            Swal.fire({
                icon: 'success',
                title: '¡Instructor editado!',
            });
            window.$(modalInstructorEdit.current).modal("hide");
        } else {
            await axios.post(`${back}instructores`, form);
            Swal.fire({
                icon: 'success',
                title: '¡Instructor registrado!',
            });
            window.$(modalInstructor.current).modal('hide');
        }

        setForm({ nombre_instructor: "", apellido_instructor: "", email: "", especialidad: "", telefono_instructor: "", direccion_instructor: "" });
        setEditingId(null);
        fetchInstructores();
    } catch (error) {
        console.error("Error al guardar el instructores:", error);
        toast.fire({
            icon: 'error',
            title: 'Error al guardar el instructores',
        });
    }
};


  const handleEdit = (inst) => {
    setForm({ nombre_instructor: inst.nombre_instructor, apellido_instructor: inst.apellido_instructor, email_instructor: inst.email_instructor, telefono_instructor: inst.telefono_instructor, direccion_instructor: inst.direccion_instructor ,especialidad: inst.especialidad });
    setEditingId(inst.id_instructor);
    window.$("#editModal").modal("show");
  };


  const handleDelete = async (id_instructor, nombre, apellido) => {
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
          await axios.delete(`${back}instructores/${id_instructor}`);
          Swal.fire("Eliminado", `${nombre} ha sido eliminado.`, "success");
          fetchInstructores();
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
    setForm({ nombre_instructor: "", apellido_instructor: "", email_instructor: "", telefono_instructor: "", direccion_instructor: "" ,especialidad:""});
    setEditingId(null);
    window.$("#createModal").modal("show");
  };

  useEffect(() => {
    fetchInstructores();
  }, []);



  return (
    <>

   
          <div className="card-box mb-30 px-5" >

            <div className="pd-20 py-3">
              <h3 className="text-success text-center fw-bold">INSTRUCTORES</h3>
              <hr />
              <p className="mb-0 text-center"><button className="btn btn-info" onClick={openCreateModal}>
                <span className="icon-copy ti-user"></span> Registrar Instructor
              </button></p>

            </div>
       

        
            <div className="table-responsive">
              <table className="table table-striped " style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th className="bg-secondary text-white">ID</th>
                    <th className="bg-secondary  text-white">Nombre</th>
                    <th className="bg-secondary  text-white">Apellido</th>
                    <th className="bg-secondary text-white">Email</th>
                    <th className="bg-secondary text-white">Fecha Nac.</th>
                    <th className="bg-secondary  text-white">Telefono</th>
                    <th className="bg-secondary  text-white">Direccion</th>
                    <th className="bg-secondary  text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Instructores.sort((a, b) => a.id_instructor - b.id_instructor).map((instructor) => (
                    <tr key={instructor.id_instructor}>
                      <td className="border border-gray-400 p-2">{instructor.id_instructor}</td>
                      <td className="border border-gray-400 p-2">{instructor.nombre_instructor}</td>
                      <td className="border border-gray-400 p-2">{instructor.apellido_instructor}</td>
                      <td className="border border-gray-400 p-2">{instructor.email_instructor}</td>
                      <td className="border border-gray-400 p-2">{instructor.telefono_instructor}</td>
                      <td className="border border-gray-400 p-2">{instructor.direccion_instructor}</td>   
                       <td className="border border-gray-400 p-2">{instructor.especialidad}</td>
                      <td className="border border-gray-400 p-2">
                        <button onClick={() => handleEdit(instructor)} className="btn btn-success btn-action">
                        <span className="icon-copy ti-pencil"></span>
                        </button>&nbsp;
                        <button onClick={() => handleDelete(instructor.id_instructor, instructor.nombre_instructor, instructor.apellido_instructor)} className="btn btn-danger btn-action">
                        <span className="icon-copy ti-trash"></span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        
    
          </div>
    
     

      <div className="modal fade" id="createModal" ref={modalInstructor} tabIndex={-1} role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" style={{ maxWidth: '700px!important' }} role="document">
          <div className="modal-content">
            <div className="container text-center bg-info ">
              <h4 className="text-center text-white p-3">NUEVO INSTRUCTOR</h4>
            </div>
            <div className="card">
              <div className="card-body">

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="forms-sample needs-validation" noValidate>
                  <div className="row px-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Nombre </b></label>
                        <input type="text" className="form-control" value={form.nombre_instructor}
                          onChange={(e) => setForm({ ...form, nombre_instructor: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Apellido</b></label>
                        <input type="text" className="form-control" value={form.apellido_instructor}
                          onChange={(e) => setForm({ ...form, apellido_instructor: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Email </b></label>
                        <input type="email" className="form-control" value={form.email_instructor}
                          onChange={(e) => setForm({ ...form, email_instructor: e.target.value })}  required />
                      </div>
                    </div>


                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Telefono:</b></label>
                        <input type="number" className="form-control" value={form.telefono_instructor}
                          onChange={(e) => setForm({ ...form, telefono_instructor: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="descripcion"><b >Direccion:</b></label>
                        <div className="input-group input-group-alternative">
                          <textarea className="form-control" rows="2" value={form.direccion_instructor}
                            onChange={(e) => setForm({ ...form, direccion_instructor: e.target.value })} required  style={{ overflow: 'hidden', resize: 'none', lineHeight: '1.5em', height: '5em' }}
                          ></textarea>
                        </div>
                      </div></div>
                 

                  <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Especilidad: </b></label>
                        <select className="form-control" required value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })}>
                          <option value=""></option>
                          <option value="DESARROLLO WEB">DESARROLLO WEB</option>
                          <option value="OFIMATICA">OFIMATICA</option>
                          <option value="REDES Y SERVIDORES">REDES Y SERVIDORES</option>
                          <option value="DESARROLLO MOVIL">DESARROLLO MOVIL</option>
                          <option value="SEGURIDAD INFORMATICA">SEGURIDAD INFORMATICA</option>
                          <option value="DISEÑO GRAFICO Y MULTIMEDIA">DISEÑO GRAFICO Y MULTIMEDIA</option>
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




  
      <div className="modal fade" id="editModal" ref={modalInstructorEdit} tabIndex={-1} role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" style={{ maxWidth: '700px!important' }} role="document">
          <div className="modal-content">
            <div className="container text-center bg-info ">
              <h4 className="text-center text-white p-3">EDITAR INSTRUCTOR</h4>
            </div>
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="forms-sample needs-validation" noValidate>
                  <div className="row px-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Nombre </b></label>
                        <input type="text" className="form-control" value={form.nombre_instructor}
                          onChange={(e) => setForm({ ...form, nombre_instructor: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Apellido</b></label>
                        <input type="text" className="form-control" value={form.apellido_instructor}
                          onChange={(e) => setForm({ ...form, apellido_instructor: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Email </b></label>
                        <input type="email" className="form-control" value={form.email_instructor}
                          onChange={(e) => setForm({ ...form, email_instructor: e.target.value })} required />
                      </div>
                    </div>



                    <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Telefono:</b></label>
                        <input type="number" className="form-control" value={form.telefono_instructor}
                          onChange={(e) => setForm({ ...form, telefono_instructor: e.target.value })}  required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="descripcion"><b >Direccion:</b></label>
                        <div className="input-group input-group-alternative">
                          <textarea className="form-control" rows="2" value={form.direccion_instructor}
                            onChange={(e) => setForm({ ...form, direccion_instructor: e.target.value })} required  style={{ overflow: 'hidden', resize: 'none', lineHeight: '1.5em', height: '5em' }}
                          ></textarea>
                        </div>
                      </div></div>


                      <div className="col-md-6">
                      <div className="form-group">
                        <label><b>Especilidad: </b></label>
                        <select className="form-control" required value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })}>
                          <option value=""></option>
                          <option value="DESARROLLO WEB">DESARROLLO WEB</option>
                          <option value="OFIMATICA">OFIMATICA</option>
                          <option value="REDES Y SERVIDORES">REDES Y SERVIDORES</option>
                          <option value="DESARROLLO MOVIL">DESARROLLO MOVIL</option>
                          <option value="SEGURIDAD INFORMATICA">SEGURIDAD INFORMATICA</option>
                          <option value="DISEÑO GRAFICO Y MULTIMEDIA">DISEÑO GRAFICO Y MULTIMEDIA</option>
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

export default Instructor;
