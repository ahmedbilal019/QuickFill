/**
 * QuickFill Content Script
 * Runs on every webpage to detect and fill forms
 */

console.log("QuickFill Content Script Loaded");

// State
let detectedForms = [];
let highlightedInputs = [];

/**
 * Initialize content script
 */
function init() {
  // Detect forms on page
  detectFormsOnPage();

  // Listen for messages from popup/background
  chrome.runtime.onMessage.addListener(handleMessage);

  // Detect forms on dynamic content changes
  observePageChanges();

  console.log("✅ QuickFill initialized on", window.location.href);
}

/**
 * Detect all forms on the current page
 */
function detectFormsOnPage() {
  const forms = document.querySelectorAll("form");
  detectedForms = [];

  forms.forEach((form, index) => {
    const inputs = getFormInputs(form);
    if (inputs.length > 0) {
      detectedForms.push({
        id: form.id || `form-${index}`,
        name: form.name || `Form ${index + 1}`,
        inputs: inputs,
        element: form,
      });
    }
  });

  // Also get orphan inputs (inputs not in forms)
  const orphanInputs = getOrphanInputs();
  if (orphanInputs.length > 0) {
    detectedForms.push({
      id: "orphan-inputs",
      name: "Inputs (no form)",
      inputs: orphanInputs,
    });
  }

  console.log(
    `📝 Detected ${
      detectedForms.length
    } forms with ${getTotalInputCount()} fillable fields`
  );

  return detectedForms;
}

/**
 * Get all fillable inputs from a form
 */
function getFormInputs(formElement) {
  const inputs = [];
  const inputElements = formElement.querySelectorAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="reset"]):not([type="file"]), textarea, select'
  );

  inputElements.forEach((input) => {
    if (!input.disabled && !input.readOnly) {
      inputs.push({
        element: input,
        name: input.name || input.id || "",
        id: input.id || "",
        type: input.type || "text",
        placeholder: input.placeholder || "",
        value: input.value || "",
      });
    }
  });

  return inputs;
}

/**
 * Get inputs not inside any form
 */
function getOrphanInputs() {
  const inputs = [];
  const allInputs = document.querySelectorAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="reset"]):not([type="file"]), textarea, select'
  );

  allInputs.forEach((input) => {
    if (!input.closest("form") && !input.disabled && !input.readOnly) {
      inputs.push({
        element: input,
        name: input.name || input.id || "",
        id: input.id || "",
        type: input.type || "text",
        placeholder: input.placeholder || "",
        value: input.value || "",
      });
    }
  });

  return inputs;
}

/**
 * Get total input count
 */
function getTotalInputCount() {
  return detectedForms.reduce((sum, form) => sum + form.inputs.length, 0);
}

/**
 * Handle messages from popup/background
 */
function handleMessage(message, sender, sendResponse) {
  console.log("📬 Message received:", message.action);

  switch (message.action) {
    case "GET_FORM_INFO":
      sendResponse({
        success: true,
        forms: detectedForms,
        totalFields: getTotalInputCount(),
        url: window.location.href,
      });
      break;

    case "FILL_FORM":
      fillForm(message.template);
      sendResponse({ success: true, message: "Form filled successfully" });
      break;

    case "HIGHLIGHT_FIELDS":
      highlightFields();
      sendResponse({ success: true });
      break;

    case "REMOVE_HIGHLIGHTS":
      removeHighlights();
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ success: false, message: "Unknown action" });
  }

  return true; // Keep message channel open
}

/**
 * Fill form with template data
 */
function fillForm(template) {
  console.log("Filling form with template:", template.templateName);

  const fields = template.fields || {};
  let filledCount = 0;

  // Get all inputs
  const allInputs = [];
  detectedForms.forEach((form) => {
    allInputs.push(...form.inputs);
  });

  // Match and fill fields
  for (const [fieldKey, fieldData] of Object.entries(fields)) {
    const matchedInput = findMatchingInput(fieldKey, allInputs);

    if (matchedInput) {
      const value = fieldData.value || fieldData || "";
      fillInput(matchedInput.element, value);
      filledCount++;
    }
  }

  console.log(`✅ Filled ${filledCount} fields`);

  // Show success notification
  showNotification(`✅ Filled ${filledCount} fields successfully!`);
}

/**
 * Find matching input for a field key
 */
function findMatchingInput(fieldKey, inputs) {
  const key = fieldKey.toLowerCase();

  // Try exact match first
  for (const input of inputs) {
    if (input.name.toLowerCase() === key || input.id.toLowerCase() === key) {
      return input;
    }
  }

  // Try partial match
  for (const input of inputs) {
    const name = input.name.toLowerCase();
    const id = input.id.toLowerCase();
    const placeholder = input.placeholder.toLowerCase();

    if (
      name.includes(key) ||
      key.includes(name) ||
      id.includes(key) ||
      key.includes(id) ||
      placeholder.includes(key)
    ) {
      return input;
    }
  }

  return null;
}

/**
 * Fill an input element
 */
function fillInput(inputElement, value) {
  if (!inputElement || !value) return;

  // Set value
  inputElement.value = value;

  // Trigger events to ensure validation/frameworks detect the change
  inputElement.dispatchEvent(new Event("input", { bubbles: true }));
  inputElement.dispatchEvent(new Event("change", { bubbles: true }));
  inputElement.dispatchEvent(new Event("blur", { bubbles: true }));

  // Visual feedback
  inputElement.style.backgroundColor = "#e7f3ff";
  setTimeout(() => {
    inputElement.style.backgroundColor = "";
  }, 1000);
}

/**
 * Highlight fillable fields
 */
function highlightFields() {
  const allInputs = [];
  detectedForms.forEach((form) => {
    allInputs.push(...form.inputs);
  });

  allInputs.forEach((input) => {
    if (input.element) {
      input.element.style.outline = "2px solid #667eea";
      input.element.style.outlineOffset = "2px";
      highlightedInputs.push(input.element);
    }
  });
}

/**
 * Remove highlights
 */
function removeHighlights() {
  highlightedInputs.forEach((input) => {
    input.style.outline = "";
    input.style.outlineOffset = "";
  });
  highlightedInputs = [];
}

/**
 * Show notification on page
 */
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 999999;
    font-family: Arial, sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Observe page changes for dynamic content
 */
function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    // Re-detect forms if new forms are added
    let shouldRedetect = false;

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Element node
          if (node.tagName === "FORM" || node.querySelector("form")) {
            shouldRedetect = true;
          }
        }
      });
    });

    if (shouldRedetect) {
      console.log("🔄 Page changed, re-detecting forms...");
      detectFormsOnPage();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
