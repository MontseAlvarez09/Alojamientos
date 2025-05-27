"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Fade,
  Slide,
  Paper,
} from "@mui/material";
import {
  Place as MapPin,
  ArrowForward as ArrowRight,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { es } from "date-fns/locale";


// Tema personalizado
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    error: {
      main: "#d32f2f",
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
      letterSpacing: "-0.02em",
    },
    body1: {
      fontSize: "1.1rem",
      color: "#4b5e6a",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
          padding: "12px 24px",
          fontWeight: 600,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 24px rgba(25, 118, 210, 0.2)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#fff",
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
          },
        },
      },
      defaultProps: {
        size: "medium",
        variant: "outlined",
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
});

const PaginaPrincipalCliente = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!destination.trim()) newErrors.destination = "El destino es requerido";
    if (!checkIn) newErrors.checkIn = "La fecha de entrada es requerida";
    if (!checkOut) newErrors.checkOut = "La fecha de salida es requerida";
    if (guests < 1) newErrors.guests = "Debe haber al menos 1 huésped";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Buscando hoteles con:", {
        destination,
        checkIn,
        checkOut,
        guests,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Box
          sx={{
            minHeight: "100vh",
            position: "relative",
            backgroundImage: `
              linear-gradient(to bottom, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0)),
              url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c")
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#1e1e1e",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top center, rgba(25, 118, 210, 0.15), transparent 70%)",
              zIndex: 0,
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 8 }}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: "center", py: { xs: 6, md: 10 } }}>
                <Typography
                  variant="h1"
                  sx={{ mb: 3, lineHeight: 1.2 }}
                  aria-label="Encuentra tu hotel ideal"
                >
                  Encuentra tu hotel ideal
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ maxWidth: 700, mx: "auto", mb: 5, fontSize: { xs: "1rem", md: "1.2rem" } }}
                >
                  Descubre alojamientos perfectos para tus vacaciones o viajes de trabajo con facilidad.
                </Typography>

                <Slide in timeout={1000} direction="up">
                  <Paper
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                      maxWidth: 1000,
                      mx: "auto",
                      p: { xs: 2, sm: 3 },
                      backgroundColor: "background.paper",
                    }}
                    role="form"
                    aria-label="Formulario de búsqueda de hoteles"
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          placeholder="¿A dónde vas?"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          label="Destino"
                          InputProps={{ startAdornment: <MapPin sx={{ mr: 1, color: "primary.main" }} /> }}
                          error={!!errors.destination}
                          helperText={errors.destination}
                          aria-describedby="destination-error"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.5}>
                        <DatePicker
                          label="Entrada"
                          value={checkIn}
                          onChange={(newValue) => setCheckIn(newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.checkIn,
                              helperText: errors.checkIn,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.5}>
                        <DatePicker
                          label="Salida"
                          value={checkOut}
                          onChange={(newValue) => setCheckOut(newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.checkOut,
                              helperText: errors.checkOut,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2}>
                        <TextField
                          fullWidth
                          type="number"
                          inputProps={{ min: 1, max: 20 }}
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          label="Huéspedes"
                          error={!!errors.guests}
                          helperText={errors.guests}
                          aria-describedby="guests-error"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={2}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          fullWidth
                          endIcon={<ArrowRight />}
                          sx={{ py: 1.5, fontSize: "1rem" }}
                          aria-label="Buscar hoteles"
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
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default PaginaPrincipalCliente;


