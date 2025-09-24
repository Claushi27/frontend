import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { loginUser } from '@/store/slices/authSlice';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { ROUTES } from '@/constants';

const AdminLoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión - Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Usuario"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingrese su usuario"
              />
              <Input
                label="Contraseña"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
              />
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    ¿No tienes cuenta?
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  to={ROUTES.REGISTER}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Crear cuenta nueva
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;