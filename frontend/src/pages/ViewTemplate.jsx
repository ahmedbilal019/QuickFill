import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTemplate } from "../hooks/useTemplate";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { formatDate, copyToClipboard, downloadJSON } from "../utils/helpers";
import { TEMPLATE_CATEGORIES } from "../utils/constants";

/**
 * ViewTemplate Page
 * Displays detailed view of a template
 */
const ViewTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTemplateById } = useTemplate();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const loadTemplate = async () => {
      setLoading(true);
      try {
        const data = await fetchTemplateById(id);
        if (data) {
          // Transform backend data (templateName -> name for display)
          const transformedData = {
            ...data,
            name: data.templateName || data.name, // Handle both old and new format
          };
          setTemplate(transformedData);
        }
      } catch (error) {
        console.error("Failed to load template:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [id]);

  const handleCopyJSON = async () => {
    if (template) {
      const result = await copyToClipboard(
        JSON.stringify(template.fields, null, 2)
      );
      if (result.success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const handleDownloadJSON = () => {
    if (template) {
      downloadJSON(template.fields, `${template.name}-fields.json`);
    }
  };

  const getCategoryInfo = (categoryValue) => {
    return TEMPLATE_CATEGORIES.find((cat) => cat.value === categoryValue);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Sidebar />
        <main className="ml-64 pt-16 p-8">
          <div className="flex justify-center items-center h-96">
            <Loader size="lg" text="Loading template..." />
          </div>
        </main>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Sidebar />
        <main className="ml-64 pt-16 p-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Template not found</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(template.category);
  const fieldCount = Object.keys(template.fields || {}).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 pt-16 p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {template.name}
              </h1>
              {template.description && (
                <p className="text-gray-600">{template.description}</p>
              )}
            </div>
            <Button
              onClick={() => navigate(`/templates/edit/${id}`)}
              variant="primary"
              icon={
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
            >
              Edit Template
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500 mb-1">Category</p>
            <p className="text-lg font-semibold text-gray-900">
              {categoryInfo?.icon} {categoryInfo?.label || template.category}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500 mb-1">Total Fields</p>
            <p className="text-lg font-semibold text-gray-900">{fieldCount}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500 mb-1">Usage Count</p>
            <p className="text-lg font-semibold text-gray-900">
              {template.usageCount || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500 mb-1">Last Updated</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(template.updatedAt)}
            </p>
          </div>
        </div>

        {/* Template Fields */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Template Fields</h2>
            <div className="flex gap-2">
              <Button onClick={handleCopyJSON} variant="outline" size="sm">
                {copySuccess ? "Copied! ✓" : "Copy JSON"}
              </Button>
              <Button onClick={handleDownloadJSON} variant="outline" size="sm">
                Download JSON
              </Button>
            </div>
          </div>

          {fieldCount === 0 ? (
            <p className="text-gray-500 text-center py-8">No fields defined</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(template.fields).map(([key, field]) => (
                <div
                  key={key}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">Key: {key}</p>
                    </div>
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {field.type}
                    </span>
                  </div>

                  {field.placeholder && (
                    <p className="text-sm text-gray-600 mb-2">
                      Placeholder: {field.placeholder}
                    </p>
                  )}

                  {field.value && (
                    <div className="mt-2 p-3 bg-white border border-gray-300 rounded">
                      <p className="text-sm text-gray-700">{field.value}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewTemplate;
