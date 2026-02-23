import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../../services/authService';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    if (isLoggedIn()) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
