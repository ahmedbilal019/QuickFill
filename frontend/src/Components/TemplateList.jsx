import { useState } from "react";
import TemplateCard from "./TemplateCard";
import Loader from "./Loader";
import Modal from "./Modal";
import Button from "./Button";

/**
 * TemplateList Component
 * Displays a list of templates with delete confirmation
 */
const TemplateList = ({ templates, loading, onDelete }) => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    templateId: null,
  });

  const handleDeleteClick = (templateId) => {
    setDeleteModal({ isOpen: true, templateId });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.templateId) {
      await onDelete(deleteModal.templateId);
      setDeleteModal({ isOpen: false, templateId: null });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size="lg" text="Loading templates..." />
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No templates found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new template
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template._id}
            template={template}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, templateId: null })}
        title="Delete Template"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setDeleteModal({ isOpen: false, templateId: null })
              }
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete this template? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
};

export default TemplateList;
