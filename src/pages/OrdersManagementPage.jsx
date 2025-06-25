import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './OrdersManagementPage.css'; // Crearemos este archivo
// Puedes importar un componente para los detalles del pedido si los haces en un modal/sidebar
// import OrderDetailModal from '../components/OrderDetailModal';
import { toast } from 'react-toastify';

function OrdersManagementPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const adminUser = JSON.parse(localStorage.getItem('adminUser'));
      if (!adminUser || adminUser.id_rol !== 1) {
        toast.warn('Acceso no autorizado. Por favor, inicie sesión como administrador.'); // Usa toast
        navigate('/admin-login');
        return;
      }
  
      const fetchOrders = async () => {
        try {
          const response = await api.get('/pedidos');
          setOrders(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error al obtener pedidos:", err.response ? err.response.data : err.message);
          setError(err.response?.data?.error || 'Error al cargar los pedidos. Por favor, verifica el backend.');
          setLoading(false);
          toast.error("Error al cargar pedidos."); // Usa toast
        }
      };
  
      fetchOrders();
    }, [navigate]);

  const getStatusClass = (statusName) => {
    switch (statusName) {
      case 'Pagado':
        return 'status-paid';
      case 'En preparación':
        return 'status-preparing';
      case 'Listo para envío':
        return 'status-ready-for-shipping';
      case 'En camino':
        return 'status-in-transit';
      case 'Entregado':
        return 'status-delivered';
      case 'Pendiente':
        return 'status-pending';
      case 'Cancelado':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/admin/pedidos/${orderId}`); // Navegar a la página de detalle
  };

  if (loading) {
    return <p>Cargando pedidos...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="orders-management-container">
      <h2>Gestión de Pedidos (Administrador)</h2>
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Nro. Compra</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id_pedido}>
                <td>{order.id_pedido}</td>
                <td>{order.numero_compra}</td>
                <td>{order.nombre_cliente || 'N/A'}</td>
                <td>{new Date(order.fecha).toLocaleDateString()}</td>
                <td>${order.total_con_impuesto?.toFixed(2)} {order.id_moneda === 1 ? 'CLP' : 'USD'}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.nombre_estado_pedido)}`}>
                    {order.nombre_estado_pedido}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleViewDetails(order.id_pedido)} className="view-details-button">
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron pedidos.</p>
      )}
    </div>
  );
}

export default OrdersManagementPage;