import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Component to protect admin-only routes
 * Redirects non-admin users to the home page
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useSelector(state => state.auth);
  
  // If user is not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  // If user is logged in but not admin, redirect to home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If user is admin, allow access to the route
  return children;
};

export default AdminRoute;
