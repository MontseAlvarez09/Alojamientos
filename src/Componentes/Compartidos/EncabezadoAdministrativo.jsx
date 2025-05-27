import React, { useState, useRef, useEffect } from 'react';
import { AppstoreOutlined, LogoutOutlined, HomeOutlined, FileTextOutlined, TeamOutlined, ShopOutlined,ApartmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EncabezadoAdministrativo = () => {
  const [active, setActive] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get('https://backendd-q0zc.onrender.com/api/perfilF');
        const data = response.data;

        console.log('Datos recibidos del backend:', data); // Depuración

        setNombreEmpresa(data.NombreEmpresa || 'Nombre no disponible');
        setLogoUrl(data.Logo ? `data:image/jpeg;base64,${data.Logo}` : '');
      } catch (error) {
        console.error('Error al obtener datos del perfil:', error);
      }
    };

    fetchPerfil();
  }, []);

  const handleClick = (option) => {
    setActive(option);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case "politicas":
        navigate('/admin/politicas');
        break;
      case "home":
        navigate('/admin/');
        break;
      case "terminos":
        navigate('/admin/terminos');
        break;
      case "perfil":
        navigate('/admin/perfil');
        break;
      case "mision":
        navigate('/admin/mision');
        break;
      case "vision":
        navigate('/admin/vision');
        break;
      case "altapropiedades":
        navigate('/admin/hoteles');
        break;
      case "cuartos":
        navigate('/admin/cuartos');
        break;
      case "Departamentos":
        navigate('/admin/departamentos');
        break;
      case "cerrarSesion":
        handleLogout();
        break;
      default:
        console.log("No se reconoce la acción del menú");
    }
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/');
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --color-primary: #000000;
          --color-secondary: #FFFFFF;
          --color-highlight: #4682B4;
          --color-hover: #A9DFBF;
          --color-mobile-bg: #000000;
          --color-mobile-text: #FFFFFF;
          --color-icon: #00B300;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 15px;
          background-color: #2d3e57;
          color: var(--color-secondary);
          position: relative;
          flex-wrap: wrap;
        }

        .logo {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .logo img {
          width: 60px;
          height: 10px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .logo h1 {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--color-secondary);
        }

        .menu {
          flex: 2;
          display: flex;
          justify-content: flex-end;
        }

        .menu ul {
          display: flex;
          gap: 15px;
          list-style-type: none;
          margin: 0;
          padding: 0;
        }

        .menu ul li {
          font-size: 1rem;
          cursor: pointer;
          padding: 8px 12px;
          color: var(--color-secondary);
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .menu ul li:hover {
          background-color: var(--color-hover);
          border-radius: 5px;
        }

        .menu ul li.active {
          background-color: var(--color-highlight);
          border-radius: 5px;
        }

        .menu ul .dropdown-menu {
          display: ${openDropdown ? 'block' : 'none'};
          position: absolute;
          left: 0;
          top: 100%;
          background-color: var(--color-primary);
          list-style: none;
          padding: 12px;
          margin-top: 10px;
          border-radius: 5px;
          z-index: 10;
        }

        .menu ul .dropdown-menu li {
          padding: 8.5px 12px;
          cursor: pointer;
          color: var(--color-secondary);
        }

        .mobile-menu-icon {
          display: none;
          cursor: pointer;
          flex-direction: column;
          gap: 4px;
        }

        .hamburger {
          width: 25px;
          height: 3px;
          background-color: var(--color-secondary);
          transition: background-color 0.3s ease;
        }

        @media (max-width: 768px) {
          .menu ul {
            display: none;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            width: 70%;
            height: 100%;
            background-color: var(--color-mobile-bg);
            padding: 20px;
            transition: left 0.3s ease-in-out;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
            z-index: 999;
          }

          .menu.menu-open ul {
            display: flex;
            left: 0;
          }

          .menu ul li {
            padding: 20px;
            border-bottom: 1px solid var(--color-hover);
            text-align: right;
            color: var(--color-mobile-text);
          }

          .mobile-menu-icon {
            display: flex;
          }
        }
      `}</style>

      <header className="header">
        <div className="logo">
          {logoUrl && (
            <img src={logoUrl} alt="Logo de la Empresa" style={{ height: '50px', width: '50px', marginRight: '10px' }} />
          )}
          <h3>{nombreEmpresa}</h3>
        </div>
        <nav className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
          <ul>
            <li onClick={() => handleMenuClick('home')}>
              <HomeOutlined style={{ color: 'pink', marginRight: '8px' }} />
              Home
            </li>
            <li className="dropdown" onClick={() => toggleDropdown('empresa')}>
              <span>
                <FileTextOutlined style={{ color: 'orange', marginRight: '8px' }} />
                Datos de la Empresa
              </span>
              {openDropdown === 'empresa' && (
                <ul className="dropdown-menu">
                  <li onClick={() => { handleClick('perfil'); handleMenuClick('perfil'); }}>Perfil</li>
                  <li onClick={() => { handleClick('terminos'); handleMenuClick('terminos'); }}>Términos</li>
                  <li onClick={() => { handleClick('politicas'); handleMenuClick('politicas'); }}>Políticas</li>
                  <li onClick={() => { handleClick('mision'); handleMenuClick('mision'); }}>Misión</li>
                  <li onClick={() => { handleClick('vision'); handleMenuClick('vision'); }}>Visión</li>
                </ul>
              )}
            </li>
            <li className="dropdown" onClick={() => toggleDropdown('altapropiedadess')}>
              <span>
                <ShopOutlined style={{ color: '#00B300', marginRight: '8px' }} />
                Alta Propiedades
              </span>
              {openDropdown === 'altapropiedadess' && (
                <ul className="dropdown-menu">
                  <li onClick={() => { handleClick('altapropiedades'); handleMenuClick('altapropiedades'); }}>Hotel</li>
                  <li onClick={() => { handleClick('cuartos'); handleMenuClick('cuartos'); }}>Habitaciones</li>
                </ul>
              )}
            </li>
            <li onClick={() => handleMenuClick('Departamentos')}>
              <ApartmentOutlined style={{ color: 'var(--color-icon)' }} />
              Departamentos
            </li>
            <li onClick={() => handleMenuClick('cerrarSesion')}>
              <LogoutOutlined style={{ color: 'Red', marginRight: '8px' }} />
              Cerrar Sesión
            </li>
          </ul>
        </nav>
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <div className="hamburger"></div>
          <div className="hamburger"></div>
          <div className="hamburger"></div>
        </div>
      </header>
    </>
  );
};

export default EncabezadoAdministrativo;