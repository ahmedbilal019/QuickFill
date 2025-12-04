import { createContext, useState, useEffect } from "react";
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../api/templateApi";

// Create Context
export const TemplateContext = createContext();

// Provider Component
export const TemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all templates
  const fetchTemplates = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllTemplates(filters);

      if (response.success) {
        setTemplates(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  // Get single template
  const fetchTemplateById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTemplateById(id);

      if (response.success) {
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch template");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new template
  const addTemplate = async (templateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createTemplate(templateData);

      if (response.success) {
        setTemplates([...templates, response.data]);
        return { success: true, data: response.data };
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create template";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update existing template
  const editTemplate = async (id, templateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateTemplate(id, templateData);

      if (response.success) {
        setTemplates(
          templates.map((template) =>
            template._id === id ? response.data : template
          )
        );
        return { success: true, data: response.data };
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update template";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Delete template
  const removeTemplate = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await deleteTemplate(id);

      if (response.success) {
        setTemplates(templates.filter((template) => template._id !== id));
        return { success: true, message: response.message };
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete template";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    templates,
    loading,
    error,
    fetchTemplates,
    fetchTemplateById,
    addTemplate,
    editTemplate,
    removeTemplate,
    clearError,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};
