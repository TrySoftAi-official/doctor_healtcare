import { Shield } from "lucide-react";

const PrivacySecurity = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Section Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Privacy & Security</h2>
          <p className="text-gray-600">Protect your account and data</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Change Password */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Change Password</h3>
            <p className="text-sm text-gray-600">Update your password regularly for better security</p>
          </div>
          <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
            Change Password
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Add an extra layer of security</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Download My Data */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Download My Data</h3>
            <p className="text-sm text-gray-600">Get a copy of all your personal data</p>
          </div>
          <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
            Download Data
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Delete Account</h3>
            <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
          </div>
          <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurity;
