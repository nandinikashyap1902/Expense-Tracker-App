// Create a new file: src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // If user is not logged in, redirect to signin
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;