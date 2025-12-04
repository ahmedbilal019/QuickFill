import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import FieldInput from "./FieldInput";
import { TEMPLATE_CATEGORIES, FIELD_TYPES } from "../utils/constants";

/**
 * TemplateForm Component
 * Form for creating or editing templates
 */
const TemplateForm = ({ initialData = null, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    fields: initialData?.fields || {},
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Track which fields have been touched
  const [newField, setNewField] = useState({
    key: "",
    label: "",
    type: "text",
    required: false,
    placeholder: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Mark field as touched
    setTouched({ ...touched, [name]: true });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle blur - validate on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  // Add new field to template
  const handleAddField = () => {
    if (!newField.key || !newField.label) {
      alert("Field key and label are required!");
      return;
    }

    if (formData.fields[newField.key]) {
      alert("Field key already exists!");
      return;
    }

    setFormData({
      ...formData,
      fields: {
        ...formData.fields,
        [newField.key]: {
          label: newField.label,
          type: newField.type,
          required: newField.required,
          placeholder: newField.placeholder,
          value: "",
        },
      },
    });

    // Reset new field form
    setNewField({
      key: "",
      label: "",
      type: "text",
      required: false,
      placeholder: "",
    });

    // Clear fields error
    if (errors.fields) {
      setErrors({ ...errors, fields: "" });
    }
  };

  // Remove field
  const handleRemoveField = (fieldKey) => {
    const updatedFields = { ...formData.fields };
    delete updatedFields[fieldKey];
    setFormData({ ...formData, fields: updatedFields });
  };

  // Update field value
  const handleFieldValueChange = (fieldKey, value) => {
    setFormData({
      ...formData,
      fields: {
        ...formData.fields,
        [fieldKey]: {
          ...formData.fields[fieldKey],
          value,
        },
      },
    });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    // Validate template name
    const trimmedName = formData.name?.trim() || "";

    console.log("Validating name:", formData.name); // DEBUG
    console.log("Trimmed name:", trimmedName); // DEBUG
    console.log("Trimmed length:", trimmedName.length); // DEBUG

    if (trimmedName.length === 0) {
      newErrors.name = "Template name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Template name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Template name cannot exceed 100 characters";
    }

    // Validate category
    if (!formData.category || formData.category === "") {
      newErrors.category = "Category is required";
    }

    // Validate fields
    if (Object.keys(formData.fields).length === 0) {
      newErrors.fields = "At least one field is required";
    }

    console.log("Validation errors:", newErrors); // DEBUG

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form submitted with data:", formData); // DEBUG

    if (!validate()) {
      console.log("Validation failed"); // DEBUG
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Transform data to match backend schema
    const backendData = {
      templateName: formData.name, // Backend expects 'templateName' not 'name'
      description: formData.description,
      category: formData.category,
      fields: formData.fields,
    };

    console.log("Validation passed, sending to backend:", backendData); // DEBUG
    onSubmit(backendData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {errors.name && <li>{errors.name}</li>}
                  {errors.category && <li>{errors.category}</li>}
                  {errors.fields && <li>{errors.fields}</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Name */}
      <Input
        label="Template Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        required
        placeholder="e.g., Job Application Form"
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
          placeholder="Brief description of this template"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.category ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Category</option>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      {/* Fields Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Template Fields</h3>

        {/* Existing Fields */}
        <div className="space-y-3 mb-6">
          {Object.keys(formData.fields).length === 0 ? (
            <p className="text-gray-500 text-sm">No fields added yet</p>
          ) : (
            Object.entries(formData.fields).map(([key, field]) => (
              <FieldInput
                key={key}
                field={{ ...field, key }}
                value={field.value}
                onChange={handleFieldValueChange}
                onRemove={handleRemoveField}
              />
            ))
          )}
        </div>

        {errors.fields && (
          <p className="mb-4 text-sm text-red-600">{errors.fields}</p>
        )}

        {/* Add New Field */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium mb-3">Add New Field</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Field Key"
              value={newField.key}
              onChange={(e) =>
                setNewField({ ...newField, key: e.target.value })
              }
              placeholder="e.g., fullName"
            />
            <Input
              label="Field Label"
              value={newField.label}
              onChange={(e) =>
                setNewField({ ...newField, label: e.target.value })
              }
              placeholder="e.g., Full Name"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type
              </label>
              <select
                value={newField.type}
                onChange={(e) =>
                  setNewField({ ...newField, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {FIELD_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Placeholder"
              value={newField.placeholder}
              onChange={(e) =>
                setNewField({ ...newField, placeholder: e.target.value })
              }
              placeholder="Optional placeholder text"
            />
          </div>
          <div className="flex items-center mt-3">
            <input
              type="checkbox"
              id="requiredField"
              checked={newField.required}
              onChange={(e) =>
                setNewField({ ...newField, required: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="requiredField"
              className="ml-2 text-sm text-gray-700"
            >
              Required field
            </label>
          </div>
          <Button
            type="button"
            onClick={handleAddField}
            variant="primary"
            size="sm"
            className="mt-3"
          >
            Add Field
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {initialData ? "Update Template" : "Create Template"}
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;
