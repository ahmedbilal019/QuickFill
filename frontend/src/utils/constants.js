// API Configuration
export const API_BASE_URL = "http://localhost:4010/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_ME: `${API_BASE_URL}/auth/me`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,

  // Templates
  TEMPLATES: `${API_BASE_URL}/templates`,
  TEMPLATE_BY_ID: (id) => `${API_BASE_URL}/templates/${id}`,
  USE_TEMPLATE: (id) => `${API_BASE_URL}/templates/${id}/use`,

  // Profiles
  PROFILES: `${API_BASE_URL}/profiles`,
  PROFILE_BY_ID: (id) => `${API_BASE_URL}/profiles/${id}`,
  ADD_TEMPLATE_TO_PROFILE: (profileId, templateId) =>
    `${API_BASE_URL}/profiles/${profileId}/templates/${templateId}`,
  REMOVE_TEMPLATE_FROM_PROFILE: (profileId, templateId) =>
    `${API_BASE_URL}/profiles/${profileId}/templates/${templateId}`,
};

// Template Categories
export const TEMPLATE_CATEGORIES = [
  { value: "personal", label: "Personal", icon: "👤" },
  { value: "work", label: "Work", icon: "💼" },
  { value: "student", label: "Student", icon: "🎓" },
  { value: "job", label: "Job Application", icon: "📝" },
  { value: "other", label: "Other", icon: "📋" },
];

// Profile Types
export const PROFILE_TYPES = [
  { value: "personal", label: "Personal", icon: "👤" },
  { value: "work", label: "Work", icon: "💼" },
  { value: "student", label: "Student", icon: "🎓" },
  { value: "freelance", label: "Freelance", icon: "💻" },
  { value: "other", label: "Other", icon: "📋" },
];

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "quickfill_token",
  USER: "quickfill_user",
};

// Form Field Types
export const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "url", label: "URL" },
  { value: "textarea", label: "Long Text" },
];

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: "Login successful! Welcome back! 🎉",
  REGISTER_SUCCESS: "Account created successfully! 🎉",
  LOGOUT_SUCCESS: "Logged out successfully! 👋",
  TEMPLATE_CREATED: "Template created successfully! ✅",
  TEMPLATE_UPDATED: "Template updated successfully! ✅",
  TEMPLATE_DELETED: "Template deleted successfully! 🗑️",
  PROFILE_CREATED: "Profile created successfully! ✅",
  PROFILE_UPDATED: "Profile updated successfully! ✅",
  PROFILE_DELETED: "Profile deleted successfully! 🗑️",
  ERROR: "Something went wrong! Please try again. ❌",
};
