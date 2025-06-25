import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext.jsx';
import { toast } from 'react-toastify';
import './HomePage.css';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/productos');
        setFeaturedProducts(response.data.slice(0, 4)); 
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener productos destacados:", err);
        setError("No se pudieron cargar los productos destacados.");
        setLoading(false);
        toast.error("Error al cargar productos destacados.");
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (productToAdd) => {
    if (productToAdd.Stock === 0) {
      toast.error(`Lo sentimos, "${productToAdd.Nombre}" está sin stock.`);
      return;
    }
    addToCart({
        id_producto: productToAdd.id_interno_db,
        nombre: productToAdd.Nombre,
        precio_unitario: productToAdd.Precio[0]?.Valor,
    });
    toast.success(`"${productToAdd.Nombre}" añadido al carrito!`);
  };

  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Bienvenido a FERREMAS</h1>
        <p>Tu mejor aliado en herramientas y materiales de construcción.</p>
        <Link to="/productos" className="hero-button">Ver Todos los Productos</Link>
      </header>

      <section className="featured-products-section">
        <h2>Productos Destacados</h2>
        {loading ? (
          <div className="loading-container"> {/* Usa el estilo global */}
            <div className="spinner"></div>
            <p>Cargando productos destacados...</p>
          </div>
        ) : error ? (
          <div className="error-container"> {/* Usa el estilo global */}
            <p className="error-message-large">{error}</p>
            <p>Asegúrate de que el backend esté funcionando.</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="featured-products-list">
            {featuredProducts.map(product => (
              <div key={product.id_interno_db} className="product-card-home">
                <h3>{product.Nombre}</h3>
                <p>Marca: {product.Marca}</p>
                <p>Precio: ${product.Precio[0]?.Valor.toFixed(2)}</p>
                <p>Stock: {product.Stock}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.Stock === 0}
                >
                  {product.Stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay productos destacados disponibles.</p>
        )}
      </section>

      <section className="about-us-section">
        <h2>Sobre Nosotros</h2>
        <p>
          En FERREMAS, nos dedicamos a ofrecer productos de alta calidad y un servicio excepcional.
          Con una amplia gama de herramientas y materiales, somos tu destino único para todos tus proyectos.
        </p>
      </section>
    </div>
  );
}

export default HomePage;