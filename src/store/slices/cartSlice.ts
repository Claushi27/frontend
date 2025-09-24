import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
};

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;
        if (newQuantity <= existingItem.stock) {
          existingItem.quantity = newQuantity;
        }
      } else {
        state.items.push(action.payload);
      }

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;

      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;

      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item && quantity > 0 && quantity <= item.stock) {
        item.quantity = quantity;

        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;

        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      localStorage.removeItem('cart');
    },

    initializeCart: (state) => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const items: CartItem[] = JSON.parse(savedCart);
          state.items = items;
          const totals = calculateTotals(items);
          state.total = totals.total;
          state.itemCount = totals.itemCount;
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  initializeCart,
} = cartSlice.actions;

// Selectores
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartItemsCount = (state: RootState) => state.cart.itemCount;
export const selectCartLoading = (state: RootState) => state.cart.loading;

export default cartSlice.reducer;