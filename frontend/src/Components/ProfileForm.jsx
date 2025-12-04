import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import { PROFILE_TYPES } from "../utils/constants";
import { validateProfileName } from "../utils/validation";

/**
 * ProfileForm Component
 * Form for creating or editing profiles
 */
const ProfileForm = ({ initialData = null, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "personal",
    isDefault: initialData?.isDefault || false,
    data: initialData?.data || {},
  });

  const [errors, setErrors] = useState({});
  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    // Load custom fields from initial data
    if (initialData?.data) {
      const fields = Object.entries(initialData.data).map(([key, value]) => ({
        key,
        value,
      }));
      setCustomFields(fields);
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Add custom field
  const addCustomField = () => {
    setCustomFields([...customFields, { key: "", value: "" }]);
  };

  // Remove custom field
  const removeCustomField = (index) => {
    const updated = customFields.filter((_, i) => i !== index);
    setCustomFields(updated);
  };

  // Update custom field
  const updateCustomField = (index, field, value) => {
    const updated = [...customFields];
    updated[index][field] = value;
    setCustomFields(updated);
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    const nameValidation = validateProfileName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }

    if (!formData.type) {
      newErrors.type = "Profile type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Build data object from custom fields
    const dataObject = {};
    customFields.forEach((field) => {
      if (field.key && field.value) {
        dataObject[field.key] = field.value;
      }
    });

    // Transform data to match backend schema
    const submissionData = {
      profileName: formData.name, // Backend expects 'profileName' not 'name'
      profileType: formData.type, // Backend expects 'profileType' not 'type'
      isDefault: formData.isDefault,
      // Note: Backend doesn't have 'description' or 'data' fields based on the model
      // If you want to store custom data, you need to add it to the backend model
    };

    console.log("Submitting profile:", submissionData); // DEBUG

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Name */}
      <Input
        label="Profile Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="e.g., Professional Profile"
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of this profile"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
        />
      </div>

      {/* Profile Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profile Type <span className="text-red-500">*</span>
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {PROFILE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type}</p>
        )}
      </div>

      {/* Set as Default */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Set as default profile
        </label>
      </div>

      {/* Custom Fields Section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Profile Data</h3>
          <Button
            type="button"
            onClick={addCustomField}
            variant="outline"
            size="sm"
          >
            + Add Field
          </Button>
        </div>

        {customFields.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No custom fields added. Click "Add Field" to add data to this
            profile.
          </p>
        ) : (
          <div className="space-y-3">
            {customFields.map((field, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
              >
                <input
                  type="text"
                  value={field.key}
                  onChange={(e) =>
                    updateCustomField(index, "key", e.target.value)
                  }
                  placeholder="Field name (e.g., phone)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) =>
                    updateCustomField(index, "value", e.target.value)
                  }
                  placeholder="Field value"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeCustomField(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {initialData ? "Update Profile" : "Create Profile"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
