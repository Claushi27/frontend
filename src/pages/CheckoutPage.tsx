import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { CreditCard, Truck, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface CheckoutFormData {
  nombre_completo: string;
  direccion: string;
  telefono: string;
  email: string;
  ciudad: string;
  region: string;
  comentarios?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total } = useAppSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    nombre_completo: '',
    direccion: '',
    telefono: '',
    email: '',
    ciudad: '',
    region: '',
    comentarios: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Crear el pedido - formato requerido por el backend
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const impuestos = subtotal * 0.19; // 19% IVA
      const totalConImpuestos = subtotal + impuestos;
      const numeroCompra = `ORD-${Date.now()}`;

      const pedidoData = {
        cabecera: {
          id_cliente: 1, // Por ahora usar cliente fijo, después crear dinámicamente
          id_tipo: 2, // Despacho a domicilio
          id_sucursal: 1, // Sucursal por defecto
          fecha: new Date().toISOString().split('T')[0],
          id_estado: 1, // Pendiente
          numero_compra: numeroCompra,
          id_moneda: 1, // CLP
          total_sin_impuesto: subtotal,
          impuesto: impuestos,
          total_con_impuesto: totalConImpuestos,
          descuento: 0,
          comentarios: formData.comentarios
        },
        detalles: items.map(item => ({
          id_producto: item.id,
          cantidad: item.quantity,
          precio_unitario: item.price,
          descuento_item: 0,
          subtotal: item.price * item.quantity
        }))
      };

      const pedidoResponse = await apiClient.post('/pedidos', pedidoData);

      // El backend puede devolver directamente el pedido o con success/data
      let id_pedido;
      if (pedidoResponse.pedido) {
        id_pedido = pedidoResponse.pedido.id_pedido;
      } else if (pedidoResponse.id_pedido) {
        id_pedido = pedidoResponse.id_pedido;
      } else {
        throw new Error(pedidoResponse.message || 'Error al crear el pedido');
      }

      // 2. Iniciar transacción WebPay
      const webpayResponse = await apiClient.post('/pagos/webpay/crear', { id_pedido });

      // El backend devuelve directamente los datos de WebPay
      if (!webpayResponse.url_webpay || !webpayResponse.token_ws) {
        throw new Error('Error al iniciar el pago con WebPay');
      }

      // 3. Redireccionar a WebPay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = webpayResponse.url_webpay;
      form.style.display = 'none';

      const tokenInput = document.createElement('input');
      tokenInput.name = 'token_ws';
      tokenInput.value = webpayResponse.token_ws;
      form.appendChild(tokenInput);

      document.body.appendChild(form);
      form.submit();

    } catch (error: any) {
      console.error('Error en checkout:', error);
      alert('Error al procesar el pago: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Carrito Vacío</h1>
          <p className="text-gray-600 mb-8">No tienes productos en tu carrito.</p>
          <Button onClick={() => navigate('/productos')}>
            Ir a Productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de datos */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Información de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nombre Completo"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Dirección"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Región"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios (Opcional)
                  </label>
                  <textarea
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Instrucciones especiales para la entrega..."
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Resumen del pedido */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium text-blue-900">Método de Pago</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Serás redirigido a WebPay para completar el pago de forma segura.
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {loading ? 'Procesando...' : 'Pagar con WebPay'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;