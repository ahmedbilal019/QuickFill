import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ProfileCard from "../components/ProfileCard";
import ProfileForm from "../components/ProfileForm";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import ManageTemplates from "../components/ManageTemplates";
import {
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../api/profileApi";

/**
 * ProfileManagement Page
 * Page for managing user profiles
 */
const ProfileManagement = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Modal states
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, profile: null });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    profileId: null,
  });
  const [manageTemplatesModal, setManageTemplatesModal] = useState({
    isOpen: false,
    profile: null,
  });

  // Fetch profiles
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await getAllProfiles();
      if (response.success) {
        setProfiles(response.data);

        // Auto-select default profile if exists
        const defaultProfile = response.data.find((p) => p.isDefault);
        if (defaultProfile) {
          setSelectedProfile(defaultProfile);
        }
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to load profiles",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle create profile
  const handleCreate = async (formData) => {
    try {
      const response = await createProfile(formData);
      if (response.success) {
        setProfiles([...profiles, response.data]);
        setCreateModal(false);
        setAlert({
          type: "success",
          message: "Profile created successfully! ✅",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to create profile",
      });
    }
  };

  // Handle edit profile
  const handleEdit = (profileId) => {
    const profile = profiles.find((p) => p._id === profileId);
    if (profile) {
      // Keep the original profile data with _id for update
      setEditModal({ isOpen: true, profile: profile });
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await updateProfile(editModal.profile._id, formData);
      if (response.success) {
        setProfiles(
          profiles.map((p) =>
            p._id === editModal.profile._id ? response.data : p
          )
        );

        // Update selected profile if it's the one being edited
        if (selectedProfile?._id === editModal.profile._id) {
          setSelectedProfile(response.data);
        }

        setEditModal({ isOpen: false, profile: null });
        setAlert({
          type: "success",
          message: "Profile updated successfully! ✅",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to update profile",
      });
    }
  };

  // Handle delete profile
  const handleDeleteClick = (profileId) => {
    setDeleteModal({ isOpen: true, profileId });
  };

  const handleDelete = async () => {
    try {
      const response = await deleteProfile(deleteModal.profileId);
      if (response.success) {
        setProfiles(profiles.filter((p) => p._id !== deleteModal.profileId));

        // Clear selection if deleted profile was selected
        if (selectedProfile?._id === deleteModal.profileId) {
          setSelectedProfile(null);
        }

        setDeleteModal({ isOpen: false, profileId: null });
        setAlert({
          type: "success",
          message: "Profile deleted successfully! 🗑️",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to delete profile",
      });
    }
  };

  // Handle select profile (for future use in extension)
  const handleSelect = (profile) => {
    setSelectedProfile(profile);

    // Save to localStorage for extension use
    localStorage.setItem("quickfill_selected_profile", JSON.stringify(profile));

    setAlert({
      type: "info",
      message: `Selected: ${profile.profileName} (${
        profile.templates?.length || 0
      } templates)`,
    });
  };

  // Handle manage templates
  const handleManageTemplates = (profile) => {
    setManageTemplatesModal({ isOpen: true, profile });
  };

  const handleManageTemplatesClose = () => {
    setManageTemplatesModal({ isOpen: false, profile: null });
    fetchProfiles(); // Refresh profiles to show updated template count
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 pt-16 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Profile Management
              </h1>
              <p className="text-gray-600">
                Create and manage different profiles for various use cases
              </p>
            </div>
            <Button
              onClick={() => setCreateModal(true)}
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              Create Profile
            </Button>
          </div>
        </div>

        {/* Selected Profile Banner */}
        {selectedProfile && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <span className="font-medium text-blue-900">
                  Selected: {selectedProfile.profileName}
                </span>
                <span className="ml-2 text-blue-700 text-sm">
                  ({selectedProfile.templates?.length || 0} templates)
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedProfile(null)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Alert */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            className="mb-6"
          />
        )}

        {/* Profiles List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="lg" text="Loading profiles..." />
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No profiles yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first profile to get started
            </p>
            <Button onClick={() => setCreateModal(true)} variant="primary">
              Create Profile
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                isSelected={selectedProfile?._id === profile._id}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onSelect={handleSelect}
                onManageTemplates={handleManageTemplates}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Profile Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Create New Profile"
        size="lg"
      >
        <ProfileForm onSubmit={handleCreate} />
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, profile: null })}
        title="Edit Profile"
        size="lg"
      >
        <ProfileForm initialData={editModal.profile} onSubmit={handleUpdate} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, profileId: null })}
        title="Delete Profile"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, profileId: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete this profile? This action cannot be
          undone.
        </p>
      </Modal>

      {/* Manage Templates Modal */}
      <Modal
        isOpen={manageTemplatesModal.isOpen}
        onClose={handleManageTemplatesClose}
        title="Manage Templates"
        size="lg"
      >
        {manageTemplatesModal.profile && (
          <ManageTemplates
            profile={manageTemplatesModal.profile}
            onClose={handleManageTemplatesClose}
            onUpdate={fetchProfiles}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProfileManagement;
