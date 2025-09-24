// User Types
export interface User {
  id_usuario: number;
  rut: string;
  username: string;
  nombres: string;
  ap_paterno: string;
  ap_materno?: string;
  esta_suscrito: '0' | '1';
  id_rol: number;
  estado: number;
}

export interface AuthUser extends User {
  token: string;
  role?: string;
  roleId?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  rut: string;
  username: string;
  nombres: string;
  ap_paterno: string;
  ap_materno?: string;
  email: string;
  telefono?: string;
  password: string;
}

// Product Types
export interface Product {
  id_producto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  id_categoria: number;
  estado: number;
  imagen_url?: string;
  categoria?: Category;
}

export interface Category {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
  estado: number;
}

// Order Types
export interface Order {
  id_pedido: number;
  id_cliente: number;
  fecha_pedido: string;
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
  direccion_entrega: string;
  metodo_pago: string;
  items: OrderItem[];
  cliente?: Cliente;
}

export interface OrderItem {
  id_detalle: number;
  id_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Product;
}

export interface Cliente {
  id_cliente: number;
  rut: string;
  nombres: string;
  ap_paterno: string;
  ap_materno?: string;
  email: string;
  telefono?: string;
  direccion?: string;
  estado: number;
}

// Cart Types
export interface CartItem {
  id_producto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url?: string;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Payment Types
export interface PaymentMethod {
  id_metodo_pago: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface WebpayTransaction {
  token: string;
  url: string;
}

export interface PaymentResult {
  success: boolean;
  transaction_id?: string;
  amount?: number;
  message: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface ContactForm {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
}

// Store Types
export interface RootState {
  auth: AuthState;
  cart: CartState;
  products: ProductState;
  orders: OrderState;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CartState extends Cart {
  loading: boolean;
}

export interface ProductState {
  products: Product[];
  categories: Category[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
}

export interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

export interface ProductFilters {
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'date';
  sortOrder?: 'asc' | 'desc';
}