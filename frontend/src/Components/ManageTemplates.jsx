import { useState, useEffect } from "react";
import { getAllTemplates } from "../api/templateApi";
import {
  addTemplateToProfile,
  removeTemplateFromProfile,
} from "../api/profileApi";
import Button from "./Button";
import Loader from "./Loader";
import Alert from "./Alert";

/**
 * ManageTemplates Component
 * Modal content for managing templates in a profile
 */
const ManageTemplates = ({ profile, onClose, onUpdate }) => {
  const [allTemplates, setAllTemplates] = useState([]);
  const [profileTemplateIds, setProfileTemplateIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchTemplates();
    // Extract template IDs from profile
    if (profile.templates) {
      const ids = profile.templates.map((t) =>
        typeof t === "string" ? t : t._id
      );
      setProfileTemplateIds(ids);
    }
  }, [profile]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await getAllTemplates();
      if (response.success) {
        setAllTemplates(response.data);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to load templates",
      });
    } finally {
      setLoading(false);
    }
  };

  const isTemplateInProfile = (templateId) => {
    return profileTemplateIds.includes(templateId);
  };

  const handleToggleTemplate = async (template) => {
    setProcessing(true);
    try {
      if (isTemplateInProfile(template._id)) {
        // Remove template
        const response = await removeTemplateFromProfile(
          profile._id,
          template._id
        );
        if (response.success) {
          setProfileTemplateIds(
            profileTemplateIds.filter((id) => id !== template._id)
          );
          setAlert({
            type: "success",
            message: `${template.templateName} removed from profile`,
          });
          onUpdate(); // Refresh parent component
        }
      } else {
        // Add template
        const response = await addTemplateToProfile(profile._id, template._id);
        if (response.success) {
          setProfileTemplateIds([...profileTemplateIds, template._id]);
          setAlert({
            type: "success",
            message: `${template.templateName} added to profile`,
          });
          onUpdate(); // Refresh parent component
        }
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Operation failed",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Manage Templates for "{profile.profileName}"
        </h3>
        <p className="text-sm text-gray-600">
          Select templates to include in this profile. Selected templates:{" "}
          <span className="font-semibold">{profileTemplateIds.length}</span>
        </p>
      </div>

      {/* Templates List */}
      {allTemplates.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600 font-medium mb-1">
            No templates available
          </p>
          <p className="text-sm text-gray-500">Create some templates first</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {allTemplates.map((template) => {
            const isSelected = isTemplateInProfile(template._id);
            return (
              <div
                key={template._id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-200 hover:border-blue-200"
                }`}
                onClick={() => !processing && handleToggleTemplate(template)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={processing}
                  />

                  {/* Template Info */}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {template.templateName}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        {template.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {Object.keys(template.fields || {}).length} fields
                      </span>
                      {template.usageCount > 0 && (
                        <span className="text-xs text-gray-500">
                          • Used {template.usageCount} times
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isSelected && (
                    <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                      ✓ Selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
};

export default ManageTemplates;
