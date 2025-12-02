import validator from "validator";

// Validate email format
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }
  if (!validator.isEmail(email)) {
    return { isValid: false, message: "Please provide a valid email" };
  }
  return { isValid: true };
};

// Validate password strength
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
  return { isValid: true };
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
  return { isValid: true };
};

// Validate template name
export const validateTemplateName = (templateName) => {
  if (!templateName) {
    return { isValid: false, message: "Template name is required" };
  }
  if (templateName.trim().length < 2) {
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
  return { isValid: true };
};

// Validate template fields (must be an object with at least one field)
export const validateTemplateFields = (fields) => {
  if (!fields || typeof fields !== "object") {
    return { isValid: false, message: "Template fields must be an object" };
  }
  if (Object.keys(fields).length === 0) {
    return { isValid: false, message: "Template must have at least one field" };
  }
  return { isValid: true };
};

// Validate MongoDB ObjectId
export const validateObjectId = (id) => {
  if (!validator.isMongoId(id)) {
    return { isValid: false, message: "Invalid ID format" };
  }
  return { isValid: true };
};
