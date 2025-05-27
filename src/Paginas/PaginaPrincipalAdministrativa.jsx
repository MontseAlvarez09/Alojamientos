import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Fade,
  Slide,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { Hotel, Group, BarChart, ArrowForward } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4f46e5", // Indigo
    },
    secondary: {
      main: "#10b981", // Emerald
    },
    background: {
      default: "#f9fafb", // Light gray
      paper: "#ffffff", // White
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.75rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

const PaginaPrincipalAdministrativa = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", color: "text.primary", py: 6 }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography variant="h1" gutterBottom>
                Panel Administrativo
              </Typography>
              <Typography variant="body1">
                Gestiona alojamientos, usuarios y reportes desde un solo lugar.
              </Typography>
            </Box>
          </Fade>

          <Slide in timeout={1000} direction="up">
            <Grid container spacing={4}>
              {["Administrar Alojamientos", "Gestionar Usuarios", "Ver Reportes"].map((title, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card elevation={3} sx={{ textAlign: "center", py: 4 }}>
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        {index === 0 && <Hotel color="primary" />}
                        {index === 1 && <Group color="primary" />}
                        {index === 2 && <BarChart color="secondary" />}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Realiza acciones administrativas de forma sencilla.
                      </Typography>
                      <Button
                        variant="contained"
                        color={index === 2 ? "secondary" : "primary"}
                        endIcon={<ArrowForward />}
                        sx={{ mt: 3 }}
                      >
                        {title}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Slide>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PaginaPrincipalAdministrativa;
