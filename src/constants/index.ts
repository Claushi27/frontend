export const API_BASE_URL = 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/productos',
  CART: '/carrito',
  CHECKOUT: '/checkout',
  ORDERS: '/pedidos',
  ADMIN_LOGIN: '/admin-login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/productos',
  ADMIN_ORDERS: '/admin/pedidos',
  ADMIN_USERS: '/admin/usuarios',
  PAYMENT_RESULT: '/pago/resultado',
} as const;

export const ORDER_STATUSES = {
  PENDING: 'pendiente',
  CONFIRMED: 'confirmado',
  SHIPPED: 'enviado',
  DELIVERED: 'entregado',
  CANCELLED: 'cancelado',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUSES.PENDING]: 'Pendiente',
  [ORDER_STATUSES.CONFIRMED]: 'Confirmado',
  [ORDER_STATUSES.SHIPPED]: 'Enviado',
  [ORDER_STATUSES.DELIVERED]: 'Entregado',
  [ORDER_STATUSES.CANCELLED]: 'Cancelado',
} as const;

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUSES.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUSES.SHIPPED]: 'bg-indigo-100 text-indigo-800',
  [ORDER_STATUSES.DELIVERED]: 'bg-green-100 text-green-800',
  [ORDER_STATUSES.CANCELLED]: 'bg-red-100 text-red-800',
} as const;

export const USER_ROLES = {
  ADMIN: 1,
  CUSTOMER: 2,
  EMPLOYEE: 3,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  INVALID_EMAIL: 'Ingrese un email válido',
  INVALID_RUT: 'Ingrese un RUT válido',
  MIN_LENGTH: (min: number) => `Debe tener al menos ${min} caracteres`,
  MAX_LENGTH: (max: number) => `No puede tener más de ${max} caracteres`,
  PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden',
  INVALID_PHONE: 'Ingrese un teléfono válido',
} as const;