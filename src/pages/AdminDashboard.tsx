import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';
import { ROUTES } from '@/constants';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Pedidos Totales',
      value: '1,234',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Productos',
      value: '567',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Usuarios',
      value: '890',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Ventas del Mes',
      value: '$12,345',
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Ver y gestionar todos los pedidos</p>
            <Link
              to={ROUTES.ADMIN_ORDERS}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver pedidos →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Administrar catálogo de productos</p>
            <Link
              to={ROUTES.ADMIN_PRODUCTS}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Gestionar productos →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Administrar usuarios del sistema</p>
            <Link
              to={ROUTES.ADMIN_USERS}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver usuarios →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;