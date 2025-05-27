"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  IconButton,
  Skeleton,
  Fade,
  Slide,
  Modal,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  InputAdornment,
  Tabs,
  Tab,
  Tooltip,
  Badge,
  Stack,
} from "@mui/material";
import {
  Place as MapPin,
  Hotel as Bed,
  Wifi,
  LocalParking,
  Restaurant,
  FitnessCenter,
  Pool,
  ArrowForward as ArrowRight,
  Favorite,
  FavoriteBorder,
  LocationOn,
  Email,
  Phone,
  Star,
  Close,
  Search,
  CalendarMonth,
  Person,
  AcUnit,
  Tv,
  RoomService,
  Bathtub,
  Balcony,
  Pets,
  CheckCircle,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  LocalCafe,
  BeachAccess,
  Spa,
  Flight,
  DirectionsCar,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Tema personalizado con colores para plataforma de reservas
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0000", // Verde turquesa - transmite confianza y relajación
      light: "#48a999",
      dark: "#004c40",
      contrastText: "#00000",
    },
    secondary: {
      main: "#ff8a65", // Coral cálido - transmite calidez y hospitalidad
      light: "#ffbb93",
      dark: "#c75b39",
      contrastText: "#0000",
    },
    background: {
      default: "#f5f7f9",
      paper: "#ffffff",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    info: {
      main: "#29b6f6",
    },
    warning: {
      main: "#ffa726",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Inter', system-ui, -apple-system, sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
          boxShadow: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg,rgb(255, 255, 255) 30%,rgb(255, 255, 255) 90%)",
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #c75b39 30%, #ff8a65 90%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transform: "translateY(-4px)",
          },
          overflow: "hidden",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            transition: "all 0.2s",
            "&:hover": {
              boxShadow: "0 0 0 4px rgba(0, 121, 107, 0.1)",
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 4px rgba(0, 121, 107, 0.2)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: "8px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
  },
});

