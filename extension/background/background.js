// /**
//  * QuickFill Background Service Worker
//  * Handles API calls and communication between popup and content scripts
//  */

// console.log("🚀 QuickFill Background Service Worker Started");

// // API Configuration
// const API_BASE_URL = "http://localhost:4010/api";

// /**
//  * Listen for messages from popup and content scripts
//  */
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("📬 Background received message:", message.action);

//   switch (message.action) {
//     case "LOGIN":
//       handleLogin(message.data)
//         .then(sendResponse)
//         .catch((error) =>
//           sendResponse({ success: false, error: error.message })
//         );
//       return true; // Keep channel open for async response

//     case "REGISTER":
//       handleRegister(message.data)
//         .then(sendResponse)
//         .catch((error) =>
//           sendResponse({ success: false, error: error.message })
//         );
//       return true;

//     case "LOGOUT":
//       handleLogout()
//         .then(sendResponse)
//         .catch((error) =>
//           sendResponse({ success: false, error: error.message })
//         );
//       return true;

//     case "GET_USER":
//       handleGetUser()
//         .then(sendResponse)
//         .catch((error) =>
//           sendResponse({ success: false, error: error.message })
//         );
//       return true;

//     case "GET_TEMPLATES":
//       handleGetTemplates()
//         .then(sendResponse)
//         .catch((error) =>
//           sendResponse({ success: false, error: error.message })
//         );
//       return true;

//     case "GET_PROFILES":
//       handleGetProfiles()
//         .then(sendResponse)
//         .catch((error) =>
//           sendResponse({ success: false, error: error.message })
//         );
//       return true;

//     case "USE_TEMPLATE":
//       handleUseTemplate(message.templateId)
//         .then(sendResponse)
//         .catch((error) =>
//           sendResponse({ success: false, error: error.message })
//         );
//       return true;

//     default:
//       sendResponse({ success: false, error: "Unknown action" });
//   }

//   return true;
// });

// /**
//  * Handle user login
//  */
// async function handleLogin(credentials) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(credentials),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Login failed");
//     }

//     // Save token and user to storage
//     await chrome.storage.local.set({
//       quickfill_token: data.token,
//       quickfill_user: data.user,
//     });

//     console.log("✅ Login successful");

//     return {
//       success: true,
//       token: data.token,
//       user: data.user,
//     };
//   } catch (error) {
//     console.error("❌ Login error:", error);
//     throw error;
//   }
// }

// /**
//  * Handle user registration
//  */
// async function handleRegister(userData) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/auth/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(userData),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Registration failed");
//     }

//     // Save token and user to storage
//     await chrome.storage.local.set({
//       quickfill_token: data.token,
//       quickfill_user: data.user,
//     });

//     console.log("✅ Registration successful");

//     return {
//       success: true,
//       token: data.token,
//       user: data.user,
//     };
//   } catch (error) {
//     console.error("❌ Registration error:", error);
//     throw error;
//   }
// }

// /**
//  * Handle logout
//  */
// async function handleLogout() {
//   try {
//     await chrome.storage.local.remove([
//       "quickfill_token",
//       "quickfill_user",
//       "quickfill_selected_profile",
//     ]);

//     console.log("✅ Logout successful");

//     return { success: true };
//   } catch (error) {
//     console.error("❌ Logout error:", error);
//     throw error;
//   }
// }

// /**
//  * Get current user
//  */
// async function handleGetUser() {
//   try {
//     const token = await getToken();
//     if (!token) {
//       throw new Error("Not authenticated");
//     }

//     const response = await fetch(`${API_BASE_URL}/auth/me`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to get user");
//     }

//     return {
//       success: true,
//       user: data,
//     };
//   } catch (error) {
//     console.error("❌ Get user error:", error);
//     throw error;
//   }
// }

// /**
//  * Get all templates
//  */
// async function handleGetTemplates() {
//   try {
//     const token = await getToken();
//     if (!token) {
//       throw new Error("Not authenticated");
//     }

//     const response = await fetch(`${API_BASE_URL}/templates`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to get templates");
//     }

//     console.log(`✅ Fetched ${data.length} templates`);

//     return {
//       success: true,
//       templates: data,
//     };
//   } catch (error) {
//     console.error("❌ Get templates error:", error);
//     throw error;
//   }
// }

// /**
//  * Get all profiles
//  */
// async function handleGetProfiles() {
//   try {
//     const token = await getToken();
//     if (!token) {
//       throw new Error("Not authenticated");
//     }

