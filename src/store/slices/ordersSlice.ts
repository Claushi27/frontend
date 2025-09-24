import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderState } from '@/types';
import { apiClient } from '@/lib/api';

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/pedidos');

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch orders');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/pedidos/${id}`);

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch order');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: Partial<Order>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/pedidos', orderData);

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create order');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/pedidos/${id}/estado`, { estado: status });

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update order status');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateOrderInList: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(order => order.id_pedido === action.payload.id_pedido);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id_pedido === action.payload.id_pedido);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder?.id_pedido === action.payload.id_pedido) {
          state.selectedOrder = action.payload;
        }
      });
  },
});

export const {
  setSelectedOrder,
  clearError,
  updateOrderInList,
} = ordersSlice.actions;

export default ordersSlice.reducer;