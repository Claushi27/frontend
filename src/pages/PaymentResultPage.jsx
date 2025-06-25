import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './PaymentResultPage.css'; // Crearemos este archivo para estilos

function PaymentResultPage() {
  const location = useLocation(); // Hook para acceder a los parámetros de la URL
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [order, setOrder] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get('estado');
    const paymentMessage = queryParams.get('mensaje');
    const buyOrder = queryParams.get('orden');
    const paymentAmount = queryParams.get('monto');

    setStatus(paymentStatus || 'desconocido');
    setMessage(paymentMessage || 'No se recibió mensaje de estado.');
    setOrder(buyOrder || 'N/A');
    setAmount(paymentAmount || 'N/A');

    // Puedes hacer más lógica aquí, como actualizar el UI basado en el estado
    if (paymentStatus === 'exito') {
      console.log('¡Pago exitoso!');
    } else if (paymentStatus === 'anulado') {
      console.log('Pago anulado por el usuario.');
    } else {
      console.log('Pago fallido o con error.');
    }

  }, [location]);

  let statusClass = '';
  let statusText = '';
  switch (status) {
    case 'exito':
      statusClass = 'success';
      statusText = 'Pago Exitoso';
      break;
    case 'anulado':
      statusClass = 'warning';
      statusText = 'Pago Anulado';
      break;
    case 'fallido':
      statusClass = 'error';
      statusText = 'Pago Fallido';
      break;
    default:
      statusClass = 'info';
      statusText = 'Estado Desconocido';
  }

  return (
    <div className={`payment-result-container ${statusClass}`}>
      <h2>{statusText}</h2>
      <p className="message">{message}</p>
      <p><strong>Orden de Compra:</strong> {order}</p>
      {status === 'exito' && <p><strong>Monto Pagado:</strong> ${parseFloat(amount).toFixed(2)}</p>}

      <div className="actions">
        <Link to="/productos" className="button primary">Volver a Productos</Link>
        <Link to="/carrito" className="button secondary">Ir al Carrito</Link>
      </div>
    </div>
  );
}

export default PaymentResultPage;