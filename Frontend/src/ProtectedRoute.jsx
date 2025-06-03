// Create a new file: src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useContext(UserContext);
  
  // If user is not logged in, redirect to signin
  if (!userInfo || !userInfo.email) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;