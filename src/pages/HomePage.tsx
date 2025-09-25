import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Users, Award, Truck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import { Card, CardContent, Button, LoadingSpinner } from '@/components/ui';
import { ROUTES } from '@/constants';
import { formatCurrency } from '@/utils/formatters';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 6);

  const features = [
    {
      icon: ShoppingBag,
      title: 'Amplio Catálogo',
      description: 'Miles de productos para todas tus necesidades de ferretería',
    },
    {
      icon: Truck,
      title: 'Envío Rápido',
      description: 'Entrega en 24-48 horas en toda la región metropolitana',
    },
    {
      icon: Award,
      title: 'Calidad Garantizada',
      description: 'Solo trabajamos con las mejores marcas del mercado',
    },
    {
      icon: Users,
      title: 'Atención Personalizada',
      description: 'Nuestro equipo de expertos te asesora en tus proyectos',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Más compacto */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Ferremas
              </h1>
              <p className="text-lg md:text-xl mb-6 text-blue-100">
                Tu ferretería de confianza. Encuentra herramientas, materiales y todo
                lo que necesitas para tus proyectos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={ROUTES.PRODUCTS}>
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 border-0"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Explorar Productos
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Nuestros Servicios
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/20 rounded-lg p-4">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">5000+</div>
                    <div className="text-sm">Productos</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <Truck className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">24h</div>
                    <div className="text-sm">Envío</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">10k+</div>
                    <div className="text-sm">Clientes</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <Award className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">20</div>
                    <div className="text-sm">Años</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Más compacto */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              ¿Por qué elegir Ferremas?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tu socio confiable en proyectos de construcción y ferretería
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Productos Destacados
              </h2>
              <p className="text-gray-600">
                Los más vendidos en ferretería y construcción
              </p>
            </div>
            <Link to={ROUTES.PRODUCTS}>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Ver Catálogo
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Cargando productos..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id_interno_db || product.id_producto} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.imagen_url ? (
                      <img
                        src={product.imagen_url}
                        alt={product.nombre}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm line-clamp-2">
                      {product.nombre}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(product.precio)}
                      </span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1">
                        Agregar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            ¿Necesitas ayuda con tu proyecto?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Nuestro equipo de expertos está listo para asesorarte. Encuentra todo lo que necesitas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.PRODUCTS}>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 border-0"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Ver Productos
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Contactar Asesor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;