import { Heart, ChevronDown, Plus, X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const PatientSettings = () => {
  const { user } = useAuth();
  const userRole = user?.role || "Patient";

  // Only show patient settings for patients
  if (userRole !== "Patient") {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Section Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <Heart className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Patient Settings</h2>
          <p className="text-gray-600">Configure your health profile and preferences</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Primary Care Physician */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Care Physician
          </label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
              <option>Dr. Sarah Johnson - Cardiologist</option>
              <option>Dr. Michael Brown - General Practice</option>
              <option>Dr. Emily Davis - Internal Medicine</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Insurance Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Provider
          </label>
          <input
            type="text"
            defaultValue="Blue Cross Blue Shield"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Policy Number
            </label>
            <input
              type="text"
              defaultValue="BC123456789"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Number
            </label>
            <input
              type="text"
              defaultValue="GRP001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Medical Conditions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Conditions
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
              Hypertension
              <button className="ml-2 text-red-600 hover:text-red-800">
                <X className="w-3 h-3" />
              </button>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
              Diabetes Type 2
              <button className="ml-2 text-red-600 hover:text-red-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
          <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
            <Plus className="w-4 h-4 mr-1" />
            Add Condition
          </button>
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergies
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
              Penicillin
              <button className="ml-2 text-yellow-600 hover:text-yellow-800">
                <X className="w-3 h-3" />
              </button>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
              Shellfish
              <button className="ml-2 text-yellow-600 hover:text-yellow-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
          <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
            <Plus className="w-4 h-4 mr-1" />
            Add Allergy
          </button>
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Contact Name"
              defaultValue="John Smith"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              defaultValue="+1 (555) 987-6543"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Health Reminders */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Health Reminders</h3>
            <p className="text-sm text-gray-600">Get reminders for medications and appointments</p>
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

export default PatientSettings;
