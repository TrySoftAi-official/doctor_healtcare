import { Stethoscope, ChevronDown, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";
import { settingsService, type DoctorSettings as DoctorSettingsType } from "@/services/settingsService";
import { toast } from "sonner";

const DoctorSettings = () => {
  const { user } = useAuth();
  const userRole = user?.role || "Patient";
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<DoctorSettingsType>({
    consultationFee: 0,
    availability: {
      monday: { start: "09:00", end: "17:00", isAvailable: true },
      tuesday: { start: "09:00", end: "17:00", isAvailable: true },
      wednesday: { start: "09:00", end: "17:00", isAvailable: true },
      thursday: { start: "09:00", end: "17:00", isAvailable: true },
      friday: { start: "09:00", end: "17:00", isAvailable: true },
      saturday: { start: "09:00", end: "13:00", isAvailable: false },
      sunday: { start: "09:00", end: "13:00", isAvailable: false }
    },
    appointmentDuration: 30,
    maxPatientsPerDay: 20,
    autoConfirmAppointments: false
  });

  // Only show doctor settings for doctors
  if (userRole !== "Doctor") {
    return null;
  }

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getProfileSettings();
      if (response.profile) {
        setFormData(prev => ({
          ...prev,
          consultationFee: response.profile.consultationFee || 0,
          availability: response.profile.availability || prev.availability,
          appointmentDuration: response.profile.appointmentDuration || 30,
          maxPatientsPerDay: response.profile.maxPatientsPerDay || 20,
          autoConfirmAppointments: response.profile.autoConfirmAppointments || false
        }));
      }
    } catch (error) {
      toast.error("Failed to load doctor settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleAvailabilityChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => {
      const currentAvailability = prev.availability || {
        monday: { start: "09:00", end: "17:00", isAvailable: true },
        tuesday: { start: "09:00", end: "17:00", isAvailable: true },
        wednesday: { start: "09:00", end: "17:00", isAvailable: true },
        thursday: { start: "09:00", end: "17:00", isAvailable: true },
        friday: { start: "09:00", end: "17:00", isAvailable: true },
        saturday: { start: "09:00", end: "13:00", isAvailable: false },
        sunday: { start: "09:00", end: "13:00", isAvailable: false }
      };
      
      return {
        ...prev,
        availability: {
          ...currentAvailability,
          [day]: {
            ...currentAvailability[day as keyof typeof currentAvailability],
            [field]: value
          }
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.updateDoctorSettings(formData);
      toast.success("Doctor settings updated successfully");
    } catch (error) {
      toast.error("Failed to update doctor settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading doctor settings...</span>
        </div>
      </div>
    );
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

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Consultation Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Fee (USD)
            </label>
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>

          {/* Appointment Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Duration (minutes)
            </label>
            <div className="relative">
              <select 
                name="appointmentDuration"
                value={formData.appointmentDuration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Max Patients Per Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Patients Per Day
            </label>
            <input
              type="number"
              name="maxPatientsPerDay"
              value={formData.maxPatientsPerDay}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="50"
            />
          </div>

          {/* Auto Confirm Appointments */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Auto Confirm Appointments</h3>
              <p className="text-sm text-gray-600">Automatically confirm new appointment requests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="autoConfirmAppointments"
                checked={formData.autoConfirmAppointments}
                onChange={handleInputChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Availability Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Weekly Availability
            </label>
            <div className="space-y-3">
              {Object.entries(formData.availability || {}).map(([day, schedule]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium text-gray-700 capitalize">
                    {day}
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schedule.isAvailable}
                      onChange={(e) => handleAvailabilityChange(day, 'isAvailable', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Available</span>
                  </label>
                  {schedule.isAvailable && (
                    <>
                      <input
                        type="time"
                        value={schedule.start}
                        onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <input
                        type="time"
                        value={schedule.end}
                        onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DoctorSettings;
