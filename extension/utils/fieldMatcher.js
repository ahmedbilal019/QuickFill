/**
 * Field Matcher Utility
 * Intelligently matches template fields to form inputs
 */

const FieldMatcher = {
  /**
   * Common field name patterns for matching
   */
  FIELD_PATTERNS: {
    name: [
      "name",
      "fullname",
      "full_name",
      "username",
      "user_name",
      "your_name",
      "applicant_name",
    ],
    firstName: ["firstname", "first_name", "fname", "given_name", "forename"],
    lastName: ["lastname", "last_name", "lname", "surname", "family_name"],
    email: ["email", "e_mail", "mail", "email_address", "your_email"],
    phone: [
      "phone",
      "telephone",
      "tel",
      "mobile",
      "cell",
      "phonenumber",
      "phone_number",
      "contact",
    ],
    address: ["address", "street", "street_address", "addr", "location"],
    city: ["city", "town", "municipality"],
    state: ["state", "province", "region"],
    zip: ["zip", "zipcode", "postal", "postalcode", "postcode"],
    country: ["country", "nation"],
    company: ["company", "organization", "employer", "company_name"],
    position: ["position", "job_title", "title", "role", "designation"],
    experience: ["experience", "years", "exp"],
    education: ["education", "degree", "qualification", "school", "university"],
    date: ["date", "dob", "birth_date", "birthday"],
    website: ["website", "url", "web", "site"],
    linkedin: ["linkedin", "linkedin_url", "profile_url"],
    github: ["github", "github_url"],
  },

  /**
   * Match a template field to a form input
   */
  matchField(templateFieldKey, inputElement) {
    const fieldKey = templateFieldKey.toLowerCase().trim();

    // Get input attributes
    const inputName = (inputElement.name || "").toLowerCase();
    const inputId = (inputElement.id || "").toLowerCase();
    const inputPlaceholder = (inputElement.placeholder || "").toLowerCase();
    const inputType = (inputElement.type || "text").toLowerCase();

    // Get label text if exists
    const label = this.getInputLabel(inputElement);
    const labelText = (label?.textContent || "").toLowerCase();

    // Direct match
    if (inputName === fieldKey || inputId === fieldKey) {
      return true;
    }

    // Check against patterns
    for (const [pattern, variations] of Object.entries(this.FIELD_PATTERNS)) {
      if (
        fieldKey.includes(pattern) ||
        variations.some((v) => fieldKey.includes(v))
      ) {
        // Check if input matches this pattern
        if (
          variations.some(
            (v) =>
              inputName.includes(v) ||
              inputId.includes(v) ||
              inputPlaceholder.includes(v) ||
              labelText.includes(v)
          )
        ) {
          return true;
        }
      }
    }

    // Partial match in name, id, or placeholder
    if (
      inputName.includes(fieldKey) ||
      fieldKey.includes(inputName) ||
      inputId.includes(fieldKey) ||
      fieldKey.includes(inputId)
    ) {
      return true;
    }

    // Check label text
    if (
      labelText &&
      (labelText.includes(fieldKey) || fieldKey.includes(labelText))
    ) {
      return true;
    }

    return false;
  },

  /**
   * Get label element for an input
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
   * Find best matching input for a template field
   */
  findMatchingInput(templateFieldKey, formInputs) {
    const matches = [];

    formInputs.forEach((input) => {
      if (this.matchField(templateFieldKey, input)) {
        matches.push({
          element: input,
          confidence: this.calculateMatchConfidence(templateFieldKey, input),
        });
      }
    });

    // Sort by confidence and return best match
    matches.sort((a, b) => b.confidence - a.confidence);
    return matches.length > 0 ? matches[0].element : null;
  },

  /**
   * Calculate match confidence score (0-100)
   */
  calculateMatchConfidence(templateFieldKey, inputElement) {
    let score = 0;
    const fieldKey = templateFieldKey.toLowerCase().trim();
    const inputName = (inputElement.name || "").toLowerCase();
    const inputId = (inputElement.id || "").toLowerCase();

    // Exact match = highest confidence
    if (inputName === fieldKey || inputId === fieldKey) {
      return 100;
    }

    // Contains match
    if (inputName.includes(fieldKey) || inputId.includes(fieldKey)) {
      score += 80;
    }

    // Reverse contains
    if (fieldKey.includes(inputName) || fieldKey.includes(inputId)) {
      score += 60;
    }

    // Label match
    const label = this.getInputLabel(inputElement);
    if (label) {
      const labelText = label.textContent.toLowerCase();
      if (labelText.includes(fieldKey)) {
        score += 40;
      }
    }

    // Type match
    if (fieldKey.includes("email") && inputElement.type === "email") {
      score += 20;
    }
    if (fieldKey.includes("phone") && inputElement.type === "tel") {
      score += 20;
    }

    return Math.min(score, 100);
  },

  /**
   * Match all template fields to form inputs
   */
  matchAllFields(templateFields, formInputs) {
    const matches = {};

    for (const [fieldKey, fieldData] of Object.entries(templateFields)) {
      const matchedInput = this.findMatchingInput(fieldKey, formInputs);
      if (matchedInput) {
        matches[fieldKey] = {
          input: matchedInput,
          value: fieldData.value || "",
          confidence: this.calculateMatchConfidence(fieldKey, matchedInput),
        };
      }
    }

    return matches;
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = FieldMatcher;
}
