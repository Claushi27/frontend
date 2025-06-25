import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PaymentResultPage from './pages/PaymentResultPage.jsx';
import OrdersManagementPage from './pages/OrdersManagementPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';

// IMPORTACIONES DE REACT-TOASTIFY
import { ToastContainer } from 'react-toastify'; // <-- Añade esta línea
import 'react-toastify/dist/ReactToastify.css';   // <-- Añade esta línea (importa el CSS base)

import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pago/resultado" element={<PaymentResultPage />} />

          {/* Rutas de Administrador */}
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin/pedidos" element={<OrdersManagementPage />} />
          <Route path="/admin/pedidos/:id" element={<OrderDetailPage />} />
        </Routes>
      </div>
      {/* AÑADE EL TOASTCONTAINER AQUÍ, AL FINAL DEL COMPONENTE RAÍZ */}
      <ToastContainer 
        position="bottom-right" // Posición de las notificaciones
        autoClose={3000}       // Se cierran automáticamente después de 3 segundos
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;