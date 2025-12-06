// In App.jsx
import { Route, Routes } from 'react-router-dom';
import Transaction from './Transaction';
import Dashboard from './Dashboard';
import Transactions from './Addtransaction';
import Header from './Header';
import SignUp from './SignUp';
import SignIn from './SignIn';
import { UserContextProvider } from './UserContext';
import EditTransaction from './EditTransaction';
import Profile from './Profile';
import AllTransactions from './AllTransactions';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
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
      </Routes>
    </UserContextProvider>
  );
}

export default App;