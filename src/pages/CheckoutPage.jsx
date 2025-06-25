import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css'; // Crearemos este archivo para estilos
import { v4 as uuidv4 } from 'uuid'; 
import { toast } from 'react-toastify';

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info('Tu carrito está vacío. Añade productos antes de pagar.'); // <-- Añade esta línea
      navigate('/carrito');
    }
  }, [cartItems, navigate]);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const demoClientId = 1;
      const demoSucursalId = 1;

      // MODIFICACIÓN CRÍTICA AQUÍ: Generar un numero_compra más corto
      // Puedes usar una combinación de timestamp y un número aleatorio corto
      const uniqueSuffix = Math.random().toString(36).substring(2, 10); // Genera una cadena alfanumérica corta
      // Aseguramos que la longitud total no exceda 26. "COMPRA-" son 7 caracteres.
      // El timestamp acortado + suffix deberia ser ~19 caracteres.
      const timestampPart = Date.now().toString().slice(-10); // Últimos 10 dígitos del timestamp
      const numeroCompraGenerado = `FERRE-${timestampPart}-${uniqueSuffix}`; // Longitud total: 5 + 1 + 10 + 1 + 8 = 25

      const orderData = {
        cabecera: {
          id_cliente: demoClientId,
          id_tipo: 2,
          id_sucursal: demoSucursalId,
          fecha: new Date().toISOString().split('T')[0],
          id_estado: 1,
          // USA EL NUEVO NUMERO DE COMPRA GENERADO AQUÍ
          numero_compra: numeroCompraGenerado, 
          id_moneda: 1,
          total_sin_impuesto: parseFloat((cartTotal / 1.19).toFixed(2)),
          impuesto: parseFloat((cartTotal - (cartTotal / 1.19)).toFixed(2)),
          total_con_impuesto: parseFloat(cartTotal.toFixed(2)),
          descuento: 0,
          comentarios: 'Pago via Webpay',
        },
        detalles: cartItems.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.quantity,
          precio_unitario: item.precio_unitario,
          descuento_item: 0,
          subtotal: parseFloat((item.precio_unitario * item.quantity).toFixed(2)),
        })),
      };

      console.log("Creando pedido en backend con numero_compra:", orderData.cabecera.numero_compra); // Para depuración
      const orderResponse = await api.post('/pedidos', orderData);
      const idPedido = orderResponse.data.pedido.id_pedido;
      console.log("Pedido creado con ID:", idPedido);

      // 2. Iniciar la transacción Webpay
      const webpayInitResponse = await api.post('/pagos/webpay/crear', { id_pedido: idPedido });
      console.log("Respuesta de Webpay Init:", webpayInitResponse.data);

      const { url_webpay, token_ws } = webpayInitResponse.data;

      // 3. Redirigir al usuario a la pasarela de Webpay
      // La forma más robusta es crear un formulario y enviarlo programáticamente
      const form = document.createElement('form');
      form.action = url_webpay;
      form.method = 'POST';
      form.style.display = 'none'; // Ocultar el formulario

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = token_ws;
      form.appendChild(tokenInput);

      document.body.appendChild(form);
      form.submit(); // Envía el formulario, redirigiendo al usuario

      // Limpiar el carrito después de iniciar el pago
      clearCart();

    } catch (err) {
      console.error("Error al procesar el pago:", err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.error || 'Error desconocido al procesar el pago. Intente de nuevo.';
      setError(errorMessage); // Puedes mantener el error local en la página
      toast.error(errorMessage); // <-- Añade un toast de error
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0 && !isLoading && !error) {
    return <p>Redirigiendo al carrito...</p>;
  }

  return (
    <div className="checkout-container">
      <h2>Resumen de tu Compra</h2>
      <div className="checkout-summary">
        <h3>Productos en el Carrito:</h3>
        {cartItems.map(item => (
          <div key={item.id_producto} className="checkout-item">
            <span>{item.nombre} x {item.quantity}</span>
            <span>${(item.precio_unitario * item.quantity)?.toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout-total">
          <span>Total Final:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button
        onClick={handlePayment}
        disabled={isLoading || cartItems.length === 0}
        className="pay-button"
      >
        {isLoading ? 'Redirigiendo a Webpay...' : 'Pagar con Webpay'}
      </button>
      <p className="payment-note">Serás redirigido a la pasarela de pago de Transbank.</p>
    </div>
  );
}

export default CheckoutPage;