import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Login thunk
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const url = import.meta.env.VITE_API_URL + '/signin';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Login failed';
      
      // Clone the response before attempting to read its body
      const clonedResponse = response.clone();
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If JSON parsing fails, try to get text content from the cloned response
        try {
          const errorText = await clonedResponse.text();
          console.error('Server returned non-JSON response:', errorText.substring(0, 100) + '...');
        } catch (textError) {
          console.error('Failed to read response as text');
        }
        errorMessage = `Server error: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Log response data to see what we're getting
    console.log("Login success response:", data);
    
    // Check if the response format is as expected
    // If data.user exists, return it, otherwise return the data itself
    return data.user || data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Register thunk
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const url = import.meta.env.VITE_API_URL + '/register';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Logout thunk
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const url = import.meta.env.VITE_API_URL + '/logout';
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Clear localStorage
    localStorage.removeItem('userInfo');
    
    return null;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Check auth status / profile thunk
export const fetchUserProfile = createAsyncThunk('auth/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const url = import.meta.env.VITE_API_URL + '/profile';
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Update income thunk
export const updateIncome = createAsyncThunk('auth/updateIncome', async ({ userId, income }, { rejectWithValue, getState }) => {
  try {
    // For this example, we'll assume the current API doesn't have a direct endpoint to update just the income
    // So we'll update it locally in the reducer and return the new income value
    return income;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Get initial state from localStorage if available
const getInitialState = () => {
  const savedUserInfo = localStorage.getItem('userInfo');
  const parsedUserInfo = savedUserInfo ? JSON.parse(savedUserInfo) : null;
  
  return {
    user: parsedUserInfo || null,
    income: parsedUserInfo?.income || 0,
    expense: 0,
    isAuthenticated: !!parsedUserInfo,
    isAdmin: parsedUserInfo?.role === 'admin' || false,
    isLoading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    updateIncomeLocal: (state, action) => {
      state.income = action.payload;
      if (state.user) {
        state.user.income = action.payload;
        // Update localStorage
        localStorage.setItem('userInfo', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.income = action.payload.income || 0;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.role === 'admin' || false;
        // Save to localStorage
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.income = action.payload.income || 0;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.role === 'admin' || false;
        // Save to localStorage
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.income = 0;
        state.isAuthenticated = false;
        state.isAdmin = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.income = action.payload.income || 0;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.role === 'admin' || false;
        // Save to localStorage
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        // Don't set error here, as this might be a normal "not logged in" case
      })
      // Update income cases
      .addCase(updateIncome.fulfilled, (state, action) => {
        state.income = action.payload;
        if (state.user) {
          state.user.income = action.payload;
          // Save to localStorage
          localStorage.setItem('userInfo', JSON.stringify(state.user));
        }
      });
  },
});

export const { clearAuthError, updateIncomeLocal } = authSlice.actions;
export default authSlice.reducer;
