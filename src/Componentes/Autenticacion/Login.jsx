import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from './AuthContext'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';  

const MySwal = withReactContent(Swal);
//http://localhost:3000
//https://backendd-q0zc.onrender.com
// URL base del backend para desarrollo local
const API_BASE_URL = "https://backendd-q0zc.onrender.com";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(`${API_BASE_URL}/api/login`, {
            user: username,
            password: password,
        });

        const { message, tipo, user: userData } = response.data;

        if (message === 'Inicio de sesión exitoso') {
            login(username, tipo, userData);  
            const ruta = tipo === 'Administrador' ? '/admin' : '/cliente';
            navigate(ruta); 
            MySwal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Inicio de sesión exitoso',
            });
        }
    } catch (error) {
      if (error.response) {
        const { error: serverError } = error.response.data;

        if (serverError === 'Usuario no encontrado') {
          MySwal.fire({
            icon: 'error',
            title: 'Usuario No Encontrado',
            text: 'El usuario ingresado no existe.',
          });
        } else if (serverError === 'La cuenta no está verificada. Por favor, revisa tu correo para activar tu cuenta.') {
          MySwal.fire({
            icon: 'warning',
            title: 'Cuenta No Verificada',
            text: serverError,
          });
        } else if (serverError === 'Tu cuenta está permanentemente bloqueada. Por favor, contacta con el administrador.') {
          MySwal.fire({
            icon: 'error',
            title: 'Cuenta Bloqueada Permanentemente',
            text: serverError,
          });
        } else if (serverError === 'Usuario o contraseña incorrecta') {
          MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: serverError,
          });
        }
      } else {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al iniciar sesión. Inténtalo de nuevo más tarde.',
        });
      }
    }
  };

  const estilos = {
    contenedorPrincipal: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '20px',
    },
    contenedorLogin: {
      backgroundColor: 'rgba(250, 249, 249, 0.88)',
      borderRadius: '15px',
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      maxWidth: '400px',
      width: '100%',
      padding: '30px',
      flexDirection: 'column',
    },
    contenedorFormulario: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    titulo: {
      fontSize: '28px',
      marginBottom: '20px',
      color: '#000000',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    campo: {
      marginBottom: '15px',
    },
    etiqueta: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '600',
      color: '#000000',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    boton: {
      backgroundColor: '#1E3A5F',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    enlace: {
      display: 'block',
      marginTop: '12px',
      textDecoration: 'none',
      color: '#1E3A5F',
      fontSize: '14px',
      textAlign: 'center',
    },
    error: {
      color: 'red',
    },
    temporizador: {
      color: 'red',
      marginTop: '10px',
      textAlign: 'center',
    },
    icono: {
      position: 'absolute',
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#666',
    },
  };

  return (
    <div style={estilos.contenedorPrincipal}>
      <div style={estilos.contenedorLogin}>
        <div style={estilos.contenedorFormulario}>
          <h2 style={estilos.titulo}>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}>Usuario:</label>
              <input
                type="text"
                style={estilos.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}>Contraseña:</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={estilos.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  style={estilos.icono}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
            <button type="submit" style={estilos.boton}>
              Iniciar Sesión
            </button>
            <Link to="/verificar_correo" style={estilos.enlace}>¿Olvidaste la contraseña?</Link>
            <Link to="/registro" style={estilos.enlace}>Regístrate</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;