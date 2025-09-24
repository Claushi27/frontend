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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Todo para tus proyectos de construcción
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Encuentra las mejores herramientas, materiales y accesorios en Ferremas.
              Calidad profesional al mejor precio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={ROUTES.PRODUCTS}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Ver Productos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir Ferremas?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos líderes en el mercado de la ferretería con más de 20 años de experiencia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Descubre nuestros productos más populares
            </p>
          </div>
          <Link to={ROUTES.PRODUCTS}>
            <Button
              variant="outline"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Ver todos
            </Button>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" text="Cargando productos..." className="py-16" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id_interno_db || product.id_producto} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-t-xl overflow-hidden">
                  {product.imagen_url ? (
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.nombre}
                  </h3>
                  {product.descripcion && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.descripcion}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(product.precio)}
                    </span>
                    <Button size="sm" variant="primary">
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white rounded-2xl p-8 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          ¿Listo para comenzar tu proyecto?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Encuentra todo lo que necesitas en nuestro catálogo completo de productos profesionales
        </p>
        <Link to={ROUTES.PRODUCTS}>
          <Button
            size="lg"
            variant="primary"
            className="bg-primary-600 hover:bg-primary-700"
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            Explorar Catálogo
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;