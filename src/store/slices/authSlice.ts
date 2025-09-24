import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser, LoginCredentials } from '@/types';
import { apiClient } from '@/lib/api';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/login', credentials);

      if (response.success && response.data) {
        const { user, token } = response.data;
        console.log('=== LOGIN SUCCESS DEBUG ===');
        console.log('user desde backend:', JSON.stringify(user, null, 2));
        console.log('token:', token);

        apiClient.setAuthToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authToken', token);

        const finalUser = { ...user, token };
        console.log('user final para store:', JSON.stringify(finalUser, null, 2));
        console.log('========================');

        return finalUser;
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    console.log('=== LOGOUT THUNK DEBUG ===');
    console.log('Clearing localStorage...');

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    console.log('localStorage cleared');

    // Clear API client auth token
    apiClient.setAuthToken('');
    console.log('API client token cleared');
    console.log('========================');

    return null;
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('=== INITIALIZE AUTH DEBUG ===');
        console.log('token from localStorage:', token);
        console.log('user from localStorage:', JSON.stringify(user, null, 2));

        // Restore API client auth token
        apiClient.setAuthToken(token);
        const finalUser = { ...user, token };
        console.log('final user for store:', JSON.stringify(finalUser, null, 2));
        console.log('========================');
        return finalUser;
      } catch (error) {
        console.log('Error parsing saved user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return null;
      }
    }

    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      // Initialize
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;