import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { registerUser } from '@/store/slices/authSlice';
import { Card, CardContent, Input, Button, LoadingSpinner } from '@/components/ui';
import { ROUTES, VALIDATION_MESSAGES } from '@/constants';
import { UserPlus, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface RegisterFormData {
  rut: string;
  username: string;
  nombres: string;
  ap_paterno: string;
  ap_materno?: string;
  email: string;
  telefono?: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = yup.object().shape({
  rut: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .matches(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, VALIDATION_MESSAGES.INVALID_RUT),
  username: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3)),
  nombres: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2)),
  ap_paterno: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2)),
  ap_materno: yup.string(),
  email: yup
    .string()
    .email(VALIDATION_MESSAGES.INVALID_EMAIL)
    .required(VALIDATION_MESSAGES.REQUIRED),
  telefono: yup.string(),
  password: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(6, VALIDATION_MESSAGES.MIN_LENGTH(6)),
  confirmPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf([yup.ref('password')], VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const formatRut = (value: string) => {
    // Remove all non-alphanumeric characters
    const clean = value.replace(/[^0-9kK]/g, '');

    // Don't format if less than 2 characters
    if (clean.length < 2) return clean;

    // Extract the verification digit
    const dv = clean.slice(-1);
    const number = clean.slice(0, -1);

    // Format the number part
    let formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Add the dash and verification digit
    return `${formatted}-${dv}`;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setValue('rut', formatted);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerData = {
        ...data,
        rut: data.rut.replace(/[.-]/g, ''), // Remove formatting for API
      };

      await dispatch(registerUser(registerData)).unwrap();
      toast.success('¡Cuenta creada exitosamente! Bienvenido a Ferremas');
      navigate(ROUTES.HOME);
    } catch (error: any) {
      toast.error(error || 'Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Crear cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Únete a Ferremas para acceder a las mejores herramientas y materiales
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="py-8 px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Input
                    label="RUT"
                    placeholder="12.345.678-9"
                    {...register('rut')}
                    onChange={handleRutChange}
                    error={errors.rut?.message}
                    maxLength={12}
                  />
                </div>

                <div>
                  <Input
                    label="Nombre de usuario"
                    placeholder="usuario123"
                    {...register('username')}
                    error={errors.username?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Nombres"
                    placeholder="Juan Carlos"
                    {...register('nombres')}
                    error={errors.nombres?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Apellido Paterno"
                    placeholder="Pérez"
                    {...register('ap_paterno')}
                    error={errors.ap_paterno?.message}
                  />
                  <Input
                    label="Apellido Materno"
                    placeholder="González (opcional)"
                    {...register('ap_materno')}
                    error={errors.ap_materno?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Teléfono (opcional)"
                    placeholder="+56 9 1234 5678"
                    {...register('telefono')}
                    error={errors.telefono?.message}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirmar contraseña"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repite tu contraseña"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    ¿Ya tienes cuenta?
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  to={ROUTES.ADMIN_LOGIN}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Iniciar sesión
                </Link>

                <Link
                  to={ROUTES.HOME}
                  className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Volver al inicio
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;