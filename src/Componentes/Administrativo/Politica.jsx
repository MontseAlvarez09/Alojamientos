import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Politica = () => {
    const [politica, setPolitica] = useState({
        titulo: '',
        contenido: '',
        id_empresa: '',
        estado: 'activo'
    });
    const [politicas, setPoliticas] = useState([]);
    const [perfiles, setPerfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener políticas
                const politicasResponse = await axios.get('https://backendd-q0zc.onrender.com/api/politica');
                setPoliticas(politicasResponse.data);

                // Obtener perfiles para el dropdown
                const perfilesResponse = await axios.get('https://backendd-q0zc.onrender.com/api/perfil');
                setPerfiles(perfilesResponse.data);
                // Establecer id_empresa predeterminado si hay perfiles
                if (perfilesResponse.data.length > 0 && !politica.id_empresa) {
                    setPolitica(prev => ({ ...prev, id_empresa: perfilesResponse.data[0].id }));
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
                setPolitica({
                    ...politica,
                    [name]: value
                });
            }
        } else if (name === 'contenido' || name === 'id_empresa') {
            setPolitica({
                ...politica,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!politica.titulo || !politica.contenido || !politica.id_empresa) {
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
                await axios.put(`https://backendd-q0zc.onrender.com/api/politica/${editingId}`, politica);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'La política ha sido actualizada correctamente y ahora está activa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await axios.post('https://backendd-q0zc.onrender.com/api/politica', politica);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'La política ha sido creada correctamente y ahora está activa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            setPolitica({
                titulo: '',
                contenido: '',
                id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
                estado: 'activo'
            });
            setEditingId(null);
            const response = await axios.get('https://backendd-q0zc.onrender.com/api/politica');
            setPoliticas(response.data);
        } catch (error) {
            console.error('Error al guardar política:', error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'No se pudo guardar la política.',
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
                await axios.delete(`https://backendd-q0zc.onrender.com/api/politica/${id}`);
                setPoliticas(politicas.filter(p => p.id !== id));
                MySwal.fire(
                    'Eliminado!',
                    'La política ha sido eliminada.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar política:', error.message);
                MySwal.fire(
                    'Error!',
                    'Hubo un problema al intentar eliminar la política.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (politica) => {
        setPolitica({
            titulo: politica.titulo,
            contenido: politica.contenido,
            id_empresa: politica.id_empresa,
            estado: 'activo' // Al editar, la política se establecerá como activa
        });
        setEditingId(politica.id);
    };

    const handleCancel = () => {
        setPolitica({
            titulo: '',
            contenido: '',
            id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
            estado: 'activo'
        });
        setEditingId(null);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gestión de Políticas</h1>

            <div style={styles.flexContainer}>
                <section style={styles.gestionPoliticaContainer}>
                    <h2>Gestión de Política</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Título</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    placeholder="Título de la política"
                                    value={politica.titulo}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Contenido</label>
                                <textarea
                                    name="contenido"
                                    placeholder="Contenido de la política"
                                    value={politica.contenido}
                                    onChange={handleChange}
                                    required
                                    style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Empresa</label>
                                <select
                                    name="id_empresa"
                                    value={politica.id_empresa}
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
                                {editingId ? 'Actualizar Política' : 'Crear Política'}
                            </button>
                            <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </section>

                <section style={styles.politicasGuardadasContainer}>
                    <h2>Políticas Guardadas</h2>
                    {politicas.length === 0 && <p>No hay políticas guardadas.</p>}
                    {politicas.map((politica) => (
                        <div key={politica.id} style={styles.politicaItem}>
                            <p><strong>Título:</strong> {politica.titulo}</p>
                            <p><strong>Contenido:</strong> {politica.contenido}</p>
                            <p><strong>Fecha:</strong> {new Date(politica.fechahora).toLocaleString()}</p>
                            <p><strong>Empresa:</strong> {politica.NombreEmpresa}</p>
                            <p><strong>Estado:</strong> {politica.estado === 'activo' ? 'Activo' : 'Inactivo'}</p>
                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.editButton}
                                    onClick={() => handleEdit(politica)}
                                >
                                    Editar
                                </button>
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDelete(politica.id)}
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
    gestionPoliticaContainer: {
        flex: '1 1 45%',
        padding: '30px',
        background: '#fff',
        borderRadius: '15px',
        boxShadow: '0 8px 20px rgba(75, 63, 114, 0.1)',
        transition: 'transform 0.3s ease',
        cursor: 'default'
    },
    politicasGuardadasContainer: {
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
        background: 'linear-gradient(90deg, #79ae92, #5f7a8b)',
        color: '#fff',
        padding: '14px 25px',
        fontSize: '17px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '700',
        boxShadow: '0 6px 14px rgba(121, 174, 146, 0.5)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
    },
    deleteButton: {
        background: 'linear-gradient(90deg, #79ae92, #5f7a8b)',
        color: '#fff',
        padding: '14px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 'normal',
        boxShadow: '0 6px 14px rgba(121, 174, 10, 0.5)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    politicaItem: {
        padding: '15px',
        borderBottom: '1px solid #eee',
        marginBottom: '10px'
    }
};

export default Politica;