import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './Slices/expenseSlice';
import authReducer from './Slices/authSlice';

const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    auth: authReducer
  }
});

export default store;
