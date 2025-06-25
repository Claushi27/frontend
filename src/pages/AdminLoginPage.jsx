import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify'; // <-- Añade esta línea para importar 'toast'
import './AdminLoginPage.css';

function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Estado para mostrar errores internos en la página (opcional, el toast ya los cubre)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores anteriores
    setIsLoading(true); // Indicar que la solicitud está en curso

    try {
      // Realizar la solicitud POST al endpoint de login del backend
      const response = await api.post('/login', {
        nombre_usuario: username,
        contrasena: password,
      });

      // Verificar si la solicitud fue exitosa y si se recibió un usuario
      if (response.status === 200 && response.data.usuario) {
        const user = response.data.usuario;
        
        // Asumimos que el id_rol 1 corresponde a 'Administrador' según tu base de datos
        if (user.id_rol === 1) { 
          // Guardar la información del usuario en localStorage para mantener la sesión de forma simple
          localStorage.setItem('adminUser', JSON.stringify(user));
          toast.success('Inicio de sesión de administrador exitoso!'); // Mensaje de éxito con toast
          navigate('/admin/pedidos'); // Redirigir a la página de gestión de pedidos
        } else {
          // Si el usuario no tiene el rol de administrador
          const accessDeniedMessage = 'Acceso denegado: Este usuario no tiene rol de Administrador.';
          setError(accessDeniedMessage); // Mostrar error en la página
          toast.warn(accessDeniedMessage); // Mostrar advertencia con toast
        }
      } else {
        // Si la respuesta del servidor no fue 200 OK o no incluye el usuario
        const incorrectCredentialsMessage = 'Credenciales incorrectas. Inténtelo de nuevo.';
        setError(incorrectCredentialsMessage);
        toast.error(incorrectCredentialsMessage); // Mostrar error con toast
      }
    } catch (err) {
      // Capturar errores de red o errores de respuesta del servidor (ej. 401, 500)
      console.error("Error en login:", err.response ? err.response.data : err.message);
      const serverErrorMessage = err.response?.data?.message || 'Error en el servidor. Inténtelo de nuevo.';
      setError(serverErrorMessage);
      toast.error(serverErrorMessage); // Mostrar error crítico con toast
    } finally {
      setIsLoading(false); // Finalizar el estado de carga
    }
  };

  return (
    <div className="admin-login-container card-panel">
      <h2>Acceso de Administrador</h2>
      <form onSubmit={handleSubmit} className="admin-login-form">
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required // Campo requerido por HTML5
            disabled={isLoading} // Deshabilitar durante la carga
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Campo requerido por HTML5
            disabled={isLoading} // Deshabilitar durante la carga
          />
        </div>
        {/* Mostrar mensaje de error en la página si existe */}
        {error && <p className="error-message">{error}</p>} 
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPage;