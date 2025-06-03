import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (username, tipo, userData) => {
    const authData = { username, tipo, ...userData };
    setUser(authData);
    sessionStorage.setItem('user', JSON.stringify(authData));
    // Almacenar id_usuario en localStorage
    if (userData && userData.id_usuario) {
      localStorage.setItem('id_usuario', userData.id_usuario);
      console.log('id_usuario guardado en localStorage:', userData.id_usuario); // Para depuración
    } else {
      console.warn('id_usuario no encontrado en userData:', userData); // Para depuración
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    localStorage.removeItem('id_usuario'); // Limpiar id_usuario al cerrar sesión
    console.log('Sesión cerrada, id_usuario eliminado de localStorage'); // Para depuración
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = sessionStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);