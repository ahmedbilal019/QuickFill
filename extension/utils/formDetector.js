/**
 * Form Detector Utility
 * Detects and analyzes forms on web pages
 */

const FormDetector = {
  /**
   * Detect all forms on the current page
   */
  detectForms() {
    const forms = document.querySelectorAll("form");
    const detectedForms = [];

    forms.forEach((form, index) => {
      const formData = this.analyzeForm(form, index);
      if (formData.inputs.length > 0) {
        detectedForms.push(formData);
      }
    });

    // Also check for inputs outside forms
    const orphanInputs = this.detectOrphanInputs();
    if (orphanInputs.length > 0) {
      detectedForms.push({
        id: "orphan-inputs",
        name: "Inputs (no form)",
        inputs: orphanInputs,
        inputCount: orphanInputs.length,
      });
    }

    return detectedForms;
  },

  /**
   * Analyze a single form
   */
  analyzeForm(formElement, index) {
    const inputs = this.getFormInputs(formElement);

    return {
      id: formElement.id || `form-${index}`,
      name: formElement.name || formElement.id || `Form ${index + 1}`,
      action: formElement.action || "",
      method: formElement.method || "get",
      inputs: inputs,
      inputCount: inputs.length,
      element: formElement,
    };
  },

  /**
   * Get all fillable inputs from a form
   */
  getFormInputs(formElement) {
    const inputs = [];
    const inputElements = formElement.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]), textarea, select'
    );

    inputElements.forEach((input) => {
      // Skip if input is disabled or readonly
      if (input.disabled || input.readOnly) {
        return;
      }

      const inputData = this.analyzeInput(input);
      if (inputData) {
        inputs.push(inputData);
      }
    });

    return inputs;
  },

  /**
   * Analyze a single input element
   */
  analyzeInput(inputElement) {
    const label = this.getInputLabel(inputElement);
    const type = inputElement.type || "text";

    return {
      element: inputElement,
      name: inputElement.name || inputElement.id || "",
      id: inputElement.id || "",
      type: type,
      placeholder: inputElement.placeholder || "",
      value: inputElement.value || "",
      label: label ? label.textContent.trim() : "",
      required: inputElement.required,
      tagName: inputElement.tagName.toLowerCase(),
    };
  },

  /**
   * Get label for an input element
   */
  getInputLabel(inputElement) {
    // Check for label with 'for' attribute
    if (inputElement.id) {
      const label = document.querySelector(`label[for="${inputElement.id}"]`);
      if (label) return label;
    }

    // Check for parent label
    let parent = inputElement.parentElement;
    while (parent && parent.tagName !== "FORM") {
      if (parent.tagName === "LABEL") {
        return parent;
      }
      parent = parent.parentElement;
    }

    // Check for adjacent label
    const prevSibling = inputElement.previousElementSibling;
    if (prevSibling && prevSibling.tagName === "LABEL") {
      return prevSibling;
    }

    return null;
  },

  /**
   * Detect inputs that are not inside any form
   */
  detectOrphanInputs() {
    const inputs = [];
    const allInputs = document.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]), textarea, select'
    );

    allInputs.forEach((input) => {
      // Check if input is inside a form
      const isInsideForm = input.closest("form") !== null;

      if (!isInsideForm && !input.disabled && !input.readOnly) {
        const inputData = this.analyzeInput(input);
        if (inputData) {
          inputs.push(inputData);
        }
      }
    });

    return inputs;
  },

  /**
   * Get all fillable inputs on the page (form + orphan)
   */
  getAllInputs() {
    const allInputs = [];
    const forms = this.detectForms();

    forms.forEach((form) => {
      allInputs.push(...form.inputs);
    });

    return allInputs;
  },

  /**
   * Highlight fillable inputs on the page
   */
  highlightInputs(inputs) {
    inputs.forEach((inputData) => {
      const input = inputData.element;
      if (input) {
        input.style.outline = "2px solid #667eea";
        input.style.outlineOffset = "2px";
      }
    });
  },

  /**
   * Remove highlights from inputs
   */
  removeHighlights(inputs) {
    inputs.forEach((inputData) => {
      const input = inputData.element;
      if (input) {
        input.style.outline = "";
        input.style.outlineOffset = "";
      }
    });
  },

  /**
   * Count fillable fields on the page
   */
  countFillableFields() {
    const forms = this.detectForms();
    let totalFields = 0;

    forms.forEach((form) => {
      totalFields += form.inputCount;
    });

    return totalFields;
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = FormDetector;
}
