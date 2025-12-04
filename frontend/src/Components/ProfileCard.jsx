import { formatRelativeTime } from "../utils/helpers";

/**
 * ProfileCard Component
 * Displays a profile with its details and actions
 */
const ProfileCard = ({
  profile,
  isSelected = false,
  onEdit,
  onDelete,
  onSelect,
  onManageTemplates,
}) => {
  const templateCount = profile.templates?.length || 0;

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{
              backgroundColor: profile.color ? `${profile.color}20` : "#e5e7eb",
              color: profile.color || "#6b7280",
            }}
          >
            {profile.icon || "📁"}
          </div>

          {/* Name & Type */}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {profile.profileName}
            </h3>
            <span className="text-sm text-gray-500 capitalize">
              {profile.profileType}
            </span>
          </div>
        </div>

        {/* Default Badge */}
        {profile.isDefault && (
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Default
          </span>
        )}

        {/* Selected Badge */}
        {isSelected && (
          <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            ✓ Selected
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2 text-gray-400"
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
          <span>
            {templateCount} {templateCount === 1 ? "template" : "templates"}
          </span>
        </div>

        {profile.updatedAt && (
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Updated {formatRelativeTime(profile.updatedAt)}</span>
          </div>
        )}
      </div>

      {/* Template List (if any) */}
      {templateCount > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-600 mb-2">Templates:</p>
          <div className="space-y-1">
            {profile.templates.slice(0, 3).map((template, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-700"
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                {typeof template === "string"
                  ? template
                  : template.templateName}
              </div>
            ))}
            {templateCount > 3 && (
              <p className="text-xs text-gray-500 mt-1">
                +{templateCount - 3} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {/* Use Profile Button */}
        <button
          onClick={() => onSelect(profile)}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isSelected
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          {isSelected ? "✓ Selected" : "Use Profile"}
        </button>

        {/* Manage Templates Button */}
        <button
          onClick={() => onManageTemplates(profile)}
          className="w-full py-2 px-4 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Manage Templates
        </button>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(profile._id)}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-1"
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
            Edit
          </button>

          <button
            onClick={() => onDelete(profile._id)}
            className="flex-1 py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
