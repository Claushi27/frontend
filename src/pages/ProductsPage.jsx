import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext.jsx';
import { toast } from 'react-toastify'; // Importa la función toast para notificaciones
import './ProductsPage.css'; // Importa los estilos específicos para esta página

function ProductsPage() {
  const [products, setProducts] = useState([]); // Estado para almacenar la lista de productos
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
  const [error, setError] = useState(null); // Estado para almacenar mensajes de error
  const { addToCart } = useCart(); // Hook para acceder a la función de añadir al carrito del contexto

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/productos'); // Realiza una solicitud GET a tu endpoint de productos
        setProducts(response.data); // Almacena los productos en el estado
        setLoading(false); // Desactiva el estado de carga
      } catch (err) {
        console.error("Error al obtener productos:", err); // Log del error en consola
        setError("No se pudieron cargar los productos. Por favor, verifica tu conexión o inténtalo más tarde."); // Establece un mensaje de error
        setLoading(false); // Desactiva el estado de carga
        toast.error("Error al cargar productos. Inténtalo de nuevo."); // Muestra un toast de error al usuario
      }
    };

    fetchProducts(); // Llama a la función para obtener productos al montar el componente
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar

  const handleAddToCart = (productToAdd) => {
    if (productToAdd.Stock === 0) {
      toast.error(`Lo sentimos, "${productToAdd.Nombre}" está sin stock.`); // Notificación de error si no hay stock
      return;
    }

    addToCart({ // Añade el producto al carrito a través del contexto
      id_producto: productToAdd.id_interno_db, // Usa el ID interno de la DB
      nombre: productToAdd.Nombre, // Nombre del producto
      precio_unitario: productToAdd.Precio[0]?.Valor, // Precio unitario del producto
    });

    toast.success(`"${productToAdd.Nombre}" añadido al carrito!`); // Notificación de éxito al añadir al carrito
  };

  // Renderizado condicional basado en el estado de carga y error
  if (loading) {
    return (
      <div className="loading-container"> {/* Contenedor para el spinner de carga */}
        <div className="spinner"></div> {/* Elemento visual del spinner */}
        <p>Cargando productos...</p> {/* Mensaje de carga */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container"> {/* Contenedor para el mensaje de error */}
        <p className="error-message-large">{error}</p> {/* Mensaje de error principal */}
        <p>Asegúrate de que el backend esté funcionando.</p> {/* Instrucción adicional */}
      </div>
    );
  }

  return (
    <div className="products-container">
      <h2>Nuestros Productos</h2>
      <div className="product-list">
        {products.length > 0 ? ( // Verifica si hay productos para mostrar
          products.map((product) => (
            <div key={product.id_interno_db} className="product-card">
              <h3>{product.Nombre}</h3>
              <p>Marca: {product.Marca}</p>
              <p>Código: {product["Código del producto"]}</p>
              <p>Precio: ${product.Precio[0]?.Valor.toFixed(2)}</p>
              <p>Stock: {product.Stock}</p>
              <button
                onClick={() => handleAddToCart(product)} // Llama a la función para añadir al carrito
                disabled={product.Stock === 0} // Deshabilita el botón si no hay stock
              >
                {product.Stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'} {/* Texto del botón según el stock */}
              </button>
            </div>
          ))
        ) : (
          <p>No se encontraron productos.</p> // Mensaje si no hay productos
        )}
      </div>
    </div>
  );
}

export default ProductsPage;