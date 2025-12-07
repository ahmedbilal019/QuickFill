import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTemplate } from "../hooks/useTemplate";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import TemplateList from "../components/TemplateList";
import Loader from "../components/Loader";

/**
 * Dashboard Page
 * Main dashboard showing templates overview
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { templates, loading, fetchTemplates, removeTemplate } = useTemplate();
  const [stats, setStats] = useState({
    totalTemplates: 0,
    recentTemplates: 0,
    totalUsage: 0,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (templates) {
      const total = templates.length;
      const recent = templates.filter((t) => {
        const createdAt = new Date(t.createdAt);
        const daysDiff = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      }).length;

      const usage = templates.reduce((sum, t) => sum + (t.usageCount || 0), 0);

      setStats({
        totalTemplates: total,
        recentTemplates: recent,
        totalUsage: usage,
      });
    }
  }, [templates]);

  const handleDelete = async (templateId) => {
    await removeTemplate(templateId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 pt-16 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your form templates and profiles
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Templates</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalTemplates}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
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
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Recent (7 days)</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.recentTemplates}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Usage</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalUsage}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Templates</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" text="Loading templates..." />
            </div>
          ) : (
            <TemplateList
              templates={templates}
              loading={loading}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
