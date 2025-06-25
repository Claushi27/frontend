import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx'; // <--- ADD THIS LINE
import './Navbar.css';

function Navbar() {
  const { cartItems } = useCart(); // <--- USE THE cartItems FROM CONTEXT
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">FERREMAS</Link>
      <div className="navbar-links">
        <Link to="/productos" className="navbar-item">Productos</Link>
        <Link to="/carrito" className="navbar-item">
          Carrito ({totalItemsInCart}) {/* <--- ADD THE COUNTER HERE */}
        </Link>
        <Link to="/admin-login" className="navbar-item">Admin Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;