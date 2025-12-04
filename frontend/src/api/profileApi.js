import axios from './axios';
import { API_ENDPOINTS } from '../utils/constants';

// Get all profiles
export const getAllProfiles = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PROFILES);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single profile by ID
export const getProfileById = async (id) => {
  try {
    const response = await axios.get(API_ENDPOINTS.PROFILE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new profile
export const createProfile = async (profileData) => {
  try {
    const response = await axios.post(API_ENDPOINTS.PROFILES, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update profile
export const updateProfile = async (id, profileData) => {
  try {
    const response = await axios.put(API_ENDPOINTS.PROFILE_BY_ID(id), profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete profile
export const deleteProfile = async (id) => {
  try {
    const response = await axios.delete(API_ENDPOINTS.PROFILE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add template to profile
export const addTemplateToProfile = async (profileId, templateId) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.ADD_TEMPLATE_TO_PROFILE(profileId, templateId)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove template from profile
export const removeTemplateFromProfile = async (profileId, templateId) => {
  try {
    const response = await axios.delete(
      API_ENDPOINTS.REMOVE_TEMPLATE_FROM_PROFILE(profileId, templateId)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};