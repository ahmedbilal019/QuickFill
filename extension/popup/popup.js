/**
 * QuickFill Extension Popup Script
 * Handles UI and user interactions
 */

console.log("🚀 QuickFill Popup Loaded");

// State
let currentUser = null;
let templates = [];
let profiles = [];
let selectedTemplate = null;
let selectedProfile = null;
let currentFormInfo = null;

// Initialize popup
document.addEventListener("DOMContentLoaded", init);

/**
 * Initialize the popup
 */
async function init() {
  console.log("🎯 Initializing popup...");

  // Check authentication
  const isAuth = await checkAuth();

  if (isAuth) {
    await loadMainScreen();
  } else {
    showScreen("login-screen");
  }

  // Setup event listeners
  setupEventListeners();
}

/**
 * Check if user is authenticated
 */
async function checkAuth() {
  try {
    const result = await chrome.storage.local.get([
      "quickfill_token",
      "quickfill_user",
    ]);

    if (result.quickfill_token && result.quickfill_user) {
      currentUser = result.quickfill_user;
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Auth check error:", error);
    return false;
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Login form
  document
    .getElementById("login-form")
    ?.addEventListener("submit", handleLogin);
  document
    .getElementById("show-register-btn")
    ?.addEventListener("click", () => showScreen("register-screen"));

  // Register form
  document
    .getElementById("register-form")
    ?.addEventListener("submit", handleRegister);
  document
    .getElementById("show-login-btn")
    ?.addEventListener("click", () => showScreen("login-screen"));

  // Main screen
  document
    .getElementById("logout-btn")
    ?.addEventListener("click", handleLogout);
  document
    .getElementById("template-select")
    ?.addEventListener("change", handleTemplateChange);
  document
    .getElementById("profile-select")
    ?.addEventListener("change", handleProfileChange);
  document
    .getElementById("fill-btn")
    ?.addEventListener("click", handleFillForm);
  document
    .getElementById("highlight-btn")
    ?.addEventListener("click", handleHighlightFields);
}

/**
 * Show a specific screen
 */
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId)?.classList.add("active");
}

/**
 * Handle login
 */
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const loginBtn = document.getElementById("login-btn");
  const errorDiv = document.getElementById("login-error");

  // Disable button
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";
  errorDiv.classList.remove("show");

  try {
    const response = await chrome.runtime.sendMessage({
      action: "LOGIN",
      data: { email, password },
    });

    if (response.success) {
      currentUser = response.user;
      await loadMainScreen();
    } else {
      throw new Error(response.error || "Login failed");
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    errorDiv.textContent = error.message;
    errorDiv.classList.add("show");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
}

/**
 * Handle registration
 */
async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const registerBtn = document.getElementById("register-btn");
  const errorDiv = document.getElementById("register-error");

  // Disable button
  registerBtn.disabled = true;
  registerBtn.textContent = "Creating account...";
  errorDiv.classList.remove("show");

  try {
    const response = await chrome.runtime.sendMessage({
      action: "REGISTER",
      data: { name, email, password },
    });

    if (response.success) {
      currentUser = response.user;
      await loadMainScreen();
    } else {
      throw new Error(response.error || "Registration failed");
    }
  } catch (error) {
    console.error("❌ Registration error:", error);
    errorDiv.textContent = error.message;
    errorDiv.classList.add("show");
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = "Create Account";
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  try {
    await chrome.runtime.sendMessage({ action: "LOGOUT" });
    currentUser = null;
    templates = [];
    profiles = [];
    showScreen("login-screen");
    showStatus("Logged out successfully", "success");
  } catch (error) {
    console.error("❌ Logout error:", error);
    showStatus("Logout failed", "error");
  }
}

/**
 * Load main screen
 */
async function loadMainScreen() {
  showScreen("loading-screen");

  try {
    // Load user info
    if (currentUser) {
      document.getElementById("user-name").textContent =
        currentUser.name || "User";
    }

    // Load templates
    await loadTemplates();

    // Load profiles
    await loadProfiles();

    // Get form info from current page
    await loadFormInfo();

    showScreen("main-screen");
  } catch (error) {
    console.error("❌ Error loading main screen:", error);
    showStatus("Failed to load data", "error");
    showScreen("main-screen");
  }
}

/**
 * Load templates
 */
async function loadTemplates() {
  try {
    const response = await chrome.runtime.sendMessage({
      action: "GET_TEMPLATES",
    });

    if (response.success) {
      templates = response.templates;
      populateTemplateSelect();
      populateRecentTemplates();
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("❌ Error loading templates:", error);
    templates = [];
  }
}

/**
 * Load profiles
 */
async function loadProfiles() {
  try {
    const response = await chrome.runtime.sendMessage({
      action: "GET_PROFILES",
    });

    if (response.success) {
      profiles = response.profiles;
      populateProfileSelect();
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("❌ Error loading profiles:", error);
    profiles = [];
  }
}

/**
 * Load form info from current page
 */
async function loadFormInfo() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) {
      throw new Error("No active tab");
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "GET_FORM_INFO",
    });

    if (response && response.success) {
      currentFormInfo = response;

      // Update UI
      const url = new URL(response.url);
      document.getElementById("current-url").textContent = url.hostname;
      document.getElementById("field-count").textContent = response.totalFields;

      // Enable fill button if template is selected
      if (selectedTemplate && response.totalFields > 0) {
        document.getElementById("fill-btn").disabled = false;
      }
    }
  } catch (error) {
    console.error("❌ Error loading form info:", error);
    document.getElementById("current-url").textContent = "No form detected";
    document.getElementById("field-count").textContent = "0";
  }
}

