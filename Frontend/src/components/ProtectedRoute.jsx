import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { userInfo } = useContext(UserContext);

    if (!userInfo || !userInfo.email) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute;
