// API Configuration for QuickFill Extension
const API_CONFIG = {
  BASE_URL: "http://localhost:4010/api",
  TIMEOUT: 10000,

  ENDPOINTS: {
    // Auth
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GET_ME: "/auth/me",

    // Templates
    GET_TEMPLATES: "/templates",
    GET_TEMPLATE_BY_ID: (id) => `/templates/${id}`,
    USE_TEMPLATE: (id) => `/templates/${id}/use`,

    // Profiles
    GET_PROFILES: "/profiles",
    GET_PROFILE_BY_ID: (id) => `/profiles/${id}`,
  },

  STORAGE_KEYS: {
    TOKEN: "quickfill_token",
    USER: "quickfill_user",
    SELECTED_PROFILE: "quickfill_selected_profile",
    API_URL: "quickfill_api_url",
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = API_CONFIG;
}
