import { STORAGE_KEYS } from "./constants";

// Save token to localStorage
export const saveToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// Save user to localStorage
export const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

// Get user from localStorage
export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

// Remove user from localStorage
export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Clear all storage
export const clearStorage = () => {
  removeToken();
  removeUser();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Format date
export const formatDate = (date) => {
  if (!date) return "N/A";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(date).toLocaleDateString("en-US", options);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return "Never";

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(date);
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Capitalize first letter
export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return "?";

  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].charAt(0).toUpperCase();

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Generate random color
export const getRandomColor = () => {
  const colors = [
    "#00D9FF", // Cyan
    "#00FF88", // Green
    "#FF3366", // Pink
    "#FFB800", // Yellow
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#10B981", // Emerald
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: "Copied to clipboard!" };
  } catch (error) {
    return { success: false, message: "Failed to copy" };
  }
};

// Download JSON file
export const downloadJSON = (data, filename = "data.json") => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Debounce function
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Handle API error
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || "Something went wrong";
  } else if (error.request) {
    // No response from server
    return "Network error. Please check your connection.";
  } else {
    // Other errors
    return error.message || "An unexpected error occurred";
  }
};
