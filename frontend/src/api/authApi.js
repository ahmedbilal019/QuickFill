import axios from "./axios";
import { API_ENDPOINTS } from "../utils/constants";

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_ME);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(API_ENDPOINTS.UPDATE_PROFILE, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.put(
      API_ENDPOINTS.CHANGE_PASSWORD,
      passwordData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
