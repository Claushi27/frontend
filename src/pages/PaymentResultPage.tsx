import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import { Card, CardContent, Button } from '@/components/ui';
import { CheckCircle, XCircle, AlertCircle, Home, ShoppingBag } from 'lucide-react';

const PaymentResultPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const estado = searchParams.get('estado');
  const orden = searchParams.get('orden');
  const monto = searchParams.get('monto');
  const mensaje = searchParams.get('mensaje');

  useEffect(() => {
    // Si el pago fue exitoso, limpiar el carrito
    if (estado === 'exito') {
      dispatch(clearCart());
    }
  }, [estado, dispatch]);

  const formatPrice = (amount: string | null) => {
    if (!amount) return '';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(parseInt(amount));
  };

  const getStatusConfig = () => {
    switch (estado) {
      case 'exito':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: '¡Pago Exitoso!',
          message: 'Tu pago ha sido procesado correctamente.',
          showOrderInfo: true,
        };
      case 'fallido':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Pago Fallido',
          message: 'El pago no pudo ser procesado.',
          showOrderInfo: true,
        };
      case 'anulado':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Pago Anulado',
          message: 'El pago fue cancelado por el usuario.',
          showOrderInfo: false,
        };
      case 'error':
      default:
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Error en el Pago',
          message: 'Ocurrió un error durante el proceso de pago.',
          showOrderInfo: false,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card className={`${statusConfig.bgColor} ${statusConfig.borderColor}`}>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <StatusIcon className={`w-16 h-16 mx-auto ${statusConfig.color}`} />
            </div>

            <h1 className={`text-3xl font-bold mb-4 ${statusConfig.color}`}>
              {statusConfig.title}
            </h1>

            <p className="text-gray-700 text-lg mb-6">
              {mensaje ? decodeURIComponent(mensaje) : statusConfig.message}
            </p>

            {statusConfig.showOrderInfo && orden && (
              <div className="bg-white p-4 rounded-lg mb-6 border">
                <h3 className="font-semibold text-gray-900 mb-2">Detalles de la Orden</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Número de Orden:</span>
                    <span className="font-mono">{orden}</span>
                  </div>
                  {monto && (
                    <div className="flex justify-between">
                      <span>Monto:</span>
                      <span className="font-semibold">{formatPrice(monto)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Fecha:</span>
                    <span>{new Date().toLocaleDateString('es-CL')}</span>
                  </div>
                </div>
              </div>
            )}

            {estado === 'exito' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Próximos Pasos</h4>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Recibirás un email de confirmación en breve</li>
                  <li>• Tu pedido será procesado en las próximas 24 horas</li>
                  <li>• Te notificaremos cuando el envío esté en camino</li>
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Ir al Inicio
              </Button>
              <Button
                onClick={() => navigate('/productos')}
                className="flex items-center"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Seguir Comprando
              </Button>
            </div>

            {estado === 'fallido' && (
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">
                  ¿Problemas con el pago?
                </p>
                <Button
                  onClick={() => navigate('/checkout')}
                  variant="outline"
                  size="sm"
                >
                  Intentar Nuevamente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentResultPage;