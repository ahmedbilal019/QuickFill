import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTemplate } from "../hooks/useTemplate";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TemplateForm from "../components/TemplateForm";
import Alert from "../components/Alert";

/**
 * CreateTemplate Page
 * Page for creating a new template
 */
const CreateTemplate = () => {
  const navigate = useNavigate();
  const { addTemplate } = useTemplate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setAlert(null);

    try {
      const result = await addTemplate(formData);

      if (result.success) {
        setAlert({
          type: "success",
          message: "Template created successfully! ✅",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setAlert({
          type: "error",
          message: result.message || "Failed to create template",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
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
            Create New Template
          </h1>
          <p className="text-gray-600">
            Build a custom template for auto-filling forms
          </p>
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
          <TemplateForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default CreateTemplate;
