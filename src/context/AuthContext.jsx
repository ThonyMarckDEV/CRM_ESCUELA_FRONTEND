import React, { createContext, useContext, useState, useEffect } from 'react';
import jwtUtils from 'utilities/Token/jwtUtils';
import { logout as logoutAction } from 'js/logout';
import LoadingScreen from 'components/Shared/LoadingScreen';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = () => {
        const token = jwtUtils.getAccessTokenFromCookie();
        
        if (token) {
            const userRole = jwtUtils.getUserRole(token);
            
            setUser({ role: userRole });
            setRole(userRole);
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setRole(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (token) => {
        checkAuth();
    };

    const logout = () => {
        logoutAction();
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            role, 
            isAuthenticated, 
            loading, 
            login, 
            logout 
        }}>
            {loading ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto rápido
export const useAuth = () => useContext(AuthContext);