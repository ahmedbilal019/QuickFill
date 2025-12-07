/**
 * Storage Utility for QuickFill Extension
 * Handles Chrome storage operations
 */

const StorageHelper = {
  /**
   * Save data to Chrome storage
   */
  async set(key, value) {
    try {
      await chrome.storage.local.set({ [key]: value });
      console.log(`✅ Saved ${key} to storage`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving ${key}:`, error);
      return false;
    }
  },

  /**
   * Get data from Chrome storage
   */
  async get(key) {
    try {
      const result = await chrome.storage.local.get([key]);
      return result[key] || null;
    } catch (error) {
      console.error(`❌ Error getting ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove data from Chrome storage
   */
  async remove(key) {
    try {
      await chrome.storage.local.remove([key]);
      console.log(`✅ Removed ${key} from storage`);
      return true;
    } catch (error) {
      console.error(`❌ Error removing ${key}:`, error);
      return false;
    }
  },

  /**
   * Clear all storage
   */
  async clear() {
    try {
      await chrome.storage.local.clear();
      console.log("✅ Storage cleared");
      return true;
    } catch (error) {
      console.error("❌ Error clearing storage:", error);
      return false;
    }
  },

  /**
   * Save authentication token
   */
  async saveToken(token) {
    return await this.set("quickfill_token", token);
  },

  /**
   * Get authentication token
   */
  async getToken() {
    return await this.get("quickfill_token");
  },

  /**
   * Save user data
   */
  async saveUser(user) {
    return await this.set("quickfill_user", user);
  },

  /**
   * Get user data
   */
  async getUser() {
    return await this.get("quickfill_user");
  },

  /**
   * Logout - clear all auth data
   */
  async logout() {
    await this.remove("quickfill_token");
    await this.remove("quickfill_user");
    await this.remove("quickfill_selected_profile");
    console.log("✅ User logged out");
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = StorageHelper;
}
