import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Container,
  Grid,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material';
import { LocationOn, StarBorder, Star, Visibility, Room } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Paleta de colores personalizada
const colors = {
  primary: '#4c94bc',    // color1 - Azul principal
  accent: '#f3a384',     // color2 - Coral/Naranja
  dark: '#0b7583',       // color3 - Verde azulado oscuro
  secondary: '#549c94',  // color4 - Verde agua
  light: '#b3c9ca',      // color5 - Gris azulado claro
};

const HotelesC = () => {
  const [hoteles, setHoteles] = useState([]);
  const [ratings, setRatings] = useState({});
  const [userLocation, setUserLocation] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHoteles();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    }
  }, []);

  const fetchHoteles = async () => {
    try {
      const response = await axios.get('https://backendd-q0zc.onrender.com/api/hoteles');
      const hotelesData = response.data.map(hotel => {
        let imagenParsed = null;
        try {
          if (hotel.imagen) {
            if (typeof hotel.imagen === 'object' && hotel.imagen.data && hotel.imagen.mimeType) {
              imagenParsed = hotel.imagen;
            } else {
              const parsed = JSON.parse(hotel.imagen);
              if (parsed.data && parsed.mimeType) {
                imagenParsed = { data: parsed.data, mimeType: parsed.mimeType };
              } else {
                imagenParsed = { data: hotel.imagen, mimeType: 'image/jpeg' };
              }
            }
          }
        } catch (error) {
          imagenParsed = { data: hotel.imagen, mimeType: 'image/jpeg' };
        }
        return {
          ...hotel,
          id: hotel.id_hotel,
          imagen: imagenParsed
        };
      });
      setHoteles(hotelesData);
    } catch (error) {
      console.error('Error al obtener hoteles:', error);
    }
  };

  const handleDetailsClick = (hotel) => {
    navigate(`/cliente/detalles-hoteles/${hotel.id}`);
  };

  const handleLocationClick = (hotel) => {
    const hotelLat = parseFloat(hotel.latitud);
    const hotelLng = parseFloat(hotel.longitud);
    let url = '';

    const userLat = userLocation ? userLocation.lat : 19.4326;
    const userLng = userLocation ? userLocation.lng : -99.1332;

    url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${hotelLat},${hotelLng}&travelmode=driving`;

    window.open(url, '_blank');
  };

  const handleImageClick = (hotel) => {
    navigate(`/cliente/cuartosc/${hotel.id}`);
  };

  const handleRatingChange = (hotelId, newValue) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [hotelId]: newValue
    }));
  };

  const mapContainerStyle = {
    height: '500px',
    width: '100%',
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        py: 4,
      }}
    >
      {/* Header Section */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.dark} 100%)`,
            borderRadius: 3,
            p: 3,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 30% 20%, ${colors.accent}20 0%, transparent 50%)`,
            }
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#ffffff',
              fontWeight: 800,
              mb: 1.5,
              fontSize: { xs: '2rem', md: '2.8rem' },
              letterSpacing: 1.2,
              position: 'relative',
              zIndex: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Hoteles Exclusivos
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: colors.light,
              fontWeight: 400,
              position: 'relative',
              zIndex: 1,
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '0.9rem', md: '1.1rem' },
            }}
          >
            Descubre experiencias únicas en nuestros destinos cuidadosamente seleccionados
          </Typography>
        </Paper>
      </Container>

      {/* Hotels Grid - Centrado */}
      <Container maxWidth="xl">
        <Grid container spacing={2.5} justifyContent="center">
          {hoteles.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={hotel.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2.5,
                  overflow: 'hidden',
                  boxShadow: `0 6px 24px rgba(75, 148, 188, 0.12)`,
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  bgcolor: '#ffffff',
                  border: `1px solid ${colors.light}40`,
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 16px 32px rgba(75, 148, 188, 0.2)`,
                    '& .hotel-image': {
                      transform: 'scale(1.08)',
                    },
                    '& .hotel-overlay': {
                      opacity: 1,
                    }
                  },
                }}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={
                      hotel.imagen && hotel.imagen.data && hotel.imagen.mimeType
                        ? `data:${hotel.imagen.mimeType};base64,${hotel.imagen.data}`
                        : 'https://via.placeholder.com/320x180/4c94bc/ffffff?text=Hotel+Premium'
                    }
                    alt={hotel.nombrehotel}
                    onClick={() => handleImageClick(hotel)}
                    className="hotel-image"
                    sx={{
                      cursor: 'pointer',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <Box
                    className="hotel-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(45deg, ${colors.dark}80, ${colors.primary}60)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <IconButton
                      onClick={() => handleImageClick(hotel)}
                      sx={{
                        bgcolor: colors.accent,
                        color: '#ffffff',
                        size: 'small',
                        '&:hover': {
                          bgcolor: colors.accent,
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: colors.dark,
                      mb: 1,
                      fontSize: '1.1rem',
                      lineHeight: 1.2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {hotel.nombrehotel}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Room sx={{ color: colors.secondary, mr: 0.5, fontSize: '0.9rem' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.secondary,
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {hotel.direccion || 'Ubicación premium'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5, borderColor: colors.light }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={`${hotel.numhabitacion} Hab.`}
                      size="small"
                      sx={{
                        bgcolor: colors.secondary,
                        color: '#ffffff',
                        fontWeight: 600,
                        borderRadius: 1.5,
                        fontSize: '0.7rem',
                        height: 24,
                      }}
                    />
                    <Rating
                      name={`rating-${hotel.id}`}
                      value={ratings[hotel.id] || 0}
                      onChange={(event, newValue) => handleRatingChange(hotel.id, newValue)}
                      precision={0.5}
                      size="small"
                      emptyIcon={<StarBorder fontSize="inherit" />}
                      icon={<Star fontSize="inherit" />}
                      sx={{ 
                        color: colors.accent,
                        '& .MuiRating-icon': {
                          fontSize: '1rem',
                        }
                      }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleDetailsClick(hotel)}
                    size="small"
                    sx={{
                      flex: 1,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      py: 0.8,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      bgcolor: colors.primary,
                      '&:hover': {
                        bgcolor: colors.dark,
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Ver Detalles
                  </Button>
                  <Tooltip title="Ver ubicación">
                    <IconButton
                      onClick={() => handleLocationClick(hotel)}
                      size="small"
                      sx={{
                        bgcolor: colors.light,
                        color: colors.dark,
                        '&:hover': {
                          bgcolor: colors.secondary,
                          color: '#ffffff',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <LocationOn fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HotelesC;