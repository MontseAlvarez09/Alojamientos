import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Container,
  Modal,
  IconButton,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Input,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const Cuartos = () => {
  const [cuartos, setCuartos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [tiposHabitacion, setTiposHabitacion] = useState([]);
  const [formData, setFormData] = useState({
    cuarto: '',
    estado: 'Disponible',
    horario: false,
    id_hoteles: '',
    idtipohabitacion: '',
    imagenes: [],
    imagenhabitacion: null,
    existingImages: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCuartos();
    fetchHoteles();
    fetchTiposHabitacion();
  }, []);

  const fetchCuartos = async () => {
    try {
      const response = await axios.get('https://backendd-q0zc.onrender.com/api/cuartos');
      setCuartos(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener cuartos:', error);
      setErrorMessage('Error al cargar los cuartos. Intente de nuevo.');
    }
  };

  const fetchHoteles = async () => {
    try {
      const response = await axios.get('https://backendd-q0zc.onrender.com/api/hoteles');
      setHoteles(response.data);
    } catch (error) {
      console.error('Error al obtener hoteles:', error);
      setErrorMessage('Error al cargar los hoteles. Intente de nuevo.');
    }
  };

  const fetchTiposHabitacion = async () => {
    try {
      const response = await axios.get('https://backendd-q0zc.onrender.com/api/tipohabitacion');
      setTiposHabitacion(response.data);
    } catch (error) {
      console.error('Error al obtener tipos de habitación:', error);
      setErrorMessage('Error al cargar los tipos de habitación. Intente de nuevo.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (field === 'imagenes') {
      const files = Array.from(e.target.files);
      setFormData({
        ...formData,
        imagenes: [...formData.imagenes, ...files],
      });
    } else if (field === 'imagenhabitacion') {
      setFormData({
        ...formData,
        imagenhabitacion: file,
      });
    }
  };

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      setFormData({
        ...formData,
        existingImages: formData.existingImages.filter((_, i) => i !== index),
      });
    } else if (index === 'imagenhabitacion') {
      setFormData({
        ...formData,
        imagenhabitacion: null,
      });
    } else {
      setFormData({
        ...formData,
        imagenes: formData.imagenes.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('cuarto', formData.cuarto);
    formDataToSend.append('estado', formData.estado);
    formDataToSend.append('horario', formData.horario);
    formDataToSend.append('id_hoteles', formData.id_hoteles);
    formDataToSend.append('idtipohabitacion', formData.idtipohabitacion);

    const originalImages = editingId ? cuartos.find(c => c.id === editingId)?.imagenes || [] : [];
    const imagesToRemove = originalImages
      .map((img, index) => (formData.existingImages.includes(img) ? -1 : index))
      .filter(index => index !== -1);
    if (imagesToRemove.length > 0) {
      formDataToSend.append('imagesToRemove', JSON.stringify(imagesToRemove));
    }

    formData.imagenes.forEach((image) => {
      formDataToSend.append('imagenes', image);
    });
    if (formData.imagenhabitacion) {
      formDataToSend.append('imagenhabitacion', formData.imagenhabitacion);
    }

    try {
      if (editingId) {
        await axios.put(`https://backendd-q0zc.onrender.com/api/cuartos/${editingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('https://backendd-q0zc.onrender.com/api/cuartos', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchCuartos();
      resetForm();
      setOpenModal(false);
    } catch (error) {
      console.error('Error al guardar cuarto:', error);
      setErrorMessage(error.response?.data || 'Error al guardar el cuarto. Intente de nuevo.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este cuarto?')) {
      try {
        await axios.delete(`https://backendd-q0zc.onrender.com/api/cuartos/${id}`);
        fetchCuartos();
        setErrorMessage('');
      } catch (error) {
        console.error('Error al eliminar cuarto:', error);
        setErrorMessage(error.response?.data || 'Error al eliminar el cuarto. Intente de nuevo.');
      }
    }
  };

  const handleEdit = (cuarto) => {
    setFormData({
      cuarto: cuarto.cuarto,
      estado: cuarto.estado,
      horario: cuarto.horario === '24 horas',
      id_hoteles: cuarto.id_hoteles,
      idtipohabitacion: cuarto.idtipohabitacion,
      imagenes: [],
      imagenhabitacion: null,
      existingImages: cuarto.imagenes || [],
    });
    setEditingId(cuarto.id);
    setOpenModal(true);
  };

  const resetForm = () => {
    setFormData({
      cuarto: '',
      estado: 'Disponible',
      horario: false,
      id_hoteles: '',
      idtipohabitacion: '',
      imagenes: [],
      imagenhabitacion: null,
      existingImages: [],
    });
    setEditingId(null);
    setOpenModal(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ 
        color: '#0b7583', 
        fontWeight: '600',
        textShadow: '0 2px 4px rgba(11, 117, 131, 0.1)',
        mb: 4
      }}>
        Gestión de Habitaciones
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{
            background: 'linear-gradient(135deg, #0b7583 0%, #549c94 100%)',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: '500',
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(11, 117, 131, 0.3)',
            border: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #085a66 0%, #427a74 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(11, 117, 131, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Agregar Habitación
        </Button>
      </Box>

      {errorMessage && (
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity="error" 
            onClose={() => setErrorMessage('')}
            sx={{
              borderRadius: '10px',
              backgroundColor: 'rgba(243, 163, 132, 0.1)',
              border: '1px solid rgba(243, 163, 132, 0.3)',
              '& .MuiAlert-icon': {
                color: '#f3a384'
              }
            }}
          >
            {errorMessage}
          </Alert>
        </Box>
      )}

      <Modal open={openModal} onClose={resetForm}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '85%', md: 650 },
            bgcolor: 'background.paper',
            boxShadow: '0 20px 60px rgba(11, 117, 131, 0.15)',
            p: 4,
            borderRadius: '16px',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '1px solid rgba(76, 148, 188, 0.3)',
            backgroundColor: '#ffffff',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: '#0b7583',
              fontWeight: '600',
              textAlign: 'center',
              mb: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '3px',
                background: 'linear-gradient(90deg, #4c94bc, #549c94)',
                borderRadius: '2px',
              }
            }}
          >
            {editingId ? 'Editar Habitación' : 'Nueva Habitación'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 3,
            mt: 3
          }}>
            <TextField
              label="Nombre de la Habitación"
              name="cuarto"
              type="text"
              value={formData.cuarto}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              inputProps={{ pattern: "[A-Za-z0-9 ]+" }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: 'rgba(179, 201, 202, 0.08)',
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(76, 148, 188, 0.3)',
                    borderWidth: '1.5px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4c94bc',
                    borderWidth: '2px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0b7583',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(76, 148, 188, 0.1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#549c94',
                  fontWeight: '500',
                  '&.Mui-focused': {
                    color: '#0b7583',
                  },
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ 
                color: '#549c94', 
                fontWeight: '500',
                '&.Mui-focused': { color: '#0b7583' }
              }}>
                Estado
              </InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{
                  borderRadius: '10px',
                  backgroundColor: 'rgba(179, 201, 202, 0.08)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(76, 148, 188, 0.3)',
                    borderWidth: '1.5px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4c94bc',
                    borderWidth: '2px',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0b7583',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(76, 148, 188, 0.1)',
                  },
                }}
              >
                <MenuItem value="Disponible" sx={{ '&:hover': { backgroundColor: 'rgba(84, 156, 148, 0.1)' } }}>
                  Disponible
                </MenuItem>
                <MenuItem value="NoDisponible" sx={{ '&:hover': { backgroundColor: 'rgba(84, 156, 148, 0.1)' } }}>
                  No Disponible
                </MenuItem>
                <MenuItem value="Ocupado" sx={{ '&:hover': { backgroundColor: 'rgba(84, 156, 148, 0.1)' } }}>
                  Ocupado
                </MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  name="horario"
                  checked={formData.horario}
                  onChange={handleInputChange}
                  sx={{
                    color: '#4c94bc',
                    '&.Mui-checked': {
                      color: '#0b7583',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(76, 148, 188, 0.1)',
                    },
                  }}
                />
              }
              label="¿Trabaja 24 horas?"
              sx={{
                gridColumn: '1 / -1',
                color: '#549c94',
                fontWeight: '500',
                mx: 1,
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.95rem',
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ 
                color: '#549c94', 
                fontWeight: '500',
                '&.Mui-focused': { color: '#0b7583' }
              }}>
                Hotel
              </InputLabel>
              <Select
                name="id_hoteles"
                value={formData.id_hoteles}
                onChange={handleInputChange}
                variant="outlined"
                required
                disabled={editingId !== null}
                sx={{
                  borderRadius: '10px',
                  backgroundColor: 'rgba(179, 201, 202, 0.08)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(76, 148, 188, 0.3)',
                    borderWidth: '1.5px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4c94bc',
                    borderWidth: '2px',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0b7583',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(76, 148, 188, 0.1)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(179, 201, 202, 0.15)',
                  },
                }}
              >
                {hoteles.map((hotel) => (
                  <MenuItem 
                    key={hotel.id_hotel} 
                    value={hotel.id_hotel}
                    sx={{ '&:hover': { backgroundColor: 'rgba(84, 156, 148, 0.1)' } }}
                  >
                    {hotel.nombrehotel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ 
                color: '#549c94', 
                fontWeight: '500',
                '&.Mui-focused': { color: '#0b7583' }
              }}>
                Tipo de Habitación
              </InputLabel>
              <Select
                name="idtipohabitacion"
                value={formData.idtipohabitacion}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{
                  borderRadius: '10px',
                  backgroundColor: 'rgba(179, 201, 202, 0.08)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(76, 148, 188, 0.3)',
                    borderWidth: '1.5px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4c94bc',
                    borderWidth: '2px',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0b7583',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(76, 148, 188, 0.1)',
                  },
                }}
              >
                {tiposHabitacion.map((tipo) => (
                  <MenuItem 
                    key={tipo.id_tipohabitacion} 
                    value={tipo.id_tipohabitacion}
                    sx={{ '&:hover': { backgroundColor: 'rgba(84, 156, 148, 0.1)' } }}
                  >
                    {tipo.tipohabitacion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ gridColumn: '1 / -1', mt: 1 }}>
              <InputLabel sx={{ 
                color: '#549c94', 
                fontWeight: '500', 
                mb: 1.5,
                fontSize: '1rem'
              }}>
                Imágenes de la habitación (Galería)
              </InputLabel>
              <Input
                type="file"
                name="imagenes"
                onChange={(e) => handleImageChange(e, 'imagenes')}
                inputProps={{ multiple: true, accept: 'image/*' }}
                fullWidth
                sx={{
                  backgroundColor: 'rgba(179, 201, 202, 0.08)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  border: '1.5px dashed rgba(76, 148, 188, 0.4)',
                  '&:hover': {
                    borderColor: '#4c94bc',
                    backgroundColor: 'rgba(179, 201, 202, 0.12)',
                  },
                  '&:before': {
                    display: 'none',
                  },
                  '&:after': {
                    display: 'none',
                  },
                }}
              />
              {(formData.existingImages.length > 0 || formData.imagenes.length > 0) && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {formData.existingImages.map((image, index) => (
                    <Box key={`existing-${index}`} sx={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={`data:image/jpeg;base64,${image}`}
                        alt={`Imagen existente ${index + 1}`}
                        style={{
                          height: '80px',
                          width: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(11, 117, 131, 0.15)',
                          border: '2px solid rgba(76, 148, 188, 0.3)',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index, true)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          color: 'white',
                          backgroundColor: '#f3a384',
                          width: '24px',
                          height: '24px',
                          '&:hover': { 
                            backgroundColor: '#e89670',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  {formData.imagenes.map((image, index) => (
                    <Box key={`new-${index}`} sx={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Vista previa ${index + 1}`}
                        style={{
                          height: '80px',
                          width: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(11, 117, 131, 0.15)',
                          border: '2px solid rgba(76, 148, 188, 0.3)',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index, false)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          color: 'white',
                          backgroundColor: '#f3a384',
                          width: '24px',
                          height: '24px',
                          '&:hover': { 
                            backgroundColor: '#e89670',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box sx={{ gridColumn: '1 / -1', mt: 3 }}>
              <InputLabel sx={{ 
                color: '#549c94', 
                fontWeight: '500', 
                mb: 1.5,
                fontSize: '1rem'
              }}>
                Imagen Principal (Imagen de Portada)
              </InputLabel>
              <Input
                type="file"
                name="imagenhabitacion"
                onChange={(e) => handleImageChange(e, 'imagenhabitacion')}
                inputProps={{ accept: 'image/*' }}
                fullWidth
                sx={{
                  backgroundColor: 'rgba(179, 201, 202, 0.08)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  border: '1.5px dashed rgba(76, 148, 188, 0.4)',
                  '&:hover': {
                    borderColor: '#4c94bc',
                    backgroundColor: 'rgba(179, 201, 202, 0.12)',
                  },
                  '&:before': {
                    display: 'none',
                  },
                  '&:after': {
                    display: 'none',
                  },
                }}
              />
              {formData.imagenhabitacion && (
                <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                  <img
                    src={URL.createObjectURL(formData.imagenhabitacion)}
                    alt="Vista previa imagen principal"
                    style={{
                      height: '80px',
                      width: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(11, 117, 131, 0.15)',
                      border: '2px solid rgba(76, 148, 188, 0.3)',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage('imagenhabitacion', false)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      color: 'white',
                      backgroundColor: '#f3a384',
                      width: '24px',
                      height: '24px',
                      '&:hover': { 
                        backgroundColor: '#e89670',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box sx={{ 
              gridColumn: '1 / -1', 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center',
              mt: 4,
              pt: 3,
              borderTop: '1px solid rgba(76, 148, 188, 0.2)'
            }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #0b7583 0%, #549c94 100%)',
                  borderRadius: '10px',
                  padding: '12px 32px',
                  fontWeight: '500',
                  textTransform: 'none',
                  fontSize: '1rem',
                  minWidth: '120px',
                  boxShadow: '0 4px 15px rgba(11, 117, 131, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #085a66 0%, #427a74 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(11, 117, 131, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {editingId ? 'Actualizar' : 'Crear Habitación'}
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#f3a384',
                  color: '#f3a384',
                  borderRadius: '10px',
                  padding: '12px 32px',
                  fontWeight: '500',
                  textTransform: 'none',
                  fontSize: '1rem',
                  minWidth: '120px',
                  borderWidth: '1.5px',
                  '&:hover': {
                    borderColor: '#e89670',
                    backgroundColor: 'rgba(243, 163, 132, 0.08)',
                    borderWidth: '1.5px',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={resetForm}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(76, 148, 188, 0.15)',
          border: '1px solid rgba(76, 148, 188, 0.2)',
          background: 'linear-gradient(145deg, #ffffff 0%, rgba(179, 201, 202, 0.05) 100%)',
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="tabla de habitaciones">
          <TableHead sx={{ 
            background: '#0b7583'
          }}>
            <TableRow>
              {['Nombre', 'Estado', 'Horario', 'Hotel', 'Tipo de Habitación', 'Imagen Principal', 'Imágenes', 'Acciones'].map(
                (head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: '600',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      padding: '20px 16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '2px solid rgba(11, 117, 131, 0.1)',
                    }}
                  >
                    {head}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {cuartos.map((cuarto, index) => (
              <TableRow
                key={cuarto.id}
                sx={{
                  '&:hover': { 
                    backgroundColor: 'rgba(76, 148, 188, 0.08)',
                    transform: 'scale(1.001)',
                  },
                  transition: 'all 0.2s ease',
                  backgroundColor: index % 2 === 0 ? 'rgba(179, 201, 202, 0.03)' : 'transparent',
                  borderBottom: '1px solid rgba(179, 201, 202, 0.15)',
                  ...(cuarto.estado === 'NoDisponible' || cuarto.estado === 'Ocupado' ? {
                    backgroundColor: 'rgba(243, 163, 132, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(243, 163, 132, 0.12)',
                    }
                  } : {})
                }}
              >
                <TableCell sx={{ 
                  color: '#0b7583', 
                  fontWeight: '500',
                  padding: '16px'
                }}>
                  {cuarto.cuarto}
                </TableCell>
                <TableCell sx={{ 
                  color: cuarto.estado === 'Disponible' ? '#549c94' : '#f3a384', 
                  fontWeight: '500',
                  padding: '16px'
                }}>
                  {cuarto.estado}
                </TableCell>
                <TableCell sx={{ 
                  color: '#4c94bc',
                  padding: '16px'
                }}>
                  {cuarto.horario || 'Sin horario'}
                </TableCell>
                <TableCell sx={{ 
                  color: '#549c94',
                  padding: '16px'
                }}>
                  {cuarto.nombrehotel || 'Hotel no encontrado'}
                </TableCell>
                <TableCell sx={{ 
                  color: '#4c94bc',
                  padding: '16px'
                }}>
                  {cuarto.tipohabitacion || 'Tipo no encontrado'}
                </TableCell>
                <TableCell sx={{ padding: '16px' }}>
                  {cuarto.imagenhabitacion ? (
                    <img
                      src={`data:image/jpeg;base64,${cuarto.imagenhabitacion}`}
                      alt="Imagen principal"
                      style={{
                        height: '50px',
                        width: '50px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(11, 117, 131, 0.15)',
                        border: '1px solid rgba(76, 148, 188, 0.3)',
                      }}
                    />
                  ) : (
                    <Typography color="textSecondary" sx={{ 
                      fontStyle: 'italic',
                      color: '#b3c9ca'
                    }}>
                      Sin imagen
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ padding: '16px' }}>
                  {cuarto.imagenes && cuarto.imagenes.length > 0 ? (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {cuarto.imagenes.map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={`data:image/jpeg;base64,${img}`}
                          alt={`Imagen ${imgIndex + 1}`}
                          style={{
                            height: '50px',
                            width: '50px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(11, 117, 131, 0.15)',
                            border: '1px solid rgba(76, 148, 188, 0.3)',
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography color="textSecondary" sx={{ 
                      fontStyle: 'italic',
                      color: '#b3c9ca'
                    }}>
                      Sin imágenes
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ padding: '16px' }}>
                  <IconButton
                    onClick={() => handleEdit(cuarto)}
                    sx={{
                      mr: 1,
                      color: '#4c94bc',
                      backgroundColor: 'rgba(76, 148, 188, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 148, 188, 0.2)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(cuarto.id)}
                    sx={{
                      color: '#f3a384',
                      backgroundColor: 'rgba(243, 163, 132, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(243, 163, 132, 0.2)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Cuartos;