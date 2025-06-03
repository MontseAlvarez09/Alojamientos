import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Container, 
  IconButton,
  Button,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import { LocationOn, Directions, Hotel, Phone, Email, Home, Info, RoomService } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar el ícono personalizado rojo
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DetallesHoteles = () => {
  const { id } = useParams(); // Obtener el ID del hotel desde los parámetros de la URL
  const navigate = useNavigate(); // Hook para redirigir a otras rutas
  const [hotel, setHotel] = useState(null); // Estado para almacenar los datos del hotel
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://backendd-q0zc.onrender.com/api/hoteles/${id}`);
        let imagenParsed = null;
        try {
          if (response.data.imagen) {
            if (typeof response.data.imagen === 'object' && response.data.imagen.data && response.data.imagen.mimeType) {
              imagenParsed = response.data.imagen;
            } else {
              const parsed = JSON.parse(response.data.imagen);
              if (parsed.data && parsed.mimeType) {
                imagenParsed = { data: parsed.data, mimeType: parsed.mimeType };
              } else {
                imagenParsed = { data: response.data.imagen, mimeType: 'image/jpeg' };
              }
            }
          }
        } catch (parseError) {
          imagenParsed = { data: response.data.imagen, mimeType: 'image/jpeg' };
        }
        const hotelData = {
          ...response.data,
          id: response.data.id_hotel,
          imagen: imagenParsed
        };
        setHotel(hotelData);
        setError(null);
      } catch (error) {
        console.error('Error al obtener detalles del hotel:', error);
        setError(`No se pudieron cargar los detalles del hotel: ${error.message}. Por favor, verifica que el servidor esté corriendo y el ID sea correcto.`);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]); // El useEffect se ejecuta cada vez que cambia el id

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(11, 117, 131, 0.15)',
    border: '2px solid #b3c9ca',
  };

  const center = hotel && hotel.latitud && hotel.longitud ? {
    lat: parseFloat(hotel.latitud),
    lng: parseFloat(hotel.longitud)
  } : {
    lat: 19.4326, // Default: Ciudad de México
    lng: -99.1332
  };

  const getGoogleMapsLink = () => {
    if (!hotel || !hotel.latitud || !hotel.longitud) return '#';
    const hotelLat = parseFloat(hotel.latitud);
    const hotelLng = parseFloat(hotel.longitud);
    return `https://www.google.com/maps/dir/?api=1&destination=${hotelLat},${hotelLng}&travelmode=driving`;
  };

  const handleViewRooms = () => {
    navigate(`/cuartosp/${id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #b3c9ca 0%, #549c94 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card sx={{ 
          p: 4, 
          borderRadius: 3, 
          boxShadow: '0 12px 40px rgba(11, 117, 131, 0.2)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h5" sx={{ color: '#0b7583', fontWeight: 600 }}>
            Cargando detalles del hotel...
          </Typography>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #b3c9ca 0%, #549c94 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2
        }}
      >
        <Card sx={{ 
          p: 4, 
          borderRadius: 3, 
          boxShadow: '0 12px 40px rgba(243, 163, 132, 0.3)',
          background: 'rgba(255, 255, 255, 0.95)',
          maxWidth: 600
        }}>
          <Typography variant="h5" sx={{ color: '#f3a384', fontWeight: 600, textAlign: 'center' }}>
            {error}
          </Typography>
        </Card>
      </Box>
    );
  }

  if (!hotel) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #b3c9ca 0%, #549c94 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card sx={{ 
          p: 4, 
          borderRadius: 3, 
          boxShadow: '0 12px 40px rgba(11, 117, 131, 0.2)',
          background: 'rgba(255, 255, 255, 0.95)'
        }}>
          <Typography variant="h5" sx={{ color: '#0b7583', fontWeight: 600 }}>
            No se encontró el hotel.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        py: 4
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        {/* Header con título */}
        <Card 
          sx={{ 
            mb: 4, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #0b7583 0%, #549c94 100%)',
            boxShadow: '0 12px 40px rgba(11, 117, 131, 0.3)',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                letterSpacing: 1,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                mb: 1
              }}
            >
              {hotel.nombrehotel}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#b3c9ca',
                fontWeight: 400,
                opacity: 0.9
              }}
            >
              Detalles completos del establecimiento
            </Typography>
          </CardContent>
        </Card>

        {/* Contenido principal */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          {/* Información del hotel */}
          <Box sx={{ flex: 2 }}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(11, 117, 131, 0.15)',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(179, 201, 202, 0.3)'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  {/* Nombre */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton sx={{ bgcolor: '#4c94bc', color: 'white', '&:hover': { bgcolor: '#0b7583' } }}>
                      <Hotel />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#549c94', fontWeight: 600, fontSize: '0.7rem' }}>
                        NOMBRE DEL HOTEL
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#0b7583', fontWeight: 600, fontSize: '1rem' }}>
                        {hotel.nombrehotel}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#b3c9ca', opacity: 0.3 }} />

                  {/* Dirección */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton sx={{ bgcolor: '#549c94', color: 'white', '&:hover': { bgcolor: '#0b7583' } }}>
                      <Home />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#549c94', fontWeight: 600, fontSize: '0.7rem' }}>
                        DIRECCIÓN
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#0b7583', fontWeight: 500, fontSize: '0.9rem' }}>
                        {hotel.direccion || 'Sin dirección disponible'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#b3c9ca', opacity: 0.3 }} />

                  {/* Contacto */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <IconButton sx={{ bgcolor: '#f3a384', color: 'white', '&:hover': { bgcolor: '#0b7583' } }}>
                        <Phone />
                      </IconButton>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#549c94', fontWeight: 600, fontSize: '0.7rem' }}>
                          TELÉFONO
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#0b7583', fontWeight: 500, fontSize: '0.9rem' }}>
                          {hotel.telefono || 'No disponible'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <IconButton sx={{ bgcolor: '#4c94bc', color: 'white', '&:hover': { bgcolor: '#0b7583' } }}>
                        <Email />
                      </IconButton>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#549c94', fontWeight: 600, fontSize: '0.7rem' }}>
                          CORREO ELECTRÓNICO
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#0b7583', fontWeight: 500, fontSize: '0.9rem' }}>
                          {hotel.correo || 'No disponible'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#b3c9ca', opacity: 0.3 }} />

                  {/* Habitaciones */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                      label={`${hotel.numhabitacion} Habitaciones`}
                      sx={{ 
                        bgcolor: '#549c94', 
                        color: 'white', 
                        fontWeight: 600,
                        fontSize: '1rem',
                        px: 2
                      }}
                    />
                  </Box>

                  {/* Descripción */}
                  {hotel.descripcion && (
                    <>
                      <Divider sx={{ borderColor: '#b3c9ca', opacity: 0.3 }} />
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <IconButton sx={{ bgcolor: '#0b7583', color: 'white' }}>
                            <Info />
                          </IconButton>
                          <Typography variant="body1" sx={{ color: '#0b7583', fontWeight: 600, fontSize: '1rem' }}>
                            Descripción
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#549c94', 
                            lineHeight: 1.6,
                            backgroundColor: 'rgba(179, 201, 202, 0.1)',
                            p: 3,
                            borderRadius: 2,
                            borderLeft: '4px solid #4c94bc'
                          }}
                        >
                          {hotel.descripcion}
                        </Typography>
                      </Box>
                    </>
                  )}

                  {/* Servicios */}
                  {hotel.servicios && (
                    <>
                      <Divider sx={{ borderColor: '#b3c9ca', opacity: 0.3 }} />
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <IconButton sx={{ bgcolor: '#f3a384', color: 'white' }}>
                            <RoomService />
                          </IconButton>
                          <Typography variant="body1" sx={{ color: '#0b7583', fontWeight: 600, fontSize: '1rem' }}>
                            Servicios
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#549c94', 
                            lineHeight: 1.6,
                            backgroundColor: 'rgba(243, 163, 132, 0.1)',
                            p: 3,
                            borderRadius: 2,
                            borderLeft: '4px solid #f3a384'
                          }}
                        >
                          {hotel.servicios}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Imagen del hotel */}
          <Box sx={{ flex: 1 }}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(11, 117, 131, 0.15)',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.98)',
                height: 'fit-content'
              }}
            >
              {hotel.imagen && hotel.imagen.data && hotel.imagen.mimeType ? (
                <img
                  src={`data:${hotel.imagen.mimeType};base64,${hotel.imagen.data}`}
                  alt="Hotel"
                  style={{
                    width: '100%',
                    height: '550px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '550px',
                    bgcolor: 'linear-gradient(135deg, #b3c9ca 0%, #549c94 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                  }}
                >
                  <Hotel sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
                  <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.8 }}>
                    Imagen no disponible
                  </Typography>
                </Box>
              )}
            </Card>
          </Box>
        </Box>

        {/* Botón Ver Habitaciones */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Hotel />}
            onClick={handleViewRooms}
            sx={{ 
              bgcolor: '#549c94',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(84, 156, 148, 0.4)',
              '&:hover': {
                bgcolor: '#0b7583',
                boxShadow: '0 12px 32px rgba(11, 117, 131, 0.5)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Ver Habitaciones Disponibles
          </Button>
        </Box>

        {/* Sección del mapa */}
        <Card 
          sx={{ 
            mt: 3, 
            borderRadius: 2,
            boxShadow: '0 4px 16px rgba(11, 117, 131, 0.1)',
            background: 'rgba(255, 255, 255, 0.98)',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <IconButton 
                sx={{ 
                  bgcolor: '#0b7583', 
                  color: 'white', 
                  mr: 2,
                  size: 'small',
                  '&:hover': { bgcolor: '#549c94' }
                }}
              >
                <LocationOn fontSize="small" />
              </IconButton>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#0b7583',
                  fontSize: '1.1rem'
                }}
              >
                Ubicación del Hotel
              </Typography>
            </Box>
            
            <MapContainer center={[center.lat, center.lng]} zoom={19} style={mapContainerStyle}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='© <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />
              <Marker position={[center.lat, center.lng]} icon={redIcon}>
                <Popup>{hotel.nombrehotel}</Popup>
              </Marker>
            </MapContainer>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Directions />}
                onClick={() => window.open(getGoogleMapsLink(), '_blank')}
                sx={{ 
                  background: 'linear-gradient(135deg, #549c94 0%, #4c94bc 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 6px 20px rgba(84, 156, 148, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4c94bc 0%, #0b7583 100%)',
                    boxShadow: '0 8px 28px rgba(76, 148, 188, 0.5)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Obtener Direcciones
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DetallesHoteles;