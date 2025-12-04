import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../api/authApi";
import {
  saveToken,
  getToken,
  saveUser,
  getUser,
  clearStorage,
} from "../utils/helpers";

// Create Context
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const savedUser = getUser();

      if (token && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);

        // Optionally fetch fresh user data from server
        try {
          const response = await getCurrentUser();
          if (response.success) {
            setUser(response.data);
            saveUser(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);

      if (response.success) {
        const { user, token } = response.data;

        // Save to state
        setUser(user);
        setIsAuthenticated(true);

        // Save to localStorage
        saveToken(token);
        saveUser(user);

        return { success: true, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);

      if (response.success) {
        const { user, token } = response.data;

        // Save to state
        setUser(user);
        setIsAuthenticated(true);

        // Save to localStorage
        saveToken(token);
        saveUser(user);

        return { success: true, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return { success: false, message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearStorage();
  };

  // Update user in context
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
