import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from 'services/authService'; 
import jwtUtils from 'utilities/Token/jwtUtils'; 
import { logout as logoutAction } from 'js/logout';
import LoadingScreen from 'components/Shared/LoadingScreen';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = jwtUtils.getAccessTokenFromCookie();
        
        if (!token) {
            handleLogoutState();
            return;
        }

        try {
            const response = await authService.verifySession();

            const userData = response.data || response;

            setUser(userData); 
            
            const userRole = userData.rol?.nombre || null;
            
            setRole(userRole);
            setIsAuthenticated(true);

        } catch (error) {
            console.error("Sesión no válida:", error);
            logoutAction(); 
            handleLogoutState();
        } finally {
            setLoading(false);
        }
    };

    // Helper para limpiar estado
    const handleLogoutState = () => {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async () => {
        setLoading(true);
        await checkAuth();
    };

    const logout = () => {
        logoutAction();
        handleLogoutState();
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

export const useAuth = () => useContext(AuthContext);