//     const response = await fetch(`${API_BASE_URL}/profiles`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to get profiles");
//     }

//     console.log(`✅ Fetched ${data.length} profiles`);

//     return {
//       success: true,
//       profiles: data,
//     };
//   } catch (error) {
//     console.error("❌ Get profiles error:", error);
//     throw error;
//   }
// }

// /**
//  * Use template (increment usage count)
//  */
// async function handleUseTemplate(templateId) {
//   try {
//     const token = await getToken();
//     if (!token) {
//       throw new Error("Not authenticated");
//     }

//     const response = await fetch(
//       `${API_BASE_URL}/templates/${templateId}/use`,
//       {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to use template");
//     }

//     console.log(`✅ Template ${templateId} usage recorded`);

//     return {
//       success: true,
//       template: data,
//     };
//   } catch (error) {
//     console.error("❌ Use template error:", error);
//     throw error;
//   }
// }

// /**
//  * Get token from storage
//  */
// async function getToken() {
//   const result = await chrome.storage.local.get(["quickfill_token"]);
//   return result.quickfill_token || null;
// }

// /**
//  * Handle extension installation
//  */
// chrome.runtime.onInstalled.addListener((details) => {
//   if (details.reason === "install") {
//     console.log("🎉 QuickFill Extension Installed!");
//     // Open welcome page or popup
//     chrome.tabs.create({ url: "popup/popup.html" });
//   } else if (details.reason === "update") {
//     console.log("🔄 QuickFill Extension Updated!");
//   }
// });

// /**
//  * Handle extension icon click
//  */
// chrome.action.onClicked.addListener((tab) => {
//   console.log("🖱️ Extension icon clicked");
// });

//////////////////////////////////////////////////////////////////////////
/**
 * QuickFill Background Service Worker - DIAGNOSTIC VERSION
 * Handles API calls and communication between popup and content scripts
 */

console.log("🚀 QuickFill Background Service Worker Started");

// API Configuration
const API_BASE_URL = "http://localhost:4010/api";

/**
 * Listen for messages from popup and content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📬 Background received message:", message.action);

  switch (message.action) {
    case "LOGIN":
      handleLogin(message.data)
        .then(sendResponse)
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "REGISTER":
      handleRegister(message.data)
        .then(sendResponse)
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "LOGOUT":
      handleLogout()
        .then(sendResponse)
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "GET_USER":
      handleGetUser()
        .then(sendResponse)
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "GET_TEMPLATES":
      handleGetTemplates()
        .then(sendResponse)
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "GET_PROFILES":
      handleGetProfiles()
        .then(sendResponse)
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "USE_TEMPLATE":
      handleUseTemplate(message.templateId)
        .then(sendResponse)
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "DEBUG_STORAGE":
      chrome.storage.local.get(null, (items) => {
        console.log("🔍 ALL STORAGE:", items);
        sendResponse(items);
      });
      return true;

    default:
      sendResponse({ success: false, error: "Unknown action" });
  }

  return true;
});

/**
 * Handle user login
 */
