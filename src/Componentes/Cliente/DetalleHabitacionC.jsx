"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  Divider,
  Avatar,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Hotel,
  AccessTime,
  AttachMoney,
  RoomService,
  CheckCircle,
  Cancel,
  Schedule,
  Wifi,
  LocalParking,
  Restaurant,
  FitnessCenter,
  Pool,
  Spa,
} from "@mui/icons-material";

const DetallesHabitacion = () => {
  const { idHabitacion } = useParams();
  const [habitacion, setHabitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState("");

  // Paleta de colores
  const colors = {
    primary: "#4c94bc", // color1
    secondary: "#549c94", // color4
    accent: "#0b7583", // color3
    success: "#549c94", // color4
    neutral: "#b3c9ca", // color5
  };

  const styles = {
    container: {
      backgroundColor: "#fafbfc",
      minHeight: "100vh",
      paddingTop: "2rem",
      paddingBottom: "2rem",
    },
    headerCard: {
      backgroundColor: colors.primary,
      color: "white",
      borderRadius: "12px",
      marginBottom: "2rem",
      boxShadow: "0 4px 20px rgba(76, 148, 188, 0.2)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    imageCard: {
      borderRadius: "8px",
      overflow: "hidden",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      },
    },
    detailsCard: {
      borderRadius: "12px",
      backgroundColor: "white",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      border: "1px solid #e0e6ed",
    },
    priceCard: {
      backgroundColor: colors.secondary,
      borderRadius: "12px",
      padding: "1.5rem",
      marginBottom: "1rem",
      boxShadow: "0 2px 8px rgba(84, 156, 148, 0.2)",
      color: "white",
    },
    reservationCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      border: `2px solid ${colors.neutral}`,
    },
    statusChip: {
      fontSize: "1rem",
      fontWeight: "bold",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
    },
    iconBox: {
      display: "flex",
      alignItems: "center",
      marginBottom: "1rem",
      padding: "1rem",
      borderRadius: "8px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #e9ecef",
    },
    serviceIcon: {
      marginRight: "0.75rem",
      color: colors.accent,
      fontSize: "1.5rem",
    },
    sectionTitle: {
      color: colors.accent,
      fontWeight: "600",
      marginBottom: "1.5rem",
      fontSize: "1.25rem",
    },
  };

  useEffect(() => {
    console.log("ID de la habitación:", idHabitacion);
    fetchHabitacion();
  }, [idHabitacion]);

  const fetchHabitacion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backendd-q0zc.onrender.com/api/cuartos/detalles/${idHabitacion}`
      );
      console.log("Respuesta de la API:", response.data);
      setHabitacion(response.data);
      setError("");
    } catch (err) {
      const errorMessage =
        err.response?.status === 404
          ? "Habitación no encontrada en la base de datos."
          : err.response?.data?.message ||
            "Error al cargar los detalles de la habitación. Intente de nuevo.";
      setError(errorMessage);
      console.error("Error fetching habitacion:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseImagesSafely = (imagenes) => {
    // Si imagenes no existe o es un arreglo vacío, devolver un arreglo vacío
    if (!imagenes || !Array.isArray(imagenes) || imagenes.length === 0) {
      return [];
    }
    // Las imágenes ya son un arreglo de cadenas en base64, no necesitan parseo
    return imagenes;
  };

  const handleReservationTimeChange = (e) => {
    setReservationTime(e.target.value);
  };

  const handleReservation = async () => {
    if (!reservationTime) {
      setError("Por favor, seleccione una hora de reserva.");
      return;
    }

    if (habitacion.estado !== "Disponible") {
      setError("Esta habitación no está disponible para reservar.");
      return;
    }

    try {
      const updatedCuarto = {
        estado: "Ocupado",
        horario: reservationTime,
      };

      const response = await axios.put(
        `https://backendd-q0zc.onrender.com/api/cuartos/${idHabitacion}`,
        updatedCuarto
      );
      setHabitacion(response.data);
      setReservationSuccess("¡Habitación reservada con éxito!");
      setError("");
      setReservationTime("");
    } catch (err) {
      setError("Error al realizar la reserva. Intente de nuevo.");
      console.error("Error al reservar:", err.response?.data || err.message);
    }
  };

  const getServiceIcons = (servicios) => {
    const serviceMap = {
      wifi: <Wifi sx={styles.serviceIcon} />,
      parking: <LocalParking sx={styles.serviceIcon} />,
      restaurant: <Restaurant sx={styles.serviceIcon} />,
      gym: <FitnessCenter sx={styles.serviceIcon} />,
      pool: <Pool sx={styles.serviceIcon} />,
      spa: <Spa sx={styles.serviceIcon} />,
      internet: <Wifi sx={styles.serviceIcon} />, // Añadido para "Internet"
      baño: <RoomService sx={styles.serviceIcon} />, // Añadido para "Baño"
    };

    // Asegurarse de que servicios sea un arreglo y mapearlo
    const serviceList = Array.isArray(servicios) ? servicios : (servicios || "").split(",");
    return serviceList
      .map((service, index) => {
        const trimmedService = service.trim().toLowerCase();
        return (
          <Grid item xs={12} sm={6} key={index}>
            <Box sx={styles.iconBox}>
              {serviceMap[trimmedService] || <RoomService sx={styles.serviceIcon} />}
              <Typography
                variant="body1"
                sx={{ textTransform: "capitalize", fontWeight: "500" }}
              >
                {service.trim()}
              </Typography>
            </Box>
          </Grid>
        );
      });
  };

  if (loading) {
    return (
      <Box sx={styles.container}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ color: colors.primary, mb: 2 }} />
            <Typography variant="h6" sx={{ color: colors.primary }}>
              Cargando detalles de la habitación...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={styles.container}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Fade in={true}>
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ borderRadius: "8px", fontSize: "1.1rem" }}
            >
              {error}
            </Alert>
          </Fade>
        </Container>
      </Box>
    );
  }

  if (!habitacion) {
    return (
      <Box sx={styles.container}>
        <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ color: colors.primary, fontWeight: "600" }}
          >
            Habitación no encontrada
          </Typography>
        </Container>
      </Box>
    );
  }

  const images = parseImagesSafely(habitacion.imagenes);
  const normalizedEstado =
    habitacion.estado.charAt(0).toUpperCase() + habitacion.estado.slice(1).toLowerCase();
  const isAvailable = normalizedEstado === "Disponible";

  return (
    <Box sx={styles.container}>
      <Container maxWidth="lg">
        {/* Header Card */}
        <Fade in={true} timeout={800}>
          <Card sx={styles.headerCard}>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  width: 70,
                  height: 70,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Hotel sx={{ fontSize: 35, color: "white" }} />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: "600", mb: 2 }}>
                Habitación {habitacion.cuarto}
              </Typography>
              <Chip
                icon={isAvailable ? <CheckCircle /> : <Cancel />}
                label={normalizedEstado}
                sx={{
                  ...styles.statusChip,
                  bgcolor: isAvailable ? colors.success : "#dc3545",
                  color: "white",
                }}
              />
            </CardContent>
          </Card>
        </Fade>

        {/* Success Alert */}
        {reservationSuccess && (
          <Zoom in={true}>
            <Box sx={{ mb: 3 }}>
              <Alert
                severity="success"
                onClose={() => setReservationSuccess("")}
                sx={{ borderRadius: "8px", fontSize: "1.1rem" }}
              >
                {reservationSuccess}
              </Alert>
            </Box>
          </Zoom>
        )}

        {/* Image Gallery - 3 columns */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{ ...styles.sectionTitle, textAlign: "center" }}
            >
              Galería de Imágenes
            </Typography>
            <Grid container spacing={2}>
              {images.length > 0 ? (
                images.map((img, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card sx={styles.imageCard}>
                      <CardMedia
                        component="img"
                        height="220"
                        image={
                          img.startsWith("data:image")
                            ? img
                            : `data:image/jpeg;base64,${img}`
                        }
                        alt={`Imagen ${index + 1} de ${habitacion.cuarto}`}
                        sx={{ objectFit: "cover" }}
                        loading="lazy"
                      />
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Card
                    sx={{
                      ...styles.imageCard,
                      height: "220px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      No hay imágenes disponibles
                    </Typography>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Room Details */}
          <Grid item xs={12} md={8}>
            <Fade in={true} timeout={1200}>
              <Card sx={styles.detailsCard}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      ...styles.sectionTitle,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Hotel sx={{ mr: 2 }} />
                    Detalles de la Habitación
                  </Typography>

                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={styles.iconBox}>
                        <AccessTime sx={styles.serviceIcon} />
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "600", color: colors.accent }}
                          >
                            Horario
                          </Typography>
                          <Typography variant="body1" sx={{ color: "#6c757d" }}>
                            {habitacion.horario
                              ? new Date(habitacion.horario).toLocaleString()
                              : "No especificado"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={styles.iconBox}>
                        <Schedule sx={styles.serviceIcon} />
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "600", color: colors.accent }}
                          >
                            Estado
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: isAvailable ? colors.success : "#dc3545",
                              fontWeight: "600",
                            }}
                          >
                            {normalizedEstado}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3, borderColor: colors.neutral }} />

                  <Typography variant="h6" sx={styles.sectionTitle}>
                    Servicios Incluidos
                  </Typography>
                  <Grid container spacing={2}>
                    {habitacion.servicios ? (
                      getServiceIcons(habitacion.servicios)
                    ) : (
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{
                            fontStyle: "italic",
                            textAlign: "center",
                            py: 2,
                          }}
                        >
                          No hay servicios especificados
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Pricing and Reservation */}
          <Grid item xs={12} md={4}>
            <Fade in={true} timeout={1400}>
              <Box>
                {/* Pricing Card */}
                <Paper sx={styles.priceCard}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "600",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    <AttachMoney sx={{ mr: 1 }} />
                    Tarifas
                  </Typography>

                  {[
                    { label: "Por Hora", price: habitacion.tarifas?.preciohora },
                    { label: "Por Día", price: habitacion.tarifas?.preciodia },
                    { label: "Por Noche", price: habitacion.tarifas?.precionoche },
                    { label: "Por Semana", price: habitacion.tarifas?.preciosemana },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "500", color: "rgba(255,255,255,0.9)" }}
                      >
                        {item.label}:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "600", color: "white" }}
                      >
                        {item.price !== null && item.price !== undefined && !isNaN(item.price)
                          ? `$${Number(item.price).toFixed(2)}`
                          : "No definido"}
                      </Typography>
                    </Box>
                  ))}
                </Paper>

                {/* Reservation Card */}
                <Card sx={styles.reservationCard}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.accent,
                      fontWeight: "600",
                      mb: 3,
                      textAlign: "center",
                    }}
                  >
                    Reservar Habitación
                  </Typography>

                  <TextField
                    label="Fecha y Hora de Reserva"
                    type="datetime-local"
                    value={reservationTime}
                    onChange={handleReservationTimeChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary,
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: colors.primary,
                      },
                    }}
                    disabled={!isAvailable}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleReservation}
                    disabled={!isAvailable}
                    sx={{
                      borderRadius: "8px",
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      backgroundColor: isAvailable ? colors.primary : "#6c757d",
                      "&:hover": {
                        backgroundColor: isAvailable ? colors.accent : "#6c757d",
                      },
                      "&:disabled": {
                        backgroundColor: "#6c757d",
                        color: "rgba(255,255,255,0.7)",
                      },
                    }}
                  >
                    {isAvailable ? "Reservar Ahora" : "No Disponible"}
                  </Button>
                </Card>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DetallesHabitacion;