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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const Cuartos = () => {
  const [cuartos, setCuartos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [formData, setFormData] = useState({
    cuarto: '',
    estado: 'Disponible',
    horario: '',
    imagenes: [],
    existingImages: [],
    id_hoteles: '',
    preciohora: '',
    preciodia: '',
    precionoche: '',
    preciosemana: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCuartos();
    fetchHoteles();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      imagenes: [...formData.imagenes, ...files],
    });
  };

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      setFormData({
        ...formData,
        existingImages: formData.existingImages.filter((_, i) => i !== index),
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
    formDataToSend.append('preciohora', formData.preciohora || '');
    formDataToSend.append('preciodia', formData.preciodia || '');
    formDataToSend.append('precionoche', formData.precionoche || '');
    formDataToSend.append('preciosemana', formData.preciosemana || '');

    const originalImages = editingId ? parseImagesSafely(cuartos.find(c => c.id === editingId)?.imagenes) : [];
    const imagesToRemove = originalImages
      .map((img, index) => (formData.existingImages.includes(img) ? -1 : index))
      .filter(index => index !== -1);
    if (imagesToRemove.length > 0) {
      formDataToSend.append('imagesToRemove', JSON.stringify(imagesToRemove));
    }

    formData.imagenes.forEach((image) => {
      formDataToSend.append('imagenes', image);
    });

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
    const existingImages = parseImagesSafely(cuarto.imagenes);
    setFormData({
      cuarto: cuarto.cuarto,
      estado: cuarto.estado,
      horario: cuarto.horario ? new Date(cuarto.horario).toISOString().slice(0, 16) : '',
      imagenes: [],
      existingImages,
      id_hoteles: cuarto.id_hoteles,
      preciohora: cuarto.preciohora || '',
      preciodia: cuarto.preciodia || '',
      precionoche: cuarto.precionoche || '',
      preciosemana: cuarto.preciosemana || '',
    });
    setEditingId(cuarto.id);
    setOpenModal(true);
  };

  const resetForm = () => {
    setFormData({
      cuarto: '',
      estado: 'Disponible',
      horario: '',
      imagenes: [],
      existingImages: [],
      id_hoteles: '',
      preciohora: '',
      preciodia: '',
      precionoche: '',
      preciosemana: '',
    });
    setEditingId(null);
    setOpenModal(false);
  };

  const parseImagesSafely = (imagenes) => {
    try {
      if (!imagenes) return [];
      return JSON.parse(imagenes);
    } catch (error) {
      console.error('Error al parsear imágenes:', error.message);
      return [];
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, background: 'linear-gradient(to bottom, rgb(255, 255, 255), #ffffff)', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        Gestión de Habitaciones
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{
            background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(90deg, #1565c0, #1976d2)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            },
          }}
        >
          Agregar Cuarto
        </Button>
      </Box>

      {errorMessage && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error" onClose={() => setErrorMessage('')}>
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
            width: { xs: '90%', md: 600 },
            bgcolor: 'background.paper',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            p: 4,
            borderRadius: 2,
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '2px solid #e3f2fd',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: '#1976d2',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 3,
            }}
          >
            {editingId ? 'Editar Cuarto' : 'Agregar Cuarto'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
            <TextField
              label="Nombre del Cuarto"
              name="cuarto"
              type="text"
              value={formData.cuarto}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              inputProps={{ pattern: "[A-Za-z0-9 ]+" }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#555',
                  fontWeight: '500',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1976d2',
                },
              }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#555', fontWeight: '500', '&.Mui-focused': { color: '#1976d2' } }}>
                Estado
              </InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                  },
                }}
              >
                <MenuItem value="Disponible">Disponible</MenuItem>
                <MenuItem value="NoDisponible">No Disponible</MenuItem>
                <MenuItem value="Ocupado">Ocupado</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Horario"
              name="horario"
              type="datetime-local"
              value={formData.horario}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#555',
                  fontWeight: '500',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1976d2',
                },
              }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#555', fontWeight: '500', '&.Mui-focused': { color: '#1976d2' } }}>
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
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                  },
                }}
              >
                {hoteles.map((hotel) => (
                  <MenuItem key={hotel.id_hotel} value={hotel.id_hotel}>
                    {hotel.nombrehotel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {[
              { label: 'Precio por Hora', name: 'preciohora', type: 'number', inputProps: { step: '0.01', min: 0 } },
              { label: 'Precio por Día', name: 'preciodia', type: 'number', inputProps: { step: '0.01', min: 0 } },
              { label: 'Precio por Noche', name: 'precionoche', type: 'number', inputProps: { step: '0.01', min: 0 } },
              { label: 'Precio por Semana', name: 'preciosemana', type: 'number', inputProps: { step: '0.01', min: 0 } },
            ].map(({ label, name, type, inputProps }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                type={type}
                value={formData[name] || ''}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                inputProps={inputProps}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555',
                    fontWeight: '500',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1976d2',
                  },
                }}
              />
            ))}
            <Box sx={{ mb: 2, gridColumn: '1 / -1' }}>
              <InputLabel sx={{ color: '#555', fontWeight: '500', mb: 1 }}>
                Imágenes (puede subir varias)
              </InputLabel>
              <Input
                type="file"
                name="imagenes"
                onChange={handleImageChange}
                inputProps={{ multiple: true, accept: 'image/*' }}
                fullWidth
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  padding: '8px',
                }}
              />
              {(formData.existingImages.length > 0 || formData.imagenes.length > 0) && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.existingImages.map((image, index) => (
                    <Box key={`existing-${index}`} sx={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={`data:image/jpeg;base64,${image}`}
                        alt={`Imagen existente ${index + 1}`}
                        style={{
                          height: '64px',
                          width: '64px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index, true)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          color: 'white',
                          backgroundColor: 'rgba(239, 83, 80, 0.7)',
                          '&:hover': { backgroundColor: 'rgba(239, 83, 80, 1)' },
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
                          height: '64px',
                          width: '64px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index, false)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          color: 'white',
                          backgroundColor: 'rgba(239, 83, 80, 0.7)',
                          '&:hover': { backgroundColor: 'rgba(239, 83, 80, 1)' },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1565c0, #1976d2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  },
                }}
              >
                {editingId ? 'Actualizar' : 'Agregar'}
              </Button>
              <Button
                variant="contained"
                sx={{
                  mt: 1,
                  background: 'linear-gradient(90deg, #ef5350, #f44336)',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #d32f2f, #ef5350)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(239, 83, 80, 0.3)',
                  },
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
        elevation={3}
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="cuartos table">
          <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
            <TableRow>
              {['Nombre', 'Estado', 'Horario', 'Hotel', 'Precio/Hora', 'Precio/Día', 'Precio/Noche', 'Precio/Semana', 'Imágenes', 'Acciones'].map(
                (head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: 'bold',
                      color: '#1976d2',
                      fontSize: '1rem',
                      padding: '16px',
                    }}
                  >
                    {head}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {cuartos.map((cuarto) => (
              <TableRow
                key={cuarto.id}
                sx={{
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  transition: 'background-color 0.3s',
                  backgroundColor: cuarto.estado === 'NoDisponible' || cuarto.estado === 'Ocupado' ? '#ffebee' : 'inherit',
                }}
              >
                <TableCell sx={{ color: '#333' }}>{cuarto.cuarto}</TableCell>
                <TableCell sx={{ color: '#333', fontWeight: cuarto.estado !== 'Disponible' ? 'bold' : 'normal' }}>
                  {cuarto.estado}
                </TableCell>
                <TableCell sx={{ color: '#333' }}>{cuarto.horario ? new Date(cuarto.horario).toLocaleString() : 'Sin horario'}</TableCell>
                <TableCell sx={{ color: '#333' }}>
                  {hoteles.find(hotel => hotel.id_hotel === cuarto.id_hoteles)?.nombrehotel || 'Hotel no encontrado'}
                </TableCell>
                <TableCell sx={{ color: '#333' }}>{cuarto.preciohora ? `$${cuarto.preciohora.toFixed(2)}` : 'No definido'}</TableCell>
                <TableCell sx={{ color: '#333' }}>{cuarto.preciodia ? `$${cuarto.preciodia.toFixed(2)}` : 'No definido'}</TableCell>
                <TableCell sx={{ color: '#333' }}>{cuarto.precionoche ? `$${cuarto.precionoche.toFixed(2)}` : 'No definido'}</TableCell>
                <TableCell sx={{ color: '#333' }}>{cuarto.preciosemana ? `$${cuarto.preciosemana.toFixed(2)}` : 'No definido'}</TableCell>
                <TableCell>
                  {(() => {
                    const images = parseImagesSafely(cuarto.imagenes);
                    if (images.length > 0) {
                      return (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {images.map((img, index) => (
                            <img
                              key={index}
                              src={`data:image/jpeg;base64,${img}`}
                              alt={`Imagen ${index + 1}`}
                              style={{
                                height: '64px',
                                width: '64px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                              }}
                            />
                          ))}
                        </Box>
                      );
                    }
                    return (
                      <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        Sin imágenes
                      </Typography>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(cuarto)}
                    sx={{
                      mr: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(cuarto.id)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(239, 83, 80, 0.1)',
                      },
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