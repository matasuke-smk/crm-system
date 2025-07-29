import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI, handleAPIError } from '../utils/api';
import { getToken, setToken, removeToken, getUser, setUser, removeUser, isAuthenticated } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = getUser();
          if (userData) {
            setUserState(userData);
            setIsLoggedIn(true);
          } else {
            // Token exists but no user data, fetch from server
            const response = await authAPI.getProfile();
            const { user: fetchedUser } = response.data;
            setUser(fetchedUser);
            setUserState(fetchedUser);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: userData, token } = response.data;
      
      setToken(token);
      setUser(userData);
      setUserState(userData);
      setIsLoggedIn(true);
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, token } = response.data;
      
      setToken(token);
      setUser(newUser);
      setUserState(newUser);
      setIsLoggedIn(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = handleAPIError(error);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      removeToken();
      removeUser();
      setUserState(null);
      setIsLoggedIn(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    setUserState(userData);
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: () => isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};