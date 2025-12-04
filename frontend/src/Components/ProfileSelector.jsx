import { useState, useEffect } from "react";
import { getInitials } from "../utils/helpers";
import { PROFILE_TYPES } from "../utils/constants";

/**
 * ProfileSelector Component
 * Dropdown to select a profile
 */
const ProfileSelector = ({
  profiles,
  selectedProfile,
  onSelect,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".profile-selector")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (profile) => {
    onSelect(profile);
    setIsOpen(false);
  };

  const getProfileType = (type) => {
    return PROFILE_TYPES.find((t) => t.value === type);
  };

  return (
    <div className={`relative profile-selector ${className}`}>
      {/* Selected Profile Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {selectedProfile ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {getInitials(selectedProfile.name)}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                {selectedProfile.name}
              </p>
              <p className="text-xs text-gray-500">
                {getProfileType(selectedProfile.type)?.label ||
                  selectedProfile.type}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-gray-500">Select a profile</span>
        )}

        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {profiles.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No profiles available
            </div>
          ) : (
            profiles.map((profile) => {
              const profileType = getProfileType(profile.type);
              return (
                <button
                  key={profile._id}
                  type="button"
                  onClick={() => handleSelect(profile)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition-colors ${
                    selectedProfile?._id === profile._id
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(profile.name)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {profile.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {profileType?.icon} {profileType?.label}
                      </span>
                      {profile.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedProfile?._id === profile._id && (
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
