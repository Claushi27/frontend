import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './OrderDetailPage.css'; // Crearemos este archivo

function OrderDetailPage() {
  const { id } = useParams(); // Obtiene el ID del pedido de la URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si el usuario es administrador antes de cargar los detalles
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (!adminUser || adminUser.id_rol !== 1) { // Asumiendo id_rol=1 para admin
      alert('Acceso no autorizado. Por favor, inicie sesión como administrador.');
      navigate('/admin-login');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        // Obtener detalles del pedido
        const orderResponse = await api.get(`/pedidos/${id}`);
        setOrder(orderResponse.data);

        // Obtener pagos del pedido
        const paymentsResponse = await api.get(`/pagos/pedido/${id}`); // Usa la nueva ruta del backend
        setPayments(paymentsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error(`Error al obtener detalles del pedido ${id}:`, err.response ? err.response.data : err.message);
        setError(err.response?.data?.error || 'Error al cargar los detalles del pedido o sus pagos.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate]); // Vuelve a cargar si el ID del pedido cambia

  if (loading) {
    return <p>Cargando detalles del pedido...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!order) {
    return <p>Pedido no encontrado.</p>;
  }

  const getStatusClass = (statusName) => {
    switch (statusName) {
      case 'Pagado': return 'status-paid';
      case 'En preparación': return 'status-preparing';
      case 'Listo para envío': return 'status-ready-for-shipping';
      case 'En camino': return 'status-in-transit';
      case 'Entregado': return 'status-delivered';
      case 'Pendiente': return 'status-pending';
      case 'Cancelado': return 'status-cancelled';
      default: return '';
    }
  };


  return (
    <div className="order-detail-container">
      <h2>Detalle del Pedido #{order.id_pedido} - {order.numero_compra}</h2>

      <div className="order-header">
        <p><strong>Cliente:</strong> {order.nombre_cliente || 'N/A'}</p>
        <p><strong>Fecha del Pedido:</strong> {new Date(order.fecha).toLocaleDateString()}</p>
        <p><strong>Estado:</strong> <span className={`status-badge ${getStatusClass(order.nombre_estado_pedido)}`}>{order.nombre_estado_pedido}</span></p>
        <p><strong>Tipo de Entrega:</strong> {order.tipo_entrega_descripcion || 'N/A'}</p>
        {order.nombre_sucursal_retiro && <p><strong>Sucursal de Retiro:</strong> {order.nombre_sucursal_retiro}</p>}
        <p><strong>Comentarios:</strong> {order.comentarios || 'Sin comentarios'}</p>
      </div>

      <h3>Items del Pedido</h3>
      {order.detalles && order.detalles.length > 0 ? (
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Descuento</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.detalles.map(item => (
              <tr key={item.id_detalle}>
                <td>{item.nombre_producto}</td>
                <td>{item.codigo_producto}</td>
                <td>{item.cantidad}</td>
                <td>${item.precio_unitario?.toFixed(2)}</td>
                <td>${item.descuento_item?.toFixed(2)}</td>
                <td>${item.subtotal?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Este pedido no tiene detalles de productos.</p>
      )}

      <div className="order-totals">
        <p>Subtotal (sin imp.): ${order.total_sin_impuesto?.toFixed(2)}</p>
        <p>Impuesto: ${order.impuesto?.toFixed(2)}</p>
        <p>Descuento total: ${order.descuento?.toFixed(2)}</p>
        <p className="final-total">Total a Pagar: ${order.total_con_impuesto?.toFixed(2)} {order.id_moneda === 1 ? 'CLP' : 'USD'}</p>
      </div>

      <h3>Registros de Pago</h3>
      {payments.length > 0 ? (
        <table className="payment-records-table">
          <thead>
            <tr>
              <th>ID Pago</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Monto</th>
              <th>Fecha Pago</th>
              <th>Ref. Transacción</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id_pago}>
                <td>{payment.id_pago}</td>
                <td>{payment.metodo_pago_descripcion}</td>
                <td>{payment.estado}</td>
                <td>${payment.monto?.toFixed(2)} {payment.moneda_codigo}</td>
                <td>{new Date(payment.fecha_pago).toLocaleString()}</td>
                <td>{payment.referencia_transaccion || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron registros de pago para este pedido.</p>
      )}

      <button onClick={() => navigate('/admin/pedidos')} className="back-button">
        Volver a Pedidos
      </button>
    </div>
  );
}

export default OrderDetailPage;