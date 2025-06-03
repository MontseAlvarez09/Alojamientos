import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Azul moderno
    },
    secondary: {
      main: "#4caf50", // Verde
    },
    background: {
      default: "#f5f5f5", // Fondo claro
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h6: {
      fontWeight: 600,
      color: "#1976d2",
    },
    body2: {
      color: "#757575",
    },
  },
});

// URL base del backend
const API_BASE_URL = "https://backendd-q0zc.onrender.com"; // Cambia esto según tu configuración

function VisionPCA() {
  const [visionActiva, setVisionActiva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchVision = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/vision`);
        // Filtrar para obtener solo la visión activa
        const vision = response.data.find(v => v.estado === 'activo');
        setVisionActiva(vision || null);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener la Visión:", err);
        setError("No se pudo cargar la Visión. Intenta de nuevo más tarde.");
        setLoading(false);
      }
    };

    fetchVision();
  }, []);

  if (loading) return <Typography align="center">Cargando Visión...</Typography>;
  if (error) return <Typography align="center" color="error">{error}</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: isMobile ? 2 : 4,
          backgroundColor: theme.palette.background.default,
          borderTop: "1px solid #e0e0e0",
          mt: "auto", // Empuja el footer al final de la página
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" gutterBottom>
            Visión de la Empresa
          </Typography>
          <Divider sx={{ my: 2 }} />
          {!visionActiva ? (
            <Typography align="center" color="text.secondary">
              No hay visión activa disponible.
            </Typography>
          ) : (
            <List>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={visionActiva.titulo}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {visionActiva.contenido}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </List>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default VisionPCA;