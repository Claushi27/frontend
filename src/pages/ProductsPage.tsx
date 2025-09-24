import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { Card, CardContent, Button, Input } from '@/components/ui';
import { ShoppingCart, Search } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      const filtered = products.filter((product: any) =>
        product.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id_interno_db,
      name: product.Nombre,
      price: product.Precio[0]?.Valor || 0,
      quantity: 1,
      image: product.imagenes?.[0]?.url_imagen || null,
      stock: product.Stock
    };
    dispatch(addToCart(cartItem));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error al cargar productos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        {user && user.role === 'admin' && (
          <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded">
            Vista Administrador
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: any) => (
          <Card key={product.id_interno_db} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {product.imagenes?.[0]?.url_imagen ? (
                <img
                  src={product.imagenes[0].url_imagen}
                  alt={product.Nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400" style={{ display: product.imagenes?.[0]?.url_imagen ? 'none' : 'flex' }}>
                <ShoppingCart className="w-16 h-16 mb-2 opacity-30" />
                <span className="text-sm text-center px-2">{product.Nombre}</span>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.Nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.Marca}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(product.Precio[0]?.Valor || 0)}
                </span>
                <span className={`text-sm px-2 py-1 rounded ${
                  product.Stock > 10
                    ? 'bg-green-100 text-green-800'
                    : product.Stock > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  Stock: {product.Stock}
                </span>
              </div>

              {user && user.role === 'admin' && (
                <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                  <p>ID: {product.id_interno_db}</p>
                  <p>Código: {product.Código}</p>
                </div>
              )}

              <Button
                onClick={() => handleAddToCart(product)}
                disabled={product.Stock === 0}
                className="w-full"
                variant={product.Stock === 0 ? "secondary" : "primary"}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.Stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron productos.</p>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600 text-center">
        Mostrando {filteredProducts.length} productos de {products?.length || 0}
      </div>
    </div>
  );
};

export default ProductsPage;