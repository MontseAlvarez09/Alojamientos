import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import zxcvbn from "zxcvbn";
import sha1 from "js-sha1";
import {
    Container,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Box,
    LinearProgress,
    Paper,
    Grid,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Person,
    Email,
    Lock,
    Phone,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const MySwal = withReactContent(Swal);

// Tema personalizado
const theme = createTheme({
    palette: {
        primary: {
            main: "#1e88e5", // Azul más vibrante
            light: "#4dabf5",
            dark: "#005cb2",
        },
        secondary: {
            main: "#4caf50", // Verde
        },
        background: {
            default: "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)", // Fondo con gradiente
        },
        text: {
            primary: "#212121",
            secondary: "#757575",
        },
    },
    typography: {
        fontFamily: "'Poppins', sans-serif",
        h4: {
            fontWeight: 700,
            color: "#1e88e5",
        },
        body2: {
            color: "#757575",
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        "&:hover fieldset": {
                            borderColor: "#1e88e5",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#1e88e5",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: "#757575",
                        "&.Mui-focused": {
                            color: "#1e88e5",
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    padding: "12px 24px", // Ajuste de padding para un tamaño más controlado
                    background: "linear-gradient(90deg, #1e88e5 0%, #4dabf5 100%)",
                    "&:hover": {
                        background: "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                        transform: "scale(1.02)",
                        transition: "all 0.3s ease",
                    },
                },
            },
        },
    },
});

// URL base del backend para desarrollo local
const API_BASE_URL = "https://backendd-q0zc.onrender.com";

function FormularioRegistro() {
    const navigate = useNavigate();
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [formErrors, setFormErrors] = useState({});
    const [passwordError, setPasswordError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        apellidopa: "",
        apellidoma: "",
        telefono: "",
        gmail: "",
        user: "",
        password: "",
    });

    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "password") {
            const strength = zxcvbn(value);
            setPasswordStrength(strength.score);
            validatePassword(value);
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errors = { ...formErrors };

        if (name === "nombre" || name === "apellidopa" || name === "apellidoma") {
            const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{4,16}$/;
            if (!nameRegex.test(value)) {
                errors[name] = "Solo letras entre 4 y 16 caracteres.";
            } else {
                delete errors[name];
            }
        }

        if (name === "telefono") {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(value)) {
                errors[name] = "Contener exactamente 10 dígitos.";
            } else {
                delete errors[name];
            }
        }

        if (name === "user") {
            const usernameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]{4,10}$/;
            if (!usernameRegex.test(value)) {
                errors[name] = "Contener entre 4 y 10 caracteres.";
            } else {
                delete errors[name];
            }
        }

        if (name === "password") {
            const passwordRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,15}$/;
            if (!passwordRegex.test(value)) {
                errors[name] = "Tener entre 8 y 15 caracteres.";
            } else {
                delete errors[name];
            }
        }

        if (name === "gmail") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errors[name] = "Introduce un correo electrónico válido.";
            } else {
                delete errors[name];
            }
        }

        setFormErrors(errors);
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const commonPatterns = ["12345", "password", "qwerty", "abcdef"];
        let errorMessage = "";

        if (password.length < minLength) {
            errorMessage = `La contraseña debe tener al menos ${minLength} caracteres.`;
        }

        for (const pattern of commonPatterns) {
            if (password.toLowerCase().includes(pattern)) {
                errorMessage = "Evita usar secuencias comunes como '12345' o 'password'.";
                MySwal.fire({
                    icon: "error",
                    title: "Contraseña no válida",
                    text: errorMessage,
                });
                break;
            }
        }

        setPasswordError(errorMessage);
    };

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const checkPasswordCompromised = async (password) => {
        const hash = sha1(password);
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);

        try {
            const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
            const compromised = response.data.includes(suffix.toUpperCase());
            return compromised;
        } catch (error) {
            console.error("Error al verificar la contraseña en HIBP:", error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos enviados al backend:', formData);

        const isValidForm = Object.keys(formErrors).length === 0;

        if (!isValidForm || passwordError) {
            MySwal.fire({
                icon: "error",
                title: "Errores en el formulario",
                text: passwordError || "Por favor, corrige los errores antes de continuar.",
            });
            return;
        }

        const isCompromised = await checkPasswordCompromised(formData.password);
        if (isCompromised) {
            MySwal.fire({
                icon: "error",
                title: "Contraseña comprometida",
                text: "Esta contraseña ha sido filtrada en brechas de datos. Por favor, elige otra.",
            });
            return;
        }

        const dataToSend = {
            nombre: formData.nombre,
            apellidopa: formData.apellidopa,
            apellidoma: formData.apellidoma,
            gmail: formData.gmail,
            user: formData.user,
            telefono: formData.telefono,
            password: formData.password,
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/api/registro`, dataToSend);
            console.log('Respuesta del backend:', response.data);
            MySwal.fire({
                title: "Tu registro se realizó correctamente",
                text: "Por favor revisa tu correo para verificar tu cuenta.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            navigate("/verificar-correo");
        } catch (error) {
            console.error("Error al registrar el usuario:", error.response ? error.response.data : error.message);
            if (error.response && error.response.data.error) {
                MySwal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response.data.error,
                });
            } else {
                MySwal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No te pudiste registrar. Por favor, intenta de nuevo.",
                });
            }
        }
    };

    const getPasswordStrengthText = (strength) => {
        switch (strength) {
            case 0:
            case 1:
                return "Débil";
            case 2:
                return "Media";
            case 3:
                return "Fuerte";
            case 4:
                return "Muy Fuerte";
            default:
                return "";
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container
                maxWidth="md"
                sx={{
                    minHeight: "50vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: theme.palette.background.default,
                    p: isMobile ? 2 : 4,
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: isMobile ? 3 : 5,
                        width: "75%",
                        borderRadius: "16px",
                        bgcolor: "#ffffff",
                        boxSizing: "border-box",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Registro
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ mb: 3 }}>
                        Crea una cuenta para comenzar
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu nombre"
                                    required
                                    error={!!formErrors.nombre}
                                    helperText={formErrors.nombre || " "}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Apellido Paterno"
                                    name="apellidopa"
                                    value={formData.apellidopa}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu apellido paterno"
                                    required
                                    error={!!formErrors.apellidopa}
                                    helperText={formErrors.apellidopa || " "}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Apellido Materno"
                                    name="apellidoma"
                                    value={formData.apellidoma}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu apellido materno"
                                    required
                                    error={!!formErrors.apellidoma}
                                    helperText={formErrors.apellidoma || " "}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu teléfono"
                                    required
                                    error={!!formErrors.telefono}
                                    helperText={formErrors.telefono || " "}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone />
                                            </InputAdornment>
                                        ),
                                    }}
                                    inputProps={{
                                        maxLength: 10,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Correo"
                                    name="gmail"
                                    value={formData.gmail}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu correo electrónico"
                                    required
                                    error={!!formErrors.gmail}
                                    helperText={formErrors.gmail || " "}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Usuario"
                                    name="user"
                                    value={formData.user}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu usuario"
                                    required
                                    error={!!formErrors.user}
                                    helperText={formErrors.user || " "}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Crea una contraseña"
                                    required
                                    error={!!formErrors.password}
                                    helperText={formErrors.password || " "}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handlePasswordVisibility}>
                                                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {passwordStrength > 0 && (
                                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(passwordStrength / 4) * 100}
                                            sx={{
                                                flex: 1,
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: "#e0e0e0",
                                                "& .MuiLinearProgress-bar": {
                                                    borderRadius: 4,
                                                    backgroundColor:
                                                        passwordStrength < 2
                                                            ? "#f44336"
                                                            : passwordStrength < 3
                                                            ? "#ff9800"
                                                            : "#4caf50",
                                                },
                                            }}
                                        />
                                        <Typography variant="caption" color="textSecondary">
                                            {getPasswordStrengthText(passwordStrength)}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ maxWidth: "300px", width: "100%" }} // Ancho máximo de 300px con ajuste responsivo
                            >
                                Registrar
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default FormularioRegistro;