/**
 * Populate template select dropdown
 */
function populateTemplateSelect() {
  const select = document.getElementById("template-select");
  select.innerHTML = '<option value="">Select a template...</option>';

  templates.forEach((template) => {
    const option = document.createElement("option");
    option.value = template._id;
    option.textContent = `${template.templateName} (${
      Object.keys(template.fields || {}).length
    } fields)`;
    select.appendChild(option);
  });
}

/**
 * Populate profile select dropdown
 */
function populateProfileSelect() {
  const select = document.getElementById("profile-select");
  select.innerHTML = '<option value="">Select a profile (optional)...</option>';

  profiles.forEach((profile) => {
    const option = document.createElement("option");
    option.value = profile._id;
    option.textContent = profile.name;
    select.appendChild(option);
  });
}

/**
 * Populate recent templates
 */
function populateRecentTemplates() {
  const container = document.getElementById("recent-templates");

  // Sort by lastUsedAt
  const recentTemplates = [...templates]
    .filter((t) => t.lastUsedAt)
    .sort((a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt))
    .slice(0, 5);

  if (recentTemplates.length === 0) {
    container.innerHTML = '<p class="no-data">No recent templates</p>';
    return;
  }

  container.innerHTML = "";
  recentTemplates.forEach((template) => {
    const item = document.createElement("div");
    item.className = "recent-item";
    item.innerHTML = `
      <span class="recent-item-name">${template.templateName}</span>
      <span class="recent-item-fields">${
        Object.keys(template.fields || {}).length
      } fields</span>
    `;
    item.addEventListener("click", () => {
      document.getElementById("template-select").value = template._id;
      handleTemplateChange();
    });
    container.appendChild(item);
  });
}

/**
 * Handle template selection change
 */
function handleTemplateChange() {
  const select = document.getElementById("template-select");
  const templateId = select.value;

  if (templateId) {
    selectedTemplate = templates.find((t) => t._id === templateId);

    // Enable fill button if form has fields
    if (currentFormInfo && currentFormInfo.totalFields > 0) {
      document.getElementById("fill-btn").disabled = false;
    }
  } else {
    selectedTemplate = null;
    document.getElementById("fill-btn").disabled = true;
  }
}

/**
 * Handle profile selection change
 */
function handleProfileChange() {
  const select = document.getElementById("profile-select");
  const profileId = select.value;

  selectedProfile = profileId
    ? profiles.find((p) => p._id === profileId)
    : null;
}

/**
 * Handle fill form button click
 */
async function handleFillForm() {
  if (!selectedTemplate) {
    showStatus("Please select a template", "error");
    return;
  }

  const fillBtn = document.getElementById("fill-btn");
  fillBtn.disabled = true;
  fillBtn.textContent = "Filling...";

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Send fill command to content script
    await chrome.tabs.sendMessage(tab.id, {
      action: "FILL_FORM",
      template: selectedTemplate,
    });

    // Record template usage
    await chrome.runtime.sendMessage({
      action: "USE_TEMPLATE",
      templateId: selectedTemplate._id,
    });

    showStatus("Form filled successfully! ✅", "success");

    // Reload templates to update usage count
    await loadTemplates();
  } catch (error) {
    console.error("❌ Fill form error:", error);
    showStatus("Failed to fill form", "error");
  } finally {
    fillBtn.disabled = false;
    fillBtn.textContent = "🚀 Fill Form";
  }
}

/**
 * Handle highlight fields button click
 */
async function handleHighlightFields() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await chrome.tabs.sendMessage(tab.id, {
      action: "HIGHLIGHT_FIELDS",
    });

    showStatus("Fields highlighted! ✨", "success");
  } catch (error) {
    console.error("❌ Highlight error:", error);
    showStatus("Failed to highlight fields", "error");
  }
}

/**
 * Show status message
 */
function showStatus(message, type = "success") {
  const statusDiv = document.getElementById("status-message");
  if (!statusDiv) return;

  statusDiv.textContent = message;
  statusDiv.className = `status-message show ${type}`;

  setTimeout(() => {
    statusDiv.classList.remove("show");
  }, 3000);
}
