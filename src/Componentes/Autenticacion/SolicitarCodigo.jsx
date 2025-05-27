import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// URL base del backend para desarrollo local
const API_BASE_URL = "https://backendd-q0zc.onrender.com";

function SolicitarCodigo() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${API_BASE_URL}/api/codigo/forgot-password`, { email });
            MySwal.fire({
                title: "Código enviado",
                text: "Por favor revisa tu correo electrónico para obtener el código de recuperación.",
                icon: "success",
            });
            navigate('/validar-codigo', { state: { email } });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                MySwal.fire({
                    title: "Correo no registrado",
                    text: "El correo electrónico proporcionado no está registrado en nuestro sistema.",
                    icon: "error",
                });
            } else {
                MySwal.fire({
                    title: "Error",
                    text: "No se pudo enviar el correo de recuperación.",
                    icon: "error",
                });
            }
        }
    };

    const estilos = {
        contenedor: {
            textAlign: 'center',
            backgroundColor: '#ffffff', // mismo fondo que el estilo base
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '400px',
            margin: '40px auto',
            boxShadow: '0 10px 30px rgba(100, 100, 150, 0.15)',
            fontFamily: "'Poppins', sans-serif",
        },
        titulo: {
            fontSize: '22px',
            fontWeight: '800',
            marginBottom: '30px',
            color: '#4b3f72',
            textShadow: '0 2px 5px rgba(75, 63, 114, 0.3)',
            letterSpacing: '0.05em',
        },
        
        campo: {
            marginBottom: '20px',
            textAlign: 'left',
        },
        input: {
            width: '90%', // antes era 100%
            margin: '0 auto', // centra el input horizontalmente
            padding: '12px 16px',
            borderRadius: '12px',
            border: '2px solid #d3d0f7',
            backgroundColor: '#fafaff',
            fontSize: '16px',
            fontWeight: '500',
            color: '#333',
            transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
            outline: 'none',
        },
        
        inputFocus: {
            borderColor: '#7266f0',
            boxShadow: '0 0 8px rgba(114, 102, 240, 0.5)',
        },
        boton: {
            background: 'linear-gradient(90deg, #79ae92, #5f8f7a)',
            color: '#fff',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '14px',
            cursor: 'pointer',
            fontSize: '17px',
            fontWeight: '700',
            boxShadow: '0 6px 15px rgba(121, 174, 146, 0.5)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            width: '100%',
            marginTop: '20px',
        },
        botonHover: {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(121, 174, 146, 0.7)',
        }
    };

    return (
        <div style={estilos.contenedor}>
            <h1 style={estilos.titulo}>Verificación de Correo</h1>
            <form onSubmit={handleSubmit}>
                <div style={estilos.campo}>
                    <input
                        type="email"
                        placeholder="Introduce tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={estilos.input}
                    />
                </div>
                <button type="submit" style={estilos.boton}>Solicitar Código</button>
            </form>
        </div>
    );
}

export default SolicitarCodigo;