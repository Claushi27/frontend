// C:\Users\futbo\Desktop\Universidad\FrontEnd_api\frontend\src\pages\CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate, Link } from 'react-router-dom'; // Asegúrate de importar Link

import './CartPage.css'; // Asegúrate de que este CSS esté importado

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío. Por favor, añade productos antes de proceder al pago.");
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-container"> {/* Contenedor principal de la página */}
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? ( // <--- ESTA ES LA CONDICIÓN CLAVE
        // Contenido a mostrar cuando el carrito está vacío
        <div className="empty-cart-message"> 
          <p>Tu carrito está vacío. ¡Es un buen momento para empezar a llenarlo!</p>
          <Link to="/productos" className="button primary">Explorar Productos</Link> {/* Este Link debe ser visible */}
        </div>
      ) : (
        // Contenido a mostrar cuando el carrito tiene productos
        <div className="cart-content">
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id_producto} className="cart-item">
                <div className="item-details">
                  <h3>{item.nombre}</h3>
                  <p>Precio Unitario: ${item.precio_unitario?.toFixed(2)}</p>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id_producto, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id_producto, item.quantity + 1)}>+</button>
                  </div>
                  <p>Subtotal: ${(item.precio_unitario * item.quantity)?.toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id_producto)} className="remove-button">Eliminar</button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h3>Resumen del Carrito</h3>
            <p>Total de Productos: {cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
            <p className="cart-total">Total a Pagar: ${cartTotal.toFixed(2)}</p>
            <button onClick={clearCart} className="clear-cart-button">Vaciar Carrito</button>
            <button onClick={handleProceedToCheckout} className="proceed-button">Proceder al Pago</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;