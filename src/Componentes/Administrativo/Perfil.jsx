import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

const Perfil = () => {
    const [perfil, setPerfil] = useState({
        NombreEmpresa: '', // Ajustado a mayúsculas iniciales
        Eslogan: '',
        logo: null,
        Direccion: '',
        Correo: '',
        Telefono: ''
    });
    const [perfiles, setPerfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchPerfiles = async () => {
            try {
                const response = await axios.get('https://backendd-q0zc.onrender.com/api/perfil');
                console.log('Datos recibidos del backend:', response.data); // Depuración
                setPerfiles(response.data);
            } catch (error) {
                console.error('Error al obtener perfiles:', error.message);
            }
        };
        fetchPerfiles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Telefono') {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setPerfil({
                    ...perfil,
                    [name]: value,
                });
            }
        } else if (name === 'NombreEmpresa' || name === 'Eslogan') {
            const regex = /^[a-zA-Z0-9 ]*$/;
            if (regex.test(value) && value.length <= 50) {
                setPerfil({
                    ...perfil,
                    [name]: value,
                });
            }
        } else {
            setPerfil({
                ...perfil,
                [name]: value,
            });
        }
    };

    const handleLogoChange = (e) => {
        setPerfil({
            ...perfil,
            logo: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['Eslogan', 'Direccion', 'Correo', 'Telefono'];
        const allFieldsFilled = requiredFields.every(field => perfil[field]);
        const isPhoneValid = /^\d{10}$/.test(perfil.Telefono);

        if (!allFieldsFilled || !isPhoneValid) {
            let message = "Por favor, llena todos los campos";
            if (!isPhoneValid) {
                message = "El teléfono debe tener exactamente 10 dígitos numéricos.";
            }
            MySwal.fire({
                title: 'Error!',
                text: message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('nombreEmpresa', perfil.NombreEmpresa);
        formData.append('eslogan', perfil.Eslogan);
        formData.append('direccion', perfil.Direccion);
        formData.append('correo', perfil.Correo);
        formData.append('telefono', perfil.Telefono);
        if (perfil.logo) {
            formData.append('logo', perfil.logo);
        }

        try {
            if (editingId) {
                await axios.put(`https://backendd-q0zc.onrender.com/api/perfil/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'El perfil ha sido actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await axios.post('https://backendd-q0zc.onrender.com/api/perfil', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'El perfil ha sido creado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            setPerfil({
                NombreEmpresa: '',
                Eslogan: '',
                logo: null,
                Direccion: '',
                Correo: '',
                Telefono: ''
            });
            setEditingId(null);
            const response = await axios.get('https://backendd-q0zc.onrender.com/api/perfil');
            setPerfiles(response.data);
        } catch (error) {
            console.error('Error al guardar perfil:', error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'No se pudo guardar el perfil.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto después de eliminarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`https://backendd-q0zc.onrender.com/api/perfil/${id}`);
                setPerfiles(perfiles.filter(p => p.id !== id));
                Swal.fire(
                    'Eliminado!',
                    'El perfil ha sido eliminado.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar perfil:', error.message);
                Swal.fire(
                    'Error!',
                    'Hubo un problema al intentar eliminar el perfil.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (perfil) => {
        setPerfil({
            NombreEmpresa: perfil.NombreEmpresa,
            Eslogan: perfil.Eslogan,
            logo: null,
            Direccion: perfil.Direccion,
            Correo: perfil.Correo,
            Telefono: perfil.Telefono
        });
        setEditingId(perfil.id);
    };

    const handleCancel = () => {
        setPerfil({
            NombreEmpresa: '',
            Eslogan: '',
            logo: null,
            Direccion: '',
            Correo: '',
            Telefono: ''
        });
        setEditingId(null);
    };

    return (
        <div style={styles.container}>
          <h1 style={styles.title}>Gestión de Perfil y Perfiles Guardados</h1>
    
          <div style={styles.flexContainer}>
            <section style={styles.gestionPerfilContainer}>
              <h2>Gestión de Perfil</h2>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Empresa</label>
                    <input
                      type="text"
                      name="NombreEmpresa"
                      placeholder="Nombre de la Empresa"
                      value={perfil.NombreEmpresa}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Eslogan</label>
                    <input
                      type="text"
                      name="Eslogan"
                      placeholder="Eslogan"
                      value={perfil.Eslogan}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Logo</label>
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleLogoChange}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Dirección</label>
                    <input
                      type="text"
                      name="Direccion"
                      placeholder="Dirección"
                      value={perfil.Direccion}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Correo</label>
                    <input
                      type="email"
                      name="Correo"
                      placeholder="Correo"
                      value={perfil.Correo}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Teléfono (10 dígitos)</label>
                    <input
                      type="text"
                      name="Telefono"
                      placeholder="Teléfono"
                      value={perfil.Telefono}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.buttonGroup}>
                  <button type="submit" style={styles.editButton}>
                    {editingId ? "Actualizar Perfil" : "Crear Perfil"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={styles.cancelButton}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </section>
    
            <section style={styles.perfilesGuardadosContainer}>
              <h2>Perfiles Guardados</h2>
              {perfiles.length === 0 && <p>No hay perfiles guardados.</p>}
              {perfiles.map((perfil) => (
                <div key={perfil.id} style={styles.profileItem}>
                  {perfil.Logo && (
                    <img
                      src={`data:image/jpeg;base64,${perfil.Logo}`}
                      alt="Logo de la empresa"
                      style={{ width: '100px', height: '100px', marginBottom: '10px', objectFit: 'contain' }}
                    />
                  )}
                  <p><strong>Empresa:</strong> {perfil.NombreEmpresa}</p>
                  <p><strong>Eslogan:</strong> {perfil.Eslogan}</p>
                  <p><strong>Dirección:</strong> {perfil.Direccion}</p>
                  <p><strong>Correo:</strong> {perfil.Correo}</p>
                  <p><strong>Teléfono:</strong> {perfil.Telefono}</p>
                  <div style={styles.buttonGroup}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(perfil)}
                    >
                      Editar
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(perfil.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      );
    };
    
    const styles = {
        container: {
            maxWidth: '1100px',
            margin: '30px auto',
            padding: '30px',
            background: '#eff3cd', // nuevo color de fondo
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(100, 100, 150, 0.15)',
            fontFamily: "'Poppins', sans-serif",
          },
          
        title: {
          fontSize: '32px',
          fontWeight: '800',
          marginBottom: '30px',
          textAlign: 'center',
          color: '#4b3f72', // púrpura oscuro
          textShadow: '0 2px 5px rgba(75, 63, 114, 0.3)',
          letterSpacing: '0.05em',
        },
        flexContainer: {
          display: 'flex',
          gap: '25px',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        gestionPerfilContainer: {
          flex: '1 1 45%',
          padding: '30px',
          background: '#fff',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(75, 63, 114, 0.1)',
          transition: 'transform 0.3s ease',
          cursor: 'default',
        },
        perfilesGuardadosContainer: {
          flex: '1 1 50%',
          padding: '30px',
          background: '#fff',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(75, 63, 114, 0.1)',
          maxHeight: '600px',
          overflowY: 'auto',
        },
        form: {
          display: 'flex',
          flexDirection: 'column',
        },
        formGrid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        },
        inputGroup: {
          display: 'flex',
          flexDirection: 'column',
        },
        label: {
          fontWeight: '700',
          marginBottom: '8px',
          color: '#5e548e', // púrpura medio
          fontSize: '15px',
        },
        input: {
          padding: '12px 16px',
          fontSize: '16px',
          borderRadius: '12px',
          border: '2px solid #d3d0f7',
          backgroundColor: '#fafaff',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          outline: 'none',
          fontWeight: '500',
          color: '#333',
        },
        inputFocus: {
          borderColor: '#7266f0',
          boxShadow: '0 0 8px rgba(114, 102, 240, 0.5)',
        },
        buttonGroup: {
          marginTop: '28px',
          display: 'flex',
          gap: '18px',
          justifyContent: 'flex-start',
        },
        editButton: {
            background: 'linear-gradient(90deg, #79ae92, #5f8f7a)', // degradado en tono verde
            color: '#fff',
            padding: '14px 28px',
            fontSize: '17px',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            fontWeight: '700',
            boxShadow: '0 6px 15px rgba(121, 174, 146, 0.5)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          },
          editButtonHover: {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(121, 174, 146, 0.7)',
          },
          
          cancelButton: {
            background: 'linear-gradient(90deg, #79ae92, #5f8f7a)',
            color: '#fff',
            padding: '14px 28px',
            fontSize: '17px',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            fontWeight: '700',
            boxShadow: '0 6px 15px rgba(121, 174, 146, 0.5)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          },
          cancelButtonHover: {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(121, 174, 146, 0.7)',
          },
          
          deleteButton: {
            background: 'linear-gradient(90deg, #79ae92, #5f8f7a)',
            color: '#fff',
            padding: '14px 28px',
            fontSize: '17px',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            fontWeight: '700',
            boxShadow: '0 6px 15px rgba(121, 174, 146, 0.5)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          },
          deleteButtonHover: {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(121, 174, 146, 0.7)',
          },
          
      };
      
export default Perfil;