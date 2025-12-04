// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email" };
  }

  return { isValid: true, message: "" };
};

// Validate password
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters",
    };
  }

  if (password.length > 50) {
    return { isValid: false, message: "Password cannot exceed 50 characters" };
  }

  return { isValid: true, message: "" };
};

// Validate name
export const validateName = (name) => {
  if (!name) {
    return { isValid: false, message: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters" };
  }

  if (name.length > 50) {
    return { isValid: false, message: "Name cannot exceed 50 characters" };
  }

  return { isValid: true, message: "" };
};

// Validate template name - FIXED VERSION
export const validateTemplateName = (templateName) => {
  // First check if it exists
  if (!templateName) {
    return { isValid: false, message: "Template name is required" };
  }

  // Trim and check length
  const trimmed = templateName.trim();

  if (trimmed.length === 0) {
    return { isValid: false, message: "Template name is required" };
  }

  if (trimmed.length < 2) {
    return {
      isValid: false,
      message: "Template name must be at least 2 characters",
    };
  }

  if (templateName.length > 100) {
    return {
      isValid: false,
      message: "Template name cannot exceed 100 characters",
    };
  }

  return { isValid: true, message: "" };
};

// Validate profile name
export const validateProfileName = (profileName) => {
  if (!profileName) {
    return { isValid: false, message: "Profile name is required" };
  }

  const trimmed = profileName.trim();

  if (trimmed.length === 0) {
    return { isValid: false, message: "Profile name is required" };
  }

  if (trimmed.length < 2) {
    return {
      isValid: false,
      message: "Profile name must be at least 2 characters",
    };
  }

  if (profileName.length > 50) {
    return {
      isValid: false,
      message: "Profile name cannot exceed 50 characters",
    };
  }

  return { isValid: true, message: "" };
};

// Validate template fields
export const validateTemplateFields = (fields) => {
  if (!fields || typeof fields !== "object") {
    return { isValid: false, message: "Template fields must be an object" };
  }

  if (Object.keys(fields).length === 0) {
    return { isValid: false, message: "Template must have at least one field" };
  }

  return { isValid: true, message: "" };
};

// Validate phone number (basic)
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]+$/;

  if (!phone) {
    return { isValid: false, message: "Phone number is required" };
  }

  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: "Please enter a valid phone number" };
  }

  if (phone.replace(/\D/g, "").length < 10) {
    return {
      isValid: false,
      message: "Phone number must be at least 10 digits",
    };
  }

  return { isValid: true, message: "" };
};

// Validate URL
export const validateUrl = (url) => {
  const urlRegex =
    /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-._~:?#[\]@!$&'()*+,;=%]*)?$/;

  if (!url) {
    return { isValid: false, message: "URL is required" };
  }

  if (!urlRegex.test(url)) {
    return { isValid: false, message: "Please enter a valid URL" };
  }

  return { isValid: true, message: "" };
};
