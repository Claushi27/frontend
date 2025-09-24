import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { clearCart } from '@/store/slices/cartSlice';
import { ROUTES } from '@/constants';
import { Badge } from '@/components/ui';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { itemCount } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Debug logging para investigar problema de auth
  React.useEffect(() => {
    console.log('=== NAVBAR DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user objeto completo:', JSON.stringify(user, null, 2));
    console.log('user.role:', user?.role);
    console.log('user.roleId:', user?.roleId);
    console.log('localStorage user:', localStorage.getItem('user'));
    console.log('localStorage authToken:', localStorage.getItem('authToken'));
    console.log('==================');
  }, [isAuthenticated, user]);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const navigationItems = [
    { name: 'Inicio', href: ROUTES.HOME },
    { name: 'Productos', href: ROUTES.PRODUCTS },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = async () => {
    try {
      console.log('=== LOGOUT CLICKED ===');
      console.log('Starting logout process...');
      await dispatch(logoutUser()).unwrap();
      console.log('Logout dispatch successful');
      dispatch(clearCart()); // También limpiamos el carrito al hacer logout
      console.log('Cart cleared');
      setIsUserMenuOpen(false);
      console.log('User menu closed');
      navigate(ROUTES.HOME); // Redirigir al inicio
      console.log('Navigated to home');
      console.log('===============');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Cerrar menu cuando se hace click fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="text-xl font-bold text-primary-600">
              Ferremas
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActiveRoute(item.href)
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-4'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <Badge
                  variant="danger"
                  size="sm"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </Badge>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <span className="text-sm text-gray-700 hidden sm:block">
                      {user?.username}
                      {user?.role === 'admin' && (
                        <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                          Admin
                        </span>
                      )}
                    </span>
                    <User className="h-6 w-6" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      {user?.role === 'admin' && (
                        <Link
                          to={ROUTES.ADMIN_DASHBOARD}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Panel Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={ROUTES.ADMIN_LOGIN}
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Mobile search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Mobile navigation */}
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium py-2 ${
                    isActiveRoute(item.href)
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;