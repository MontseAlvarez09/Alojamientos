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
import MyLocationIcon from '@mui/icons-material/MyLocation';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Base URL for API (working locally)
const API_BASE_URL = 'https://backendd-q0zc.onrender.com';

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
    removeImage: false,
    latitud: '',
    longitud: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [locationError, setLocationError] = useState('');
  const [habitaciones, setHabitaciones] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [openHabitacionesModal, setOpenHabitacionesModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchHoteles();
  }, []);

  const fetchHoteles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hoteles`);
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

  const fetchHabitaciones = async (hotelId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hoteles/${hotelId}/cuartos`);
      setHabitaciones(response.data);
      setSelectedHotelId(hotelId);
      setOpenHabitacionesModal(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener habitaciones:', error);
      setErrorMessage('Error al cargar las habitaciones. Intente de nuevo.');
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'nombrehotel':
        if (!value.trim()) error = 'El nombre del hotel es requerido';
        else if (value.trim().length < 3) error = 'El nombre debe tener al menos 3 caracteres';
        else if (value.trim().length > 100) error = 'El nombre no puede exceder 100 caracteres';
        break;
      case 'telefono':
        if (value && !/^\d{10}$/.test(value)) error = 'El teléfono debe contener exactamente 10 dígitos';
        break;
      case 'correo':
        if (!value.trim()) error = 'El correo electrónico es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Ingrese un correo electrónico válido';
        break;
      case 'numhabitacion':
        if (!value) error = 'El número de habitaciones es requerido';
        else if (isNaN(value) || parseInt(value) < 1) error = 'Debe tener al menos 1 habitación';
        else if (parseInt(value) > 10000) error = 'El número de habitaciones no puede exceder 10,000';
        break;
      case 'direccion':
        if (value && value.length > 200) error = 'La dirección no puede exceder 200 caracteres';
        break;
      case 'descripcion':
        if (value && value.length > 1000) error = 'La descripción no puede exceder 1000 caracteres';
        break;
      case 'servicios':
        if (value && value.length > 500) error = 'Los servicios no pueden exceder 500 caracteres';
        break;
      case 'latitud':
        if (value && (isNaN(value) || value < -90 || value > 90)) error = 'La latitud debe estar entre -90 y 90 grados';
        break;
      case 'longitud':
        if (value && (isNaN(value) || value < -180 || value > 180)) error = 'La longitud debe estar entre -180 y 180 grados';
        break;
      default:
        break;
    }
    return error;
  };

  const validateAllFields = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'imagen' && key !== 'removeImage') {
        const error = validateField(key, formData[key]);
        if (error) errors[key] = error;
      }
    });
    return errors;
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            latitud: latitude.toString(),
            longitud: longitude.toString(),
          }));
          setLocationError('');
          setValidationErrors(prev => ({
            ...prev,
            latitud: '',
            longitud: ''
          }));
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          let errorMsg = 'No se pudo obtener la ubicación. ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg += 'Permiso denegado por el usuario.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg += 'La ubicación no está disponible.';
              break;
            case error.TIMEOUT:
              errorMsg += 'Se agotó el tiempo para obtener la ubicación.';
              break;
            default:
              errorMsg += 'Ocurrió un error desconocido.';
              break;
          }
          setLocationError(errorMsg);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('La geolocalización no es compatible con este navegador.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    const error = validateField(name, name === 'telefono' ? value.replace(/\D/g, '') : value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)');
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrorMessage('La imagen no puede exceder 5MB');
        return;
      }
      setFormData({
        ...formData,
        imagen: file,
        removeImage: false,
      });
      setImagePreview(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleRemoveImageChange = (e) => {
    setFormData({
      ...formData,
      removeImage: e.target.checked,
      imagen: null,
    });
    if (e.target.checked) {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateAllFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setErrorMessage('Por favor corrija los errores en el formulario');
      return;
    }
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
    if (formData.latitud) formDataToSend.append('latitud', formData.latitud);
    if (formData.longitud) formDataToSend.append('longitud', formData.longitud);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/hoteles/${editingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/hoteles`, formDataToSend, {
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
        await axios.delete(`${API_BASE_URL}/api/hoteles/${id}`);
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
      latitud: hotel.latitud?.toString() || '',
      longitud: hotel.longitud?.toString() || '',
    });
    setImagePreview(hotel.imagen && hotel.imagen.data ? `data:${hotel.imagen.mimeType};base64,${hotel.imagen.data}` : null);
    setEditingId(hotel.id_hotel);
    setOpenModal(true);
    setValidationErrors({});
    setTouched({});
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
      latitud: '',
      longitud: '',
    });
    setImagePreview(null);
    setEditingId(null);
    setOpenModal(false);
    setLocationError('');
    setValidationErrors({});
    setTouched({});
    setErrorMessage('');
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
              { label: 'Nombre del Hotel', name: 'nombrehotel', type: 'text', required: true },
              { label: 'Dirección', name: 'direccion', type: 'text', required: false },
              {
                label: 'Teléfono',
                name: 'telefono',
                type: 'text',
                required: false,
                placeholder: '1234567890',
              },
              { label: 'Correo', name: 'correo', type: 'email', required: true },
              { label: 'Número de Habitaciones', name: 'numhabitacion', type: 'number', required: true, inputProps: { min: 1, max: 10000 } },
              { label: 'Servicios', name: 'servicios', type: 'text', required: false },
            ].map(({ label, name, type, required, inputProps, placeholder }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleInputChange}
                onBlur={handleBlur}
                variant="outlined"
                fullWidth
                required={required}
                inputProps={inputProps}
                placeholder={placeholder}
                error={touched[name] && !!validationErrors[name]}
                helperText={touched[name] && validationErrors[name]}
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
                    '&.Mui-error fieldset': {
                      borderColor: '#d32f2f',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555',
                    fontWeight: '500',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1976d2',
                  },
                  '& .MuiInputLabel-root.Mui-error': {
                    color: '#d32f2f',
                  },
                  '& .MuiFormHelperText-root.Mui-error': {
                    color: '#d32f2f',
                  },
                }}
              />
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField
                label="Latitud"
                name="latitud"
                type="text"
                value={formData.latitud}
                onChange={handleInputChange}
                onBlur={handleBlur}
                variant="outlined"
                fullWidth
                placeholder="-90.0 a 90.0"
                error={touched.latitud && !!validationErrors.latitud}
                helperText={touched.latitud && validationErrors.latitud}
                sx={{
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
                    '&.Mui-error fieldset': {
                      borderColor: '#d32f2f',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555',
                    fontWeight: '500',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1976d2',
                  },
                  '& .MuiInputLabel-root.Mui-error': {
                    color: '#d32f2f',
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleGetLocation}
                title="Obtener mi ubicación"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  },
                }}
              >
                <MyLocationIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField
                label="Longitud"
                name="longitud"
                type="text"
                value={formData.longitud}
                onChange={handleInputChange}
                onBlur={handleBlur}
                variant="outlined"
                fullWidth
                placeholder="-180.0 a 180.0"
                error={touched.longitud && !!validationErrors.longitud}
                helperText={touched.longitud && validationErrors.longitud}
                sx={{
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
                    '&.Mui-error fieldset': {
                      borderColor: '#d32f2f',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555',
                    fontWeight: '500',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1976d2',
                  },
                  '& .MuiInputLabel-root.Mui-error': {
                    color: '#d32f2f',
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleGetLocation}
                title="Obtener mi ubicación"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  },
                }}
              >
                <MyLocationIcon />
              </IconButton>
            </Box>
            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              onBlur={handleBlur}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              error={touched.descripcion && !!validationErrors.descripcion}
              helperText={touched.descripcion && validationErrors.descripcion}
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
                  '&.Mui-error fieldset': {
                    borderColor: '#d32f2f',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#555',
                  fontWeight: '500',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1976d2',
                },
                '& .MuiInputLabel-root.Mui-error': {
                  color: '#d32f2f',
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
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Formatos permitidos: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB
              </Typography>
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
            {locationError && (
              <Box sx={{ gridColumn: '1 / -1', mb: 2 }}>
                <Alert severity="warning" onClose={() => setLocationError('')}>
                  {locationError}
                </Alert>
              </Box>
            )}
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

      <Modal open={openHabitacionesModal} onClose={() => setOpenHabitacionesModal(false)}>
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
            Habitaciones del Hotel
          </Typography>
          <Table sx={{ minWidth: 300 }} aria-label="habitaciones table">
            <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Cuarto</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>ID Hotel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {habitaciones.map((habitacion) => (
                <TableRow key={habitacion.id}>
                  <TableCell sx={{ color: '#333' }}>{habitacion.cuarto}</TableCell>
                  <TableCell sx={{ color: '#333' }}>{habitacion.estado}</TableCell>
                  <TableCell sx={{ color: '#333' }}>{habitacion.id_hoteles}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              sx={{
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
              onClick={() => setOpenHabitacionesModal(false)}
            >
              Cerrar
            </Button>
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
              {['Nombre', 'Dirección', 'Habitaciones', 'Servicios', 'Latitud', 'Longitud', 'Imagen', 'Acciones'].map(
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
                <TableCell sx={{ color: '#333' }}>{hotel.numhabitacion}</TableCell>
                <TableCell sx={{ color: '#333' }}>{hotel.servicios || 'Sin servicios'}</TableCell>
                <TableCell sx={{ color: '#333' }}>{hotel.latitud || 'N/A'}</TableCell>
                <TableCell sx={{ color: '#333' }}>{hotel.longitud || 'N/A'}</TableCell>
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
                  <IconButton
                    color="info"
                    onClick={() => fetchHabitaciones(hotel.id)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      },
                    }}
                  >
                    <VisibilityIcon />
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