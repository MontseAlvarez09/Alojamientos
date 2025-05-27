import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const MySwal = withReactContent(Swal);

// Tema personalizado
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
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
        h4: {
            fontWeight: 600,
            color: "#1976d2",
        },
    },
});

// URL base del backend para desarrollo local
const API_BASE_URL = "https://backendd-q0zc.onrender.com"; // Usar localhost para desarrollo local

function VerificarCorreo() {
    const [verificationCode, setVerificationCode] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!verificationCode) {
            MySwal.fire({
                icon: "error",
                title: "Código requerido",
                text: "Por favor introduce el código de verificación.",
            });
            return;
        }

        try {
            console.log('Enviando solicitud de verificación para el código:', verificationCode);
            const response = await axios.get(`${API_BASE_URL}/api/registro/verify/${verificationCode}`);
            console.log('Respuesta del backend:', response.data);
            MySwal.fire({
                icon: "success",
                title: "Verificación exitosa",
                text: response.data.message, // Mostrará "Correo verificado exitosamente. Tu cuenta ahora está activa."
            }).then(() => {
                navigate("/login"); // Redirección después de cerrar la alerta
            });
        } catch (error) {
            console.error("Error al verificar el código:", error.response ? error.response.data : error.message);
            const errorMessage = error.response?.data?.error || "Ocurrió un error al verificar el código. Por favor, intenta de nuevo.";
            if (errorMessage === "La cuenta ya está verificada. Inicia sesión para continuar.") {
                navigate("/login"); // Redirige al login sin mostrar alerta
            } else {
                MySwal.fire({
                    icon: "error",
                    title: "Error de verificación",
                    text: errorMessage,
                });
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container
                maxWidth="sm"
                sx={{
                    mt: 4,
                    mb: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: "100%",
                        borderRadius: 2,
                        bgcolor: "background.paper",
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Verificar Código
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Código de verificación"
                                placeholder="Introduce tu código"
                                name="verificationCode"
                                value={verificationCode}
                                onChange={handleChange}
                                required
                                inputProps={{
                                    maxLength: 6,
                                }}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ py: 1.5 }}
                        >
                            Verificar
                        </Button>
                    </form>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default VerificarCorreo;