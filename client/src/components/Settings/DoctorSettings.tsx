import { Stethoscope, ChevronDown, Plus, X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const DoctorSettings = () => {
  const { user } = useAuth();
  const userRole = user?.role || "Patient";

  // Only show doctor settings for doctors
  if (userRole !== "Doctor") {
    return null;
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Section Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <Stethoscope className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Doctor Settings</h2>
          <p className="text-gray-600">Configure your practice details</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Clinic Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinic Name
          </label>
          <input
            type="text"
            defaultValue="Carpe Diem Cardiology Center"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Consultation Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consultation Fee
          </label>
          <div className="flex gap-2">
            <div className="relative">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <input
              type="number"
              defaultValue="150"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Clinic Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinic Address
          </label>
          <input
            type="text"
            defaultValue="123 Medical Plaza, Suite 456, New York, NY 10001"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Appointment Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Duration
          </label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialties
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Cardiology
              <button className="ml-2 text-blue-600 hover:text-blue-800">
                <X className="w-3 h-3" />
              </button>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Heart Surgery
              <button className="ml-2 text-blue-600 hover:text-blue-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
          <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        </div>

        {/* Telemedicine */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Telemedicine</h3>
            <p className="text-sm text-gray-600">Enable virtual consultations</p>
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

export default DoctorSettings;
