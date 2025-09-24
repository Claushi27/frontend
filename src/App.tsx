import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAppDispatch } from '@/hooks';
import { initializeAuth } from '@/store/slices/authSlice';
import { initializeCart } from '@/store/slices/cartSlice';

// Layout Components
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import PaymentResultPage from '@/pages/PaymentResultPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import OrdersManagementPage from '@/pages/OrdersManagementPage';
import OrderDetailPage from '@/pages/OrderDetailPage';

// Routes
import { ROUTES } from '@/constants';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize authentication and cart from localStorage
    dispatch(initializeAuth());
    dispatch(initializeCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-6">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.PAYMENT_RESULT} element={<PaymentResultPage />} />

          {/* Admin Routes */}
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_ORDERS}
            element={
              <ProtectedRoute requiredRole="admin">
                <OrdersManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_ORDERS + '/:id'}
            element={
              <ProtectedRoute requiredRole="admin">
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="text-sm"
      />
    </div>
  );
}

export default App;