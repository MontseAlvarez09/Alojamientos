import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Mision = () => {
    const [mision, setMision] = useState({
        titulo: '',
        contenido: '',
        id_empresa: '',
        estado: 'activo'
    });
    const [misiones, setMisiones] = useState([]);
    const [perfiles, setPerfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener misiones
                const misionesResponse = await axios.get('https://backendd-q0zc.onrender.com/api/mision');
                setMisiones(misionesResponse.data);

                // Obtener perfiles para el dropdown
                const perfilesResponse = await axios.get('https://backendd-q0zc.onrender.com/api/perfil');
                setPerfiles(perfilesResponse.data);
                // Establecer id_empresa predeterminado si hay perfiles
                if (perfilesResponse.data.length > 0 && !mision.id_empresa) {
                    setMision(prev => ({ ...prev, id_empresa: perfilesResponse.data[0].id }));
                }
            } catch (error) {
                console.error('Error al obtener datos:', error.message);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'titulo') {
            if (value.length <= 255) {
                setMision({
                    ...mision,
                    [name]: value
                });
            }
        } else if (name === 'contenido' || name === 'id_empresa') {
            setMision({
                ...mision,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mision.titulo || !mision.contenido || !mision.id_empresa) {
            MySwal.fire({
                title: 'Error!',
                text: 'Por favor, llena todos los campos requeridos.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            if (editingId) {
                await axios.put(`https://backendd-q0zc.onrender.com/api/mision/${editingId}`, mision);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'La misión ha sido actualizada correctamente y ahora está activa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await axios.post('https://backendd-q0zc.onrender.com/api/mision', mision);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'La misión ha sido creada correctamente y ahora está activa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            setMision({
                titulo: '',
                contenido: '',
                id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
                estado: 'activo'
            });
            setEditingId(null);
            const response = await axios.get('https://backendd-q0zc.onrender.com/api/mision');
            setMisiones(response.data);
        } catch (error) {
            console.error('Error al guardar misión:', error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'No se pudo guardar la misión.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await MySwal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto después de eliminarlo.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`https://backendd-q0zc.onrender.com/api/mision/${id}`);
                setMisiones(misiones.filter(m => m.id !== id));
                MySwal.fire(
                    'Eliminado!',
                    'La misión ha sido eliminada.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar misión:', error.message);
                MySwal.fire(
                    'Error!',
                    'Hubo un problema al intentar eliminar la misión.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (mision) => {
        setMision({
            titulo: mision.titulo,
            contenido: mision.contenido,
            id_empresa: mision.id_empresa,
            estado: 'activo' // Al editar, la misión se establecerá como activa
        });
        setEditingId(mision.id);
    };

    const handleCancel = () => {
        setMision({
            titulo: '',
            contenido: '',
            id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
            estado: 'activo'
        });
        setEditingId(null);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gestión de Misiones</h1>

            <div style={styles.flexContainer}>
                <section style={styles.gestionMisionContainer}>
                    <h2>Gestión de Misión</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Título</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    placeholder="Título de la misión"
                                    value={mision.titulo}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Contenido</label>
                                <textarea
                                    name="contenido"
                                    placeholder="Contenido de la misión"
                                    value={mision.contenido}
                                    onChange={handleChange}
                                    required
                                    style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Empresa</label>
                                <select
                                    name="id_empresa"
                                    value={mision.id_empresa}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                >
                                    {perfiles.length === 0 ? (
                                        <option value="">No hay empresas disponibles</option>
                                    ) : (
                                        perfiles.map(perfil => (
                                            <option key={perfil.id} value={perfil.id}>
                                                {perfil.NombreEmpresa}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                        <div style={styles.buttonGroup}>
                            <button type="submit" style={styles.editButton}>
                                {editingId ? 'Actualizar Misión' : 'Crear Misión'}
                            </button>
                            <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </section>

                <section style={styles.misionesGuardadasContainer}>
                    <h2>Misiones Guardadas</h2>
                    {misiones.length === 0 && <p>No hay misiones guardadas.</p>}
                    {misiones.map((mision) => (
                        <div key={mision.id} style={styles.misionItem}>
                            <p><strong>Título:</strong> {mision.titulo}</p>
                            <p><strong>Contenido:</strong> {mision.contenido}</p>
                            <p><strong>Fecha:</strong> {new Date(mision.fechahora).toLocaleString()}</p>
                            <p><strong>Empresa:</strong> {mision.NombreEmpresa}</p>
                            <p><strong>Estado:</strong> {mision.estado === 'activo' ? 'Activo' : 'Inactivo'}</p>
                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.editButton}
                                    onClick={() => handleEdit(mision)}
                                >
                                    Editar
                                </button>
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDelete(mision.id)}
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
        background: '#eff3cd',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(100, 100, 150, 0.15)',
        fontFamily: "'Poppins', sans-serif"
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#4b3f72',
        textShadow: '0 2px 5px rgba(75, 63, 114, 0.3)',
        letterSpacing: '0.05em'
    },
    flexContainer: {
        display: 'flex',
        gap: '25px',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    gestionMisionContainer: {
        flex: '1 1 45%',
        padding: '30px',
        background: '#fff',
        borderRadius: '15px',
        boxShadow: '0 8px 20px rgba(75, 63, 114, 0.1)',
        transition: 'transform 0.3s ease',
        cursor: 'default'
    },
    misionesGuardadasContainer: {
        flex: '1 1 50%',
        padding: '30px',
        background: '#fff',
        borderRadius: '15px',
        boxShadow: '0 8px 20px rgba(75, 63, 114, 0.1)',
        maxHeight: '600px',
        overflowY: 'auto'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        fontWeight: '700',
        marginBottom: '8px',
        color: '#5e548e',
        fontSize: '15px'
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
        color: '#333'
    },
    buttonGroup: {
        marginTop: '28px',
        display: 'flex',
        gap: '18px',
        justifyContent: 'flex-start'
    },
    editButton: {
        background: 'linear-gradient(90deg, #79ae92, #5f8f7a)',
        color: '#fff',
        padding: '14px 28px',
        fontSize: '17px',
        border: 'none',
        borderRadius: '14px',
        cursor: 'pointer',
        fontWeight: '700',
        boxShadow: '0 6px 15px rgba(121, 174, 146, 0.5)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
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
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
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
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
    },
    misionItem: {
        padding: '15px',
        borderBottom: '1px solid #eee',
        marginBottom: '10px'
    }
};

export default Mision;