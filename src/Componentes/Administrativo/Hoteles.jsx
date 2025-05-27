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
  InputLabel,
  Input,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const Hoteles = () => {
  const [hoteles, setHoteles] = useState([]);
  const [formData, setFormData] = useState({
    nombrehotel: '',
    direccion: '',
    telefono: '',
    correo: '',
    numhabitacion: '',
    descripcion: '',
    servicios: '',
    imagen: null,
    removeImage: false, // Para manejar la eliminación de la imagen
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchHoteles();
  }, []);

  const fetchHoteles = async () => {
    try {
      const response = await axios.get('https://backendd-q0zc.onrender.com/api/hoteles');
      const hotelesData = response.data.map(hotel => {
        let imagenParsed = null;
        try {
          if (hotel.imagen) {
            imagenParsed = JSON.parse(hotel.imagen);
          }
        } catch (error) {
          console.error(`Error al parsear imagen del hotel ${hotel.id_hotel}:`, error);
          imagenParsed = null;
        }
        return {
          ...hotel,
          id: hotel.id_hotel,
          imagen: imagenParsed
        };
      });
      setHoteles(hotelesData);
      setErrorMessage('');
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
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imagen: file,
        removeImage: false, // Resetear la opción de eliminar al subir una nueva imagen
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImageChange = (e) => {
    setFormData({
      ...formData,
      removeImage: e.target.checked,
      imagen: null, // Resetear la imagen si se marca eliminar
    });
    if (e.target.checked) {
      setImagePreview(null); // Limpiar la vista previa
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('nombrehotel', formData.nombrehotel);
    formDataToSend.append('direccion', formData.direccion);
    formDataToSend.append('telefono', formData.telefono);
    formDataToSend.append('correo', formData.correo);
    formDataToSend.append('numhabitacion', formData.numhabitacion);
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('servicios', formData.servicios);
    formDataToSend.append('removeImage', formData.removeImage);
    if (formData.imagen instanceof File) {
      formDataToSend.append('imagen', formData.imagen);
    }

    try {
      if (editingId) {
        await axios.put(`https://backendd-q0zc.onrender.com/api/hoteles/${editingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('https://backendd-q0zc.onrender.com/api/hoteles', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchHoteles();
      resetForm();
      setOpenModal(false);
    } catch (error) {
      console.error('Error al guardar hotel:', error);
      setErrorMessage(error.response?.data || 'Error al guardar el hotel. Intente de nuevo.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este hotel?')) {
      try {
        await axios.delete(`https://backendd-q0zc.onrender.com/api/hoteles/${id}`);
        fetchHoteles();
        setErrorMessage('');
      } catch (error) {
        console.error('Error al eliminar hotel:', error);
        setErrorMessage('Error al eliminar el hotel. Verifique las dependencias o intente de nuevo.');
      }
    }
  };

  const handleEdit = (hotel) => {
    setFormData({
      nombrehotel: hotel.nombrehotel || '',
      direccion: hotel.direccion || '',
      telefono: hotel.telefono || '',
      correo: hotel.correo || '',
      numhabitacion: hotel.numhabitacion || '',
      descripcion: hotel.descripcion || '',
      servicios: hotel.servicios || '',
      imagen: null,
      removeImage: false,
    });
    setImagePreview(hotel.imagen && hotel.imagen.data ? `data:${hotel.imagen.mimeType};base64,${hotel.imagen.data}` : null);
    setEditingId(hotel.id_hotel);
    setOpenModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombrehotel: '',
      direccion: '',
      telefono: '',
      correo: '',
      numhabitacion: '',
      descripcion: '',
      servicios: '',
      imagen: null,
      removeImage: false,
    });
    setImagePreview(null);
    setEditingId(null);
    setOpenModal(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, background: 'linear-gradient(to bottom, rgb(255, 255, 255), #ffffff)', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        Gestión de Hoteles
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
          Agregar Hoteles
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
            {editingId ? 'Editar Hotel' : 'Agregar Hotel'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
            {[
              { label: 'Nombre del Hotel', name: 'nombrehotel', type: 'text' },
              { label: 'Dirección', name: 'direccion', type: 'text' },
              { label: 'Teléfono', name: 'telefono', type: 'text' },
              { label: 'Correo', name: 'correo', type: 'email' },
              { label: 'Número de Habitaciones', name: 'numhabitacion', type: 'number', inputProps: { min: 0 } },
              { label: 'Servicios', name: 'servicios', type: 'text' },
            ].map(({ label, name, type, inputProps }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required={['nombrehotel', 'correo', 'numhabitacion'].includes(name)}
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
            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              sx={{
                mb: 2,
                gridColumn: '1 / -1',
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
            <Box sx={{ mb: 2, gridColumn: '1 / -1' }}>
              <InputLabel sx={{ color: '#555', fontWeight: '500', mb: 1 }}>
                Imagen del Hotel
              </InputLabel>
              <Input
                type="file"
                name="imagen"
                onChange={handleImageChange}
                inputProps={{ accept: 'image/*' }}
                fullWidth
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  padding: '8px',
                }}
              />
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    style={{
                      height: '100px',
                      width: '100px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </Box>
              )}
              {editingId && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.removeImage}
                      onChange={handleRemoveImageChange}
                      name="removeImage"
                      color="primary"
                    />
                  }
                  label="Eliminar imagen actual"
                  sx={{ mt: 1 }}
                />
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
        <Table sx={{ minWidth: 650 }} aria-label="hoteles table">
          <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
            <TableRow>
              {['Nombre', 'Dirección', 'Teléfono', 'Correo', 'Habitaciones', 'Descripción', 'Servicios', 'Imagen', 'Acciones'].map(
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
            {hoteles.map((hotel) => (
              <TableRow
                key={hotel.id}
                sx={{
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  transition: 'background-color 0.3s',
                }}
              >
                <TableCell sx={{ color: '#333' }}>{hotel.nombrehotel}</TableCell>
                <TableCell sx={{ color: '#333' }}>{hotel.direccion || 'Sin dirección'}</TableCell>
                <TableCell sx={{ color: '#333' }}>{hotel.telefono || 'Sin teléfono'}</TableCell>
                <TableCell sx={{ color: '#333' }}>{hotel.correo}</TableCell>
                <TableCell sx={{ color: '#333' }}>{hotel.numhabitacion}</TableCell>
                <TableCell sx={{ color: '#333' }}>{hotel.descripcion || 'Sin descripción'}</TableCell>
                <TableCell sx={{ color: '#333' }}>{hotel.servicios || 'Sin servicios'}</TableCell>
                <TableCell>
                  {hotel.imagen && hotel.imagen.data ? (
                    <img
                      src={`data:${hotel.imagen.mimeType};base64,${hotel.imagen.data}`}
                      alt="Hotel"
                      style={{
                        height: '64px',
                        width: '64px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  ) : (
                    <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                      Sin imagen
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(hotel)}
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
                    onClick={() => handleDelete(hotel.id)}
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

export default Hoteles;