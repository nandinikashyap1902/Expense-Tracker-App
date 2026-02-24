import { Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import AddTransaction from './pages/AddTransaction/AddTransaction';
import AllTransactions from './pages/AllTransactions/AllTransactions';
import EditTransaction from './pages/EditTransaction/EditTransaction';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/add-new-expense" element={
          <ProtectedRoute><AddTransaction /></ProtectedRoute>
        } />

        <Route path="/transactions" element={
          <ProtectedRoute><AllTransactions /></ProtectedRoute>
        } />

        <Route path="/edit-transaction/:id" element={
          <ProtectedRoute><EditTransaction /></ProtectedRoute>
        } />
      </Routes>
    </UserContextProvider>
  );
}

export default App;