async function handleLogin(credentials) {
  console.log("🔐 === LOGIN START ===");
  console.log("📧 Email:", credentials.email);

  try {
    const url = `${API_BASE_URL}/auth/login`;
    console.log("📡 API URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response ok:", response.ok);

    const data = await response.json();
    console.log("📦 Response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("❌ Login failed:", data.message);
      throw new Error(data.message || "Login failed");
    }

    // Check if we have a token
    if (!data.token) {
      console.error("❌ NO TOKEN IN RESPONSE!");
      console.error("Response structure:", Object.keys(data));
      throw new Error("No token received from server");
    }

    console.log("✅ Token received:", data.token.substring(0, 20) + "...");
    console.log("👤 User data:", data.user);

    // Save to storage
    console.log("💾 Saving to storage...");
    await chrome.storage.local.set({
      quickfill_token: data.token,
      quickfill_user: data.user,
    });

    // Verify it was saved
    const verification = await chrome.storage.local.get([
      "quickfill_token",
      "quickfill_user",
    ]);
    console.log("🔍 Verification:");
    console.log("  - Token saved:", !!verification.quickfill_token);
    console.log("  - User saved:", !!verification.quickfill_user);
    console.log(
      "  - Token value:",
      verification.quickfill_token
        ? verification.quickfill_token.substring(0, 20) + "..."
        : "NONE"
    );

    console.log("🔐 === LOGIN SUCCESS ===");

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("❌ === LOGIN FAILED ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
}

/**
 * Handle user registration
 */
async function handleRegister(userData) {
  console.log("📝 Attempting registration");

  try {
    const url = `${API_BASE_URL}/auth/register`;
    console.log("📡 Calling API:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("📥 Response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Save token and user to storage
    await chrome.storage.local.set({
      quickfill_token: data.token,
      quickfill_user: data.user,
    });

    console.log("✅ Registration successful");

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("❌ Registration error:", error);
    throw error;
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  try {
    await chrome.storage.local.remove([
      "quickfill_token",
      "quickfill_user",
      "quickfill_selected_profile",
    ]);

    console.log("✅ Logout successful");

    return { success: true };
  } catch (error) {
    console.error("❌ Logout error:", error);
    throw error;
  }
}

/**
 * Get current user
 */
async function handleGetUser() {
  try {
    const token = await getToken();
    console.log("🔑 Token for GET_USER:", token ? "Found" : "Not found");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const url = `${API_BASE_URL}/auth/me`;
    console.log("📡 Calling API:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📥 Response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get user");
    }

    return {
      success: true,
      user: data,
    };
  } catch (error) {
    console.error("❌ Get user error:", error);
    throw error;
  }
}

/**
 * Get all templates
 */
async function handleGetTemplates() {
  console.log("📋 === GET TEMPLATES START ===");

  try {
    // Get ALL storage to see what we have
    const allStorage = await chrome.storage.local.get(null);
    console.log("🔍 All storage keys:", Object.keys(allStorage));
    console.log("🔍 Full storage:", allStorage);

    const token = allStorage.quickfill_token;

    console.log("🔑 Token exists:", !!token);
    console.log("🔑 Token type:", typeof token);
    console.log(
      "🔑 Token value:",
      token ? token.substring(0, 30) + "..." : "NULL/UNDEFINED"
    );

    if (!token) {
      console.error("❌ NO TOKEN - User is not authenticated");
      throw new Error("Not authenticated - no token found");
    }

    const url = `${API_BASE_URL}/templates`;
    console.log("📡 Fetching from:", url);
    console.log(
      "📤 Authorization header:",
      `Bearer ${token.substring(0, 20)}...`
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response ok:", response.ok);
    console.log("📥 Response headers:", [...response.headers.entries()]);

    const data = await response.json();
    console.log("📦 Response data:", data);

    if (!response.ok) {
      console.error("❌ API Error:", data);
      throw new Error(data.message || "Failed to get templates");
    }

    console.log(
      `✅ Got ${Array.isArray(data) ? data.length : "unknown"} templates`
    );
    console.log("📋 === GET TEMPLATES SUCCESS ===");

    return {
      success: true,
      templates: data,
    };
  } catch (error) {
    console.error("❌ === GET TEMPLATES FAILED ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}

/**
 * Get all profiles
 */
async function handleGetProfiles() {
  console.log("👥 === GET PROFILES START ===");

  try {
    const allStorage = await chrome.storage.local.get(null);
    const token = allStorage.quickfill_token;

    console.log("🔑 Token exists:", !!token);

    if (!token) {
      console.error("❌ NO TOKEN");
      throw new Error("Not authenticated - no token found");
    }

    const url = `${API_BASE_URL}/profiles`;
    console.log("📡 Fetching from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📥 Response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ API Error:", data);
      throw new Error(data.message || "Failed to get profiles");
    }

    console.log(
      `✅ Got ${Array.isArray(data) ? data.length : "unknown"} profiles`
    );
    console.log("👥 === GET PROFILES SUCCESS ===");

    return {
      success: true,
      profiles: data,
    };
  } catch (error) {
    console.error("❌ === GET PROFILES FAILED ===");
    console.error("Error:", error.message);
    throw error;
  }
}

/**
 * Use template (increment usage count)
 */
async function handleUseTemplate(templateId) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(
      `${API_BASE_URL}/templates/${templateId}/use`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to use template");
    }

    console.log(`✅ Template ${templateId} usage recorded`);

    return {
      success: true,
      template: data,
    };
  } catch (error) {
    console.error("❌ Use template error:", error);
    throw error;
  }
}

/**
 * Get token from storage
 */
async function getToken() {
  const result = await chrome.storage.local.get(["quickfill_token"]);
  return result.quickfill_token || null;
}

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("🎉 QuickFill Extension Installed!");
  } else if (details.reason === "update") {
    console.log("🔄 QuickFill Extension Updated!");
  }
});

/**
 * Handle extension icon click
 */
chrome.action.onClicked.addListener((tab) => {
  console.log("🖱️ Extension icon clicked");
});
