import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTemplate } from "../hooks/useTemplate";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TemplateForm from "../components/TemplateForm";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

/**
 * EditTemplate Page
 * Page for editing an existing template
 */
const EditTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTemplateById, editTemplate } = useTemplate();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Fetch template data
  useEffect(() => {
    const loadTemplate = async () => {
      setLoading(true);
      try {
        const data = await fetchTemplateById(id);
        if (data) {
          // Transform backend data to match frontend form
          const transformedData = {
            name: data.templateName, // Backend uses 'templateName', frontend uses 'name'
            description: data.description,
            category: data.category,
            fields: data.fields,
          };
          setTemplate(transformedData);
        } else {
          setAlert({
            type: "error",
            message: "Template not found",
          });
          setTimeout(() => navigate("/dashboard"), 2000);
        }
      } catch (error) {
        setAlert({
          type: "error",
          message: "Failed to load template",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);
    setAlert(null);

    try {
      // Transform data to match backend schema
      const backendData = {
        templateName: formData.name, // Backend expects 'templateName' not 'name'
        description: formData.description,
        category: formData.category,
        fields: formData.fields,
      };

      const result = await editTemplate(id, backendData);

      if (result.success) {
        setAlert({
          type: "success",
          message: "Template updated successfully! ✅",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setAlert({
          type: "error",
          message: result.message || "Failed to update template",
        });
        setSubmitLoading(false);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred. Please try again.",
      });
      setSubmitLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Template
          </h1>
          <p className="text-gray-600">Update your template information</p>
        </div>

        {/* Alert */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            className="mb-6"
          />
        )}

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" text="Loading template..." />
            </div>
          ) : template ? (
            <TemplateForm
              initialData={template}
              onSubmit={handleSubmit}
              loading={submitLoading}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Template not found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditTemplate;