// Componente Modal para detalles del hotel
const HotelDetailModal = ({ open, handleClose, hotel }) => {
  if (!hotel) return null;

  const getImageSrc = (imagen) => {
    if (!imagen) return "/placeholder.svg?height=400&width=600";
    try {
      const imageData = JSON.parse(imagen);
      return `data:${imageData.mimeType};base64,${imageData.data}`;
    } catch {
      return "/placeholder.svg?height=400&width=600";
    }
  };

  const getServiceIcons = (servicios) => {
    if (!servicios) return [];
    const serviciosList = [];
    const serviciosLower = servicios.toLowerCase();

    if (serviciosLower.includes("wifi"))
      serviciosList.push({ icon: <Wifi />, name: "WiFi Gratis" });
    if (serviciosLower.includes("parking") || serviciosLower.includes("estacionamiento"))
      serviciosList.push({ icon: <LocalParking />, name: "Estacionamiento" });
    if (serviciosLower.includes("restaurante") || serviciosLower.includes("comida"))
      serviciosList.push({ icon: <Restaurant />, name: "Restaurante" });
    if (serviciosLower.includes("gimnasio") || serviciosLower.includes("fitness"))
      serviciosList.push({ icon: <FitnessCenter />, name: "Gimnasio" });
    if (serviciosLower.includes("piscina") || serviciosLower.includes("alberca"))
      serviciosList.push({ icon: <Pool />, name: "Piscina" });
    if (serviciosLower.includes("aire") || serviciosLower.includes("acondicionado"))
      serviciosList.push({ icon: <AcUnit />, name: "Aire Acondicionado" });
    if (serviciosLower.includes("tv") || serviciosLower.includes("televisión"))
      serviciosList.push({ icon: <Tv />, name: "TV" });
    if (serviciosLower.includes("servicio") || serviciosLower.includes("habitación"))
      serviciosList.push({ icon: <RoomService />, name: "Servicio a la Habitación" });
    if (serviciosLower.includes("baño") || serviciosLower.includes("tina"))
      serviciosList.push({ icon: <Bathtub />, name: "Baño Privado" });
    if (serviciosLower.includes("balcón") || serviciosLower.includes("terraza"))
      serviciosList.push({ icon: <Balcony />, name: "Balcón" });
    if (serviciosLower.includes("mascota") || serviciosLower.includes("pet"))
      serviciosList.push({ icon: <Pets />, name: "Pet Friendly" });
    if (serviciosLower.includes("desayuno") || serviciosLower.includes("breakfast"))
      serviciosList.push({ icon: <LocalCafe />, name: "Desayuno Incluido" });

    return serviciosList;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="hotel-detail-modal"
      closeAfterTransition
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "70%" },
            maxWidth: 900,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="300"
              image={getImageSrc(hotel.imagen)}
              alt={hotel.nombrehotel}
              sx={{ objectFit: "cover" }}
            />
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": { bgcolor: "white" },
              }}
            >
              <Close />
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                color: "white",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {hotel.nombrehotel}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <LocationOn sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="body1">
                  {hotel.direccion || "Ubicación no especificada"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 3, maxHeight: "calc(90vh - 300px)", overflow: "auto" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Acerca de este alojamiento
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                  {hotel.descripcion ||
                    "Este elegante hotel ofrece una experiencia única con instalaciones modernas y un servicio excepcional. Disfrute de una estancia confortable en un ambiente acogedor, ideal tanto para viajes de negocios como de placer."}
                </Typography>

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Servicios y Comodidades
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {getServiceIcons(hotel.servicios).map((servicio, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          bgcolor: "rgba(0, 121, 107, 0.05)",
                          border: "1px solid rgba(0, 121, 107, 0.1)",
                        }}
                      >
                        <Box sx={{ color: "primary.main", mr: 1 }}>{servicio.icon}</Box>
                        <Typography variant="body2" fontWeight={500}>{servicio.name}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Disponibilidad
                </Typography>
                <Box sx={{ mb: 3, p: 2, bgcolor: "rgba(76, 175, 80, 0.05)", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Bed sx={{ mr: 1, color: "success.main" }} />
                    <Typography variant="body1" fontWeight={500}>
                      {hotel.numhabitacion} habitaciones disponibles
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Reserve ahora para asegurar su estadía en este popular destino.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Información de Contacto
                  </Typography>
                  <List dense disablePadding>
                    {hotel.telefono && (
                      <ListItem disablePadding sx={{ mb: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Phone fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={hotel.telefono}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    )}
                    {hotel.correo && (
                      <ListItem disablePadding sx={{ mb: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Email fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={hotel.correo}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    )}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Califica este hotel
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating
                      value={0}
                      precision={0.5}
                      size="large"
                      onChange={(event, newValue) => {
                        console.log('Nueva calificación:', newValue);
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Reservar Ahora
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

const PaginaPrincipal = () => {
  // Simulamos la función navigate para evitar errores
  const navigate = (path) => {
    console.log(`Navegando a: ${path}`);
    // Aquí puedes implementar tu lógica de navegación
    // Por ejemplo: window.location.href = path;
  };

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [hoteles, setHoteles] = useState([]);
  const [cuartos, setCuartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelesRes, cuartosRes] = await Promise.all([
        fetch("https://backendd-q0zc.onrender.com/api/hoteles"),
        fetch("https://backendd-q0zc.onrender.com/api/cuartos"),
      ]);

      const hotelesData = await hotelesRes.json();
      const cuartosData = await cuartosRes.json();

      setHoteles(hotelesData.slice(0, 6));
      setCuartos(cuartosData.slice(0, 8));
    } catch (error) {
      console.error("Error fetching data:", error);
      // Establecer datos de ejemplo en caso de error
      setHoteles([]);
      setCuartos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", { destination, checkIn, checkOut, guests });
  };

  const toggleFavorite = (id, type) => {
    const key = `${type}-${id}`;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(key)) {
      newFavorites.delete(key);
    } else {
      newFavorites.add(key);
    }
    setFavorites(newFavorites);
  };

  const handleOpenModal = (hotel) => {
    setSelectedHotel(hotel);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCardClick = (id) => {
    navigate(`/detalles-habitacion/${id}`);
  };

  const getImageSrc = (imagen) => {
    if (!imagen) return "/placeholder.svg?height=200&width=300";
    try {
      const imageData = JSON.parse(imagen);
      return `data:${imageData.mimeType};base64,${imageData.data}`;
    } catch {
      return "/placeholder.svg?height=200&width=300";
    }
  };

  const getCuartoImages = (imagenes) => {
    if (!imagenes) return "/placeholder.svg?height=200&width=300";
    try {
      const imageArray = JSON.parse(imagenes);
      if (imageArray.length > 0) {
        return `data:image/jpeg;base64,${imageArray[0]}`;
      }
    } catch {
      return "/placeholder.svg?height=200&width=300";
    }
    return "/placeholder.svg?height=200&width=300";
  };

  const getServiceIcons = (servicios) => {
    if (!servicios) return [];
    const icons = [];
    const serviciosLower = servicios.toLowerCase();

    if (serviciosLower.includes("wifi")) icons.push(<Wifi key="wifi" />);
    if (serviciosLower.includes("parking") || serviciosLower.includes("estacionamiento"))
      icons.push(<LocalParking key="parking" />);
    if (serviciosLower.includes("restaurante") || serviciosLower.includes("comida"))
      icons.push(<Restaurant key="restaurant" />);
    if (serviciosLower.includes("gimnasio") || serviciosLower.includes("fitness"))
      icons.push(<FitnessCenter key="gym" />);
    if (serviciosLower.includes("piscina") || serviciosLower.includes("alberca"))
      icons.push(<Pool key="pool" />);

    return icons.slice(0, 3);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === hoteles.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? hoteles.length - 1 : prev - 1));
  };

  // Componente de animación simple para reemplazar framer-motion
  const AnimatedBox = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <Box
        sx={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
        }}
      >
        {children}
      </Box>
    );
  };

  // Categorías de viaje para la sección de categoría

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          backgroundImage: `
            linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255)),
            url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Hero Section Mejorado */}
        <Box
          sx={{
            position: "relative",
            minHeight: "85vh",
            display: "flex",
            alignItems: "center",
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.24), rgb(255, 255, 255)),
              url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            borderRadius: { md: "0 0 50px 50px" },
            overflow: "hidden",
          }}
        >
          {/* Elementos decorativos */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 15%)",
              zIndex: 1,
            }}
          />

          {/* Formas decorativas */}
          <Box
            sx={{
              position: "absolute",
              bottom: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              zIndex: 0,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: -50,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              zIndex: 0,
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
            <Fade in timeout={800}>
              <Box sx={{ textAlign: "center", py: { xs: 6, md: 10 } }}>
                <AnimatedBox>
                  <Typography
                    variant="h1"
                    sx={{
                      mb: 3,
                      fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                      background: "linear-gradient(90deg,rgb(4, 4, 4),rgb(0, 0, 0))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Encuentra Tu Refugio Perfecto
                  </Typography>
                </AnimatedBox>

                <AnimatedBox delay={200}>
                  <Typography
                    variant="h5"
                    sx={{
                      maxWidth: 700,
                      mx: "auto",
                      mb: 6,
                      opacity: 0.95,
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    Descubre alojamientos únicos y experiencias inolvidables para tu próxima aventura
                  </Typography>
                </AnimatedBox>

                {/* Formulario de búsqueda premium */}
                <Slide in timeout={1000} direction="up">
                  <Paper
                    component="form"
                    onSubmit={handleSearch}
                    elevation={10}
                    sx={{
                      maxWidth: 1000,
                      mx: "auto",
                      p: { xs: 2, sm: 3, md: 4 },
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      backdropFilter: "blur(20px)",
                      borderRadius: 4,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          placeholder="¿A dónde quieres ir?"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          label="Destino"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search sx={{ color: "primary.main" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ backgroundColor: "white" }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2.5}>
                        <TextField
                          fullWidth
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          label="Check-in"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarMonth sx={{ color: "primary.main" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ backgroundColor: "white" }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2.5}>
                        <TextField
                          fullWidth
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          label="Check-out"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarMonth sx={{ color: "primary.main" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ backgroundColor: "white" }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <TextField
                          fullWidth
                          type="number"
                          inputProps={{ min: 1 }}
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          label="Huéspedes"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: "primary.main" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ backgroundColor: "white" }}
                        />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          fullWidth
                          size="large"
                          endIcon={<ArrowRight />}
                          sx={{
                            py: 1.8,
                            fontWeight: 600,
                            boxShadow: "0 10px 15px -3px rgba(255, 138, 101, 0.3)",
                          }}
                        >
                          Buscar
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Slide>
              </Box>
            </Fade>
          </Container>
        </Box>
        {/* Destinos Destacados - Usando datos de la base de datos */}
        {hoteles.length > 0 && (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.dark" }}>
                Destinos Destacados
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={prevSlide}
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    "&:hover": { bgcolor: "background.paper", transform: "scale(1.05)" }
                  }}
                >
                  <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                  onClick={nextSlide}
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    "&:hover": { bgcolor: "background.paper", transform: "scale(1.05)" }
                  }}
                >
                  <KeyboardArrowRight />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ position: "relative", overflow: "hidden", borderRadius: 4, height: 300 }}>
              {hoteles.map((hotel, index) => (
                <Box
                  key={hotel.id_hotel}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: index === currentSlide ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${getImageSrc(hotel.imagen)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    color: "white",
                    borderRadius: 4,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                    {hotel.nombrehotel}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 3, textShadow: "0 2px 4px rgba(0,0,0,0.5)", opacity: 0.9 }}>
                    {hotel.direccion}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      px: 4,
                      py: 1.2,
                      fontWeight: 600,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                      borderRadius: 8,
                    }}
                    onClick={() => handleOpenModal(hotel)}
                  >
                    Ver Detalles
                  </Button>
                </Box>
              ))}
            </Box>
          </Container>
        )}

        {/* Sección de Hoteles Destacados */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip
              label="ALOJAMIENTOS PREMIUM"
              color="primary"
              size="small"
              sx={{ mb: 2, fontWeight: 600, px: 1 }}
            />
            <Typography variant="h3" sx={{ mb: 2, color: "primary.dark", fontWeight: 700 }}>
              Hoteles Destacados
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 400, maxWidth: 700, mx: "auto" }}>
              Descubre los mejores hoteles seleccionados especialmente para ti
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Card sx={{ maxWidth: 350, mx: "auto" }}>
                    <Skeleton variant="rectangular" height={180} />
                    <CardContent>
                      <Skeleton variant="text" height={28} />
                      <Skeleton variant="text" height={20} />
                      <Skeleton variant="text" height={20} width="60%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
              : hoteles.map((hotel) => (
                <Grid item xs={12} sm={6} lg={4} key={hotel.id_hotel}>
                  <Card sx={{ maxWidth: 350, mx: "auto", height: "100%" }}>
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height={180}
                        image={getImageSrc(hotel.imagen)}
                        alt={hotel.nombrehotel}
                        sx={{
                          transition: "transform 0.5s",
                          "&:hover": { transform: "scale(1.05)" }
                        }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "&:hover": { backgroundColor: "white", transform: "scale(1.1)" },
                          transition: "transform 0.2s",
                          zIndex: 2,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(hotel.id_hotel, "hotel");
                        }}
                      >
                        {favorites.has(`hotel-${hotel.id_hotel}`) ?
                          <Favorite color="error" /> :
                          <FavoriteBorder />
                        }
                      </IconButton>
                      <Chip
                        label="Hotel"
                        color="primary"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          fontWeight: 600,
                          zIndex: 2,
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: "1.1rem" }}>
                        {hotel.nombrehotel}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                          {hotel.direccion || "Ubicación no especificada"}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Rating
                          value={0}
                          precision={0.5}
                          size="small"
                          onChange={(event, newValue) => {
                            console.log('Nueva calificación para hotel:', hotel.id_hotel, newValue);
                          }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, color: "text.secondary", fontSize: "0.75rem" }}>
                          Califica este hotel
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: "36px",
                          fontSize: "0.85rem"
                        }}
                      >
                        {hotel.descripcion || "Hotel con excelentes servicios y comodidades"}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Bed sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                          {hotel.numhabitacion} habitaciones disponibles
                        </Typography>
                      </Box>

                      {hotel.servicios && (
                        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                          {getServiceIcons(hotel.servicios).map((icon, index) => (
                            <Tooltip
                              key={index}
                              title={
                                index === 0 ? "WiFi" :
                                  index === 1 ? "Estacionamiento" :
                                    index === 2 ? "Restaurante" : ""
                              }
                            >
                              <Box sx={{
                                color: "primary.main",
                                bgcolor: "rgba(0, 121, 107, 0.1)",
                                p: 0.5,
                                borderRadius: 1,
                                fontSize: "0.9rem"
                              }}>
                                {icon}
                              </Box>
                            </Tooltip>
                          ))}
                        </Box>
                      )}

                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        sx={{
                          mt: "auto",
                          py: 1
                        }}
                        onClick={() => handleOpenModal(hotel)}
                      >
                        Ver Detalles
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>

        {/* Sección de Departamentos/Cuartos */}
        {/* Sección de Departamentos/Cuartos */}
        <Box sx={{ backgroundColor: "rgba(0, 121, 107, 0.03)", py: 8, borderRadius: { md: "50px 50px 0 0" } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Chip
                label="ESPACIOS ÚNICOS"
                color="secondary"
                size="small"
                sx={{ mb: 2, fontWeight: 600, px: 1 }}
              />
              <Typography variant="h3" sx={{ mb: 2, color: "primary.dark", fontWeight: 700 }}>
                Departamentos y Habitaciones
              </Typography>
              <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 400, maxWidth: 700, mx: "auto" }}>
                Espacios únicos y cómodos para tu estadía perfecta
              </Typography>
            </Box>

            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              centered
              sx={{
                mb: 4,
                "& .MuiTabs-indicator": {
                  backgroundColor: "secondary.main",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  minWidth: 120,
                },
              }}
            >
              <Tab label="Todos" />
              <Tab label="Disponibles" />
              <Tab label="Más Valorados" />
            </Tabs>

            <Grid container spacing={3}>
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Card sx={{ maxWidth: 350, mx: "auto" }}>
                      <Skeleton variant="rectangular" height={180} />
                      <CardContent>
                        <Skeleton variant="text" height={28} />
                        <Skeleton variant="text" height={20} />
                        <Skeleton variant="text" height={20} width="60%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
                : cuartos.map((cuarto) => (
                  <Grid item xs={12} sm={6} lg={4} key={cuarto.id}>
                    <Card sx={{ maxWidth: 350, mx: "auto", height: "100%" }}>
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height={180}
                          image={getCuartoImages(cuarto.imagenes)}
                          alt={cuarto.cuarto}
                          sx={{
                            transition: "transform 0.5s",
                            "&:hover": { transform: "scale(1.05)" }
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            "&:hover": { backgroundColor: "white", transform: "scale(1.1)" },
                            transition: "transform 0.2s",
                            zIndex: 2,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(cuarto.id, "cuarto");
                          }}
                        >
                          {favorites.has(`cuarto-${cuarto.id}`) ?
                            <Favorite color="error" /> :
                            <FavoriteBorder />
                          }
                        </IconButton>
                        <Chip
                          label={cuarto.estado === "Disponible" ? "Disponible" : "No Disponible"}
                          color={cuarto.estado === "Disponible" ? "success" : "error"}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            fontWeight: 600,
                            zIndex: 2,
                          }}
                        />
                        {cuarto.estado === "Disponible" && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              borderRadius: 1,
                              px: 1,
                              py: 0.5,
                              display: "flex",
                              alignItems: "center",
                              zIndex: 2,
                            }}
                          >
                            <CheckCircle sx={{ fontSize: 14, color: "success.main", mr: 0.5 }} />
                            <Typography variant="caption" fontWeight="bold" color="success.main" sx={{ fontSize: "0.7rem" }}>
                              Verificado
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: "1.1rem" }}>
                          {cuarto.cuarto}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <LocationOn sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                            {cuarto.direccion || "Ubicación no especificada"}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Rating
                            value={0}
                            precision={0.5}
                            size="small"
                            onChange={(event, newValue) => {
                              console.log('Nueva calificación para cuarto:', cuarto.id, newValue);
                            }}
                          />
                          <Typography variant="body2" sx={{ ml: 1, color: "text.secondary", fontSize: "0.75rem" }}>
                            Califica este hotel
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: "36px",
                            fontSize: "0.85rem"
                          }}
                        >
                          {cuarto.descripcion || "Espacio cómodo y moderno para tu estancia"}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Bed sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                            {cuarto.numhabitacion || "1"} habitación disponible
                          </Typography>
                        </Box>

                        {cuarto.servicios && (
                          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                            {getServiceIcons(cuarto.servicios).map((icon, index) => (
                              <Tooltip
                                key={index}
                                title={
                                  index === 0 ? "WiFi" :
                                    index === 1 ? "Estacionamiento" :
                                      index === 2 ? "Restaurante" : ""
                                }
                              >
                                <Box sx={{
                                  color: "primary.main",
                                  bgcolor: "rgba(0, 121, 107, 0.1)",
                                  p: 0.5,
                                  borderRadius: 1,
                                  fontSize: "0.9rem"
                                }}>
                                  {icon}
                                </Box>
                              </Tooltip>
                            ))}
                          </Box>
                        )}

                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            color: "primary.main",
                            mb: 1,
                            fontSize: "1.1rem",
                          }}
                        >
                          ${cuarto.preciodia || "100"}
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 400,
                              color: "text.secondary",
                              fontSize: "0.8rem",
                              ml: 0.5,
                            }}
                          >
                            /día
                          </Typography>
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.75rem" }}>
                          Horario: {cuarto.horario || "2025-05-23T09:00:00Z - 2025-05-23T18:00:00Z"}
                        </Typography>

                        <Button
                          variant="contained"
                          fullWidth
                          size="small"
                          sx={{
                            mt: "auto",
                            py: 1
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(cuarto.id);
                          }}
                        >
                          Ver Más
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Modal para detalles del hotel */}
      <HotelDetailModal
        open={modalOpen}
        handleClose={handleCloseModal}
        hotel={selectedHotel}
      />
    </ThemeProvider>
  );
};

export default PaginaPrincipal;