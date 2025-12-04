import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { updateUserProfile, changePassword } from "../api/authApi";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../utils/validation";

/**
 * Settings Page
 * User account settings and password change
 */
const Settings = () => {
  const { user, updateUser } = useAuth();

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({ profile: false, password: false });
  const [alert, setAlert] = useState(null);

  // Handle profile input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate profile form
  const validateProfile = () => {
    const newErrors = {};

    const nameValidation = validateName(profileData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }

    const emailValidation = validateEmail(profileData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      newErrors.newPassword = passwordValidation.message;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validateProfile()) return;

    setLoading({ ...loading, profile: true });

    try {
      const response = await updateUserProfile(profileData);

      if (response.success) {
        updateUser(response.data);
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
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  // Handle password change
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validatePasswordForm()) return;

    setLoading({ ...loading, password: true });

    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        setAlert({
          type: "success",
          message: "Password changed successfully! ✅",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to change password",
      });
    } finally {
      setLoading({ ...loading, password: false });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Profile Information
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <Input
                label="Full Name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                error={errors.name}
                placeholder="Your name"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                error={errors.email}
                placeholder="your@email.com"
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading.profile}
              >
                Update Profile
              </Button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Change Password
            </h2>

            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              <Input
                label="Current Password"
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={errors.currentPassword}
                placeholder="Enter current password"
                required
              />

              <Input
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
                placeholder="Enter new password"
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={errors.confirmPassword}
                placeholder="Confirm new password"
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading.password}
              >
                Change Password
              </Button>
            </form>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Created</p>
              <p className="text-gray-900 font-medium">
                {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">User ID</p>
              <p className="text-gray-900 font-mono text-sm">{user?._id}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
