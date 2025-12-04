import axios from "./axios";
import { API_ENDPOINTS } from "../utils/constants";

// Get all templates
export const getAllTemplates = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.isActive !== undefined)
      params.append("isActive", filters.isActive);

    const url = params.toString()
      ? `${API_ENDPOINTS.TEMPLATES}?${params.toString()}`
      : API_ENDPOINTS.TEMPLATES;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single template by ID
export const getTemplateById = async (id) => {
  try {
    const response = await axios.get(API_ENDPOINTS.TEMPLATE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new template
export const createTemplate = async (templateData) => {
  try {
    const response = await axios.post(API_ENDPOINTS.TEMPLATES, templateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update template
export const updateTemplate = async (id, templateData) => {
  try {
    const response = await axios.put(
      API_ENDPOINTS.TEMPLATE_BY_ID(id),
      templateData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete template
export const deleteTemplate = async (id) => {
  try {
    const response = await axios.delete(API_ENDPOINTS.TEMPLATE_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Track template usage
export const useTemplate = async (id) => {
  try {
    const response = await axios.post(API_ENDPOINTS.USE_TEMPLATE(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
