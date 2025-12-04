import { createContext, useState, useEffect } from "react";
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  addTemplateToProfile,
  removeTemplateFromProfile,
} from "../api/profileApi";

// Create Context
export const ProfileContext = createContext();

// Provider Component
export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Fetch all profiles
  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllProfiles();

      if (response.success) {
        setProfiles(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  };

  // Get single profile
  const fetchProfileById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProfileById(id);

      if (response.success) {
        setSelectedProfile(response.data);
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new profile
  const addProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createProfile(profileData);

      if (response.success) {
        setProfiles([...profiles, response.data]);
        return { success: true, data: response.data };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create profile";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update existing profile
  const editProfile = async (id, profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateProfile(id, profileData);

      if (response.success) {
        setProfiles(
          profiles.map((profile) =>
            profile._id === id ? response.data : profile
          )
        );
        if (selectedProfile?._id === id) {
          setSelectedProfile(response.data);
        }
        return { success: true, data: response.data };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Delete profile
  const removeProfile = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await deleteProfile(id);

      if (response.success) {
        setProfiles(profiles.filter((profile) => profile._id !== id));
        if (selectedProfile?._id === id) {
          setSelectedProfile(null);
        }
        return { success: true, message: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete profile";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Add template to profile
  const linkTemplateToProfile = async (profileId, templateId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await addTemplateToProfile(profileId, templateId);

      if (response.success) {
        // Update local state
        await fetchProfileById(profileId);
        return { success: true, data: response.data };
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to add template to profile";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Remove template from profile
  const unlinkTemplateFromProfile = async (profileId, templateId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await removeTemplateFromProfile(profileId, templateId);

      if (response.success) {
        // Update local state
        await fetchProfileById(profileId);
        return { success: true, data: response.data };
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to remove template from profile";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Clear selected profile
  const clearSelectedProfile = () => {
    setSelectedProfile(null);
  };

  const value = {
    profiles,
    selectedProfile,
    loading,
    error,
    fetchProfiles,
    fetchProfileById,
    addProfile,
    editProfile,
    removeProfile,
    linkTemplateToProfile,
    unlinkTemplateFromProfile,
    clearError,
    clearSelectedProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
