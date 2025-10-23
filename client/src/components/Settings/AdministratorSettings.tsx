import { Shield, ChevronDown, Plus, X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const AdministratorSettings = () => {
  const { user } = useAuth();
  const userRole = user?.role || "Patient";

  // Only show administrator settings for administrators
  if (userRole !== "Administrator") {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Section Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Administrator Settings</h2>
          <p className="text-gray-600">Configure system and administrative details</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Organization Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Name
          </label>
          <input
            type="text"
            defaultValue="Carpe Diem Healthcare System"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* System Access Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            System Access Level
          </label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
              <option>Full Access</option>
              <option>Limited Access</option>
              <option>Read Only</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
              <option>IT Administration</option>
              <option>Medical Administration</option>
              <option>Finance</option>
              <option>Operations</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Permissions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            System Permissions
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              User Management
              <button className="ml-2 text-green-600 hover:text-green-800">
                <X className="w-3 h-3" />
              </button>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              System Settings
              <button className="ml-2 text-green-600 hover:text-green-800">
                <X className="w-3 h-3" />
              </button>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Reports Access
              <button className="ml-2 text-green-600 hover:text-green-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
          <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
            <Plus className="w-4 h-4 mr-1" />
            Add Permission
          </button>
        </div>

        {/* System Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">System Notifications</h3>
            <p className="text-sm text-gray-600">Receive system alerts and updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdministratorSettings;
