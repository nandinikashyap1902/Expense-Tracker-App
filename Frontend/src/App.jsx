// In App.jsx
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Transaction from './Transaction';
import Transactions from './Addtransaction';
import Header from './Header';
import SignUp from './SignUp';
import SignIn from './SignIn';
import EditTransaction from './EditTransaction';
import Profile from './Profile';
import AllTransactions from './AllTransactions';
import ProtectedRoute from './ProtectedRoute';
//import ReduxTest from './ReduxTest';
import { fetchUserProfile } from './Store/Slices/authSlice';
import AdminDashboard from './AdminDashboard';
function App() {
  const dispatch = useDispatch();

  // Check auth status on app load
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Transaction />
        </ProtectedRoute>
      } />
      
      <Route path="/add-new-expense" element={
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      } />
      
      <Route path="/header" element={
        <ProtectedRoute>
          <Header />
        </ProtectedRoute>
      } />
      
      <Route path="/edit-transaction/:id" element={
        <ProtectedRoute>
          <EditTransaction />
        </ProtectedRoute>
      } />
      
      <Route path="/transactions" element={
        <ProtectedRoute>
          <AllTransactions />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      {/* <Route path='/redux-test' element={<ReduxTest />} /> */}
    </Routes>
  );
}

export default App;