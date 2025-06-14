import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching expenses
export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (_, { rejectWithValue }) => {
  try {
    const url = import.meta.env.VITE_API_URL + '/transactions';
    const response = await fetch(url, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for adding an expense
export const addExpense = createAsyncThunk('expenses/addExpense', async (expenseData, { rejectWithValue }) => {
  try {
    const url = import.meta.env.VITE_API_URL + '/transactions';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(expenseData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add expense');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for updating an expense
export const updateExpense = createAsyncThunk('expenses/updateExpense', async (expenseData, { rejectWithValue }) => {
  try {
    const url = import.meta.env.VITE_API_URL + `/transactions/${expenseData._id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(expenseData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update expense');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for deleting an expense
export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (id, { rejectWithValue }) => {
  try {
    const url = import.meta.env.VITE_API_URL + `/transactions/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
    
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  },
  reducers: {
    calculateTotals: (state) => {
      state.totalIncome = state.items
        .filter(expense => expense.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);
        
      state.totalExpense = state.items
        .filter(expense => expense.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);
        
      state.balance = state.totalIncome - state.totalExpense;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchExpenses
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle addExpense
      .addCase(addExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle updateExpense
      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(expense => expense._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle deleteExpense
      .addCase(deleteExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(expense => expense._id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { calculateTotals } = expenseSlice.actions;
export default expenseSlice.reducer;
