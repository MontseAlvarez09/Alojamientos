import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import zxcvbn from 'zxcvbn';
import sha1 from 'js-sha1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const MySwal = withReactContent(Swal);

function CambiarPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [passwordHistoryError, setPasswordHistoryError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se proporcionó un correo electrónico. Por favor, inicia el proceso de cambio de contraseña nuevamente.',
      }).then(() => {
        navigate('/solicitar-cambio'); // Ajusta la ruta según tu flujo
      });
    } else {
      MySwal.fire({
        icon: 'info',
        title: 'Aviso importante',
        text: 'Ingresa la nueva contraseña. Las contraseñas anteriormente utilizadas no se pueden volver a utilizar, ni la actual.',
      });
    }
  }, [email, navigate]);

  const validatePasswordStrength = (password) => {
    const strength = zxcvbn(password);
    setPasswordStrength(strength.score);
    validateCommonPatterns(password);
  };

  const validateCommonPatterns = (password) => {
    const minLength = 8;
    const commonPatterns = ['12345', 'password', 'qwerty', 'abcdef'];
    let errorMessage = '';

    if (password.length < minLength) {
      errorMessage = `La contraseña debe tener al menos ${minLength} caracteres.`;
    }

    for (const pattern of commonPatterns) {
      if (password.includes(pattern)) {
        errorMessage = "Evita usar secuencias comunes como '12345' o 'password'.";
        break;
      }
    }

    setPasswordError(errorMessage);
  };

  const checkPasswordHistory = async (password) => {
    try {
      const response = await axios.post('https://backendiot-h632.onrender.com/api/cambio/check-password-history', {
        email,
        password,
      });

      if (response.data.success === false) {
        setPasswordHistoryError('La contraseña ya se utilizó anteriormente. Prueba con otra.');
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña ya se utilizó anteriormente. Prueba con otra.',
        });
        return false;
      }
      setPasswordHistoryError('');
      return true;
    } catch (error) {
      console.error('Error al verificar el historial de contraseñas:', error);
      setPasswordHistoryError('Error al verificar el historial de contraseñas.');
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al verificar el historial de contraseñas. Intenta de nuevo.',
      });
      return false;
    }
  };

  const checkPasswordCompromised = async (password) => {
    const hash = sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      return response.data.includes(suffix.toUpperCase());
    } catch (error) {
      console.error('Error al verificar la contraseña en HIBP:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.',
      });
      return;
    }

    if (newPassword.length < 6 || newPassword.length > 15) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe tener entre 6 y 15 caracteres.',
      });
      return;
    }

    if (passwordError) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: passwordError,
      });
      return;
    }

    const isCompromised = await checkPasswordCompromised(newPassword);
    if (isCompromised) {
      MySwal.fire({
        icon: 'error',
        title: 'Contraseña comprometida',
        text: 'Esta contraseña ha sido filtrada en brechas de datos. Por favor, elige otra.',
      });
      return;
    }

    // Comentar o eliminar si el endpoint check-password-history no existe
    const isPasswordValid = await checkPasswordHistory(newPassword);
    if (!isPasswordValid) {
      return;
    }

    try {
      const response = await axios.post('https://backendd-q0zc.onrender.com/api/cambio/reset-password', {
        email,
        newPassword,
      });

      if (response.data.success) {
        MySwal.fire({
          icon: 'success',
          title: 'Contraseña cambiada',
          text: 'Tu contraseña ha sido actualizada correctamente.',
        });
        navigate('/login');
      } else {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo cambiar la contraseña. Por favor, intenta de nuevo.',
        });
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al cambiar la contraseña. Por favor, intenta de nuevo.',
      });
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return 'Débil';
      case 2:
        return 'Media';
      case 3:
        return 'Fuerte';
      case 4:
        return 'Muy Fuerte';
      default:
        return '';
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const estilos = {
    contenedor: {
      textAlign: 'center',
      backgroundColor: '#e0f7fa',
      padding: '20px',
      borderRadius: '15px',
      maxWidth: '400px',
      margin: '40px auto',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    titulo: {
      fontSize: '28px',
      marginBottom: '20px',
      color: '#004d40',
    },
    campo: {
      marginBottom: '15px',
      textAlign: 'center',
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '12px 40px 12px 12px',
      borderRadius: '8px',
      border: '1px solid #b2dfdb',
      fontSize: '16px',
      boxSizing: 'border-box',
      height: '50px',
    },
    boton: {
      backgroundColor: '#00796b',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      display: 'block',
      margin: '20px auto 0',
      width: '100%',
    },
    medidor: {
      marginTop: '10px',
      fontWeight: 'bold',
      color: passwordStrength < 2 ? 'red' : passwordStrength < 3 ? 'orange' : 'green',
    },
    errorMensaje: {
      color: 'red',
      fontSize: '14px',
      marginTop: '5px',
    },
    icono: {
      position: 'absolute',
      right: '10px',
      top: '40%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#00796b',
    },
  };

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Cambiar Contraseña</h1>
      <form onSubmit={handleSubmit}>
        <div style={estilos.campo}>
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              validatePasswordStrength(e.target.value);
            }}
            required
            style={estilos.input}
          />
          <FontAwesomeIcon
            icon={showNewPassword ? faEyeSlash : faEye}
            style={estilos.icono}
            onClick={() => togglePasswordVisibility('new')}
          />
          {passwordStrength > 0 && (
            <p style={estilos.medidor}>
              Fuerza de la contraseña: {getPasswordStrengthText(passwordStrength)}
            </p>
          )}
        </div>
        <div style={estilos.campo}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={estilos.input}
          />
          <FontAwesomeIcon
            icon={showConfirmPassword ? faEyeSlash : faEye}
            style={estilos.icono}
            onClick={() => togglePasswordVisibility('confirm')}
          />
        </div>
        {passwordHistoryError && (
          <p style={estilos.errorMensaje}>{passwordHistoryError}</p>
        )}
        <button type="submit" style={estilos.boton}>
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
}

export default CambiarPassword;