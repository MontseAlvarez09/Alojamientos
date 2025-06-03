import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Alert,
  Chip,
  Paper,
  Fade,
} from '@mui/material';
import {
  Hotel,
  CheckCircle,
  Cancel,
  Schedule,
} from '@mui/icons-material';

const CuartosP = ({ idHotel }) => {
  const [cuartos, setCuartos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Paleta de colores
  const colors = {
    primary: '#4c94bc',    // color1
    secondary: '#f3a384',  // color2
    accent: '#0b7583',     // color3
    success: '#549c94',    // color4
    neutral: '#b3c9ca',    // color5
  };

  const styles = {
    container: {
      backgroundColor: '#fafbfc',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem',
    },
    headerSection: {
      backgroundColor: colors.primary,
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(76, 148, 188, 0.2)',
    },
    // Grid container centrado
    gridContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    roomCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e0e6ed',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(76, 148, 188, 0.15)',
        border: `1px solid ${colors.primary}`,
      },
    },
    imageContainer: {
      position: 'relative',
      height: '220px', // Aumentado de 180px
      borderRadius: '12px 12px 0 0',
    },
    noImageBox: {
      height: '220px', // Aumentado de 180px
      backgroundColor: colors.neutral,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px 12px 0 0',
      flexDirection: 'column',
    },
    cardContent: {
      flexGrow: 1,
      padding: '2rem', // Aumentado de 1.5rem
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    roomTitle: {
      color: colors.accent,
      fontWeight: '600',
      fontSize: '1.25rem', // Aumentado de 1.1rem
      marginBottom: '0.5rem', // Reducido para dar espacio al tipo de habitación
      display: 'flex',
      alignItems: 'center',
    },
    roomType: {
      color: '#6c757d',
      fontSize: '1rem',
      fontWeight: '500',
      marginBottom: '1rem',
    },
    statusChip: {
      fontWeight: '600',
      borderRadius: '20px',
      marginBottom: '0.5rem',
      fontSize: '0.9rem', // Chip ligeramente más grande
      padding: '0.5rem 1rem',
    },
    infoBox: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '0.5rem',
      color: '#6c757d',
      fontSize: '1rem', // Texto más grande
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '2px dashed #e0e6ed',
      marginTop: '2rem',
    },
  };

  useEffect(() => {
    fetchCuartos();
  }, [idHotel]);

  const fetchCuartos = async () => {
    try {
      const response = await axios.get(`https://backendd-q0zc.onrender.com/api/cuartos/hotel/${idHotel}`);
      setCuartos(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener cuartos:', error);
      setErrorMessage('Error al cargar los cuartos. Intente de nuevo.');
    }
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

  const handleCardClick = (id) => {
    navigate(`/cliente/detalles-habitacionc/${id}`);
  };

  const getStatusColor = (estado) => {
    const normalizedEstado = estado?.toLowerCase();
    switch (normalizedEstado) {
      case 'disponible':
        return colors.success;
      case 'ocupado':
        return colors.secondary;
      case 'mantenimiento':
        return colors.accent;
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (estado) => {
    const normalizedEstado = estado?.toLowerCase();
    return normalizedEstado === 'disponible' ? <CheckCircle /> : <Cancel />;
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Fade in={true} timeout={600}>
          <Paper sx={styles.headerSection}>
            <Hotel sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>
              Habitaciones Disponibles
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Explora nuestras habitaciones y encuentra la perfecta para ti
            </Typography>
          </Paper>
        </Fade>

        {/* Error Alert */}
        {errorMessage && (
          <Fade in={true}>
            <Box sx={{ mb: 3 }}>
              <Alert 
                severity="error" 
                onClose={() => setErrorMessage('')}
                sx={{ borderRadius: '8px', fontSize: '1rem' }}
              >
                {errorMessage}
              </Alert>
            </Box>
          </Fade>
        )}

        {/* Rooms Grid - Centrado y más grande (3 columnas máximo) */}
        <Grid container spacing={4} sx={styles.gridContainer}>
          {cuartos.map((cuarto, index) => {
            const images = parseImagesSafely(cuarto.imagenes);
            const primaryImage = cuarto.imagenhabitacion || (images.length > 0 ? images[0] : null);
            const normalizedEstado = cuarto.estado?.charAt(0).toUpperCase() + cuarto.estado?.slice(1).toLowerCase();
            const isAvailable = cuarto.estado?.toLowerCase() === 'disponible';

            return (
              <Grid item xs={12} sm={6} md={4} key={cuarto.id}>
                <Fade in={true} timeout={800 + index * 100}>
                  <Card
                    sx={styles.roomCard}
                    onClick={() => handleCardClick(cuarto.id)}
                  >
                    {/* Image Section */}
                    {primaryImage ? (
                      <Box sx={styles.imageContainer}>
                        <CardMedia
                          component="img"
                          height="220"
                          image={`data:image/jpeg;base64,${primaryImage}`}
                          alt={`Imagen de ${cuarto.cuarto}`}
                          sx={{ 
                            objectFit: 'cover', 
                            borderRadius: '12px 12px 0 0',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.02)',
                            }
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={styles.noImageBox}>
                        <Hotel sx={{ fontSize: 50, color: 'white', mb: 1 }} />
                        <Typography 
                          variant="body1" 
                          sx={{ color: 'white', fontStyle: 'italic' }}
                        >
                          Sin imagen disponible
                        </Typography>
                      </Box>
                    )}

                    {/* Content Section */}
                    <CardContent sx={styles.cardContent}>
                      <Box>
                        <Typography variant="h6" sx={styles.roomTitle}>
                          <Hotel sx={{ mr: 1, fontSize: '1.4rem' }} />
                          Habitación {cuarto.cuarto}
                        </Typography>
                        <Typography variant="body1" sx={styles.roomType}>
                          Tipo: {cuarto.tipohabitacion || 'No especificado'}
                        </Typography>

                        <Chip
                          icon={getStatusIcon(cuarto.estado)}
                          label={normalizedEstado || 'Sin estado'}
                          sx={{
                            ...styles.statusChip,
                            bgcolor: getStatusColor(cuarto.estado),
                            color: 'white',
                            mb: 2,
                          }}
                        />
                      </Box>

                      <Box>
                        <Box sx={styles.infoBox}>
                          <Schedule sx={{ mr: 1, fontSize: '1.3rem', color: colors.accent }} />
                          <Typography variant="body1">
                            {cuarto.horario 
                              ? new Date(cuarto.horario).toLocaleDateString()
                              : 'Horario no especificado'
                            }
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>

        {/* Empty State */}
        {cuartos.length === 0 && !errorMessage && (
          <Fade in={true} timeout={1000}>
            <Box sx={styles.emptyState}>
              <Hotel sx={{ fontSize: 60, color: colors.neutral, mb: 2 }} />
              <Typography variant="h6" sx={{ color: colors.accent, fontWeight: '600', mb: 1 }}>
                No hay habitaciones disponibles
              </Typography>
              <Typography variant="body1" sx={{ color: '#6c757d' }}>
                No se encontraron habitaciones para este hotel en este momento.
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default CuartosP;

