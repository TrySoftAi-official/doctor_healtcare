import { Shield, Plus, X, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";
import { settingsService, type SystemSettings } from "@/services/settingsService";
import { toast } from "sonner";

const AdministratorSettings = () => {
  const { user } = useAuth();
  const userRole = user?.role || "Patient";
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SystemSettings>({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxFileSize: 10,
    allowedFileTypes: ["jpg", "jpeg", "png", "pdf", "doc", "docx"]
  });

  // Only show administrator settings for administrators
  if (userRole !== "Administrator") {
    return null;
  }

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getSystemSettings();
      setFormData(prev => ({
        ...prev,
        ...response
      }));
    } catch (error) {
      console.error("Error loading system data:", error);
      toast.error("Failed to load system settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.updateSystemSettings(formData);
      toast.success("System settings updated successfully");
    } catch (error) {
      console.error("Error updating system settings:", error);
      toast.error("Failed to update system settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading system settings...</span>
        </div>
      </div>
    );
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

      <form onSubmit={handleSubmit}>
      <div className="space-y-4">
          {/* Site Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
          </label>
          <input
            type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter site name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
          </label>
            <textarea
              name="siteDescription"
              value={formData.siteDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter site description"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter organization address"
            />
          </div>

          {/* System Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">System Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Maintenance Mode</h4>
                <p className="text-sm text-gray-600">Put the system in maintenance mode</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onChange={handleInputChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Registration Enabled</h4>
                <p className="text-sm text-gray-600">Allow new user registrations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="registrationEnabled"
                  checked={formData.registrationEnabled}
                  onChange={handleInputChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Email Verification Required</h4>
                <p className="text-sm text-gray-600">Require email verification for new users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="emailVerificationRequired"
                  checked={formData.emailVerificationRequired}
                  onChange={handleInputChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
            </div>
          </div>

          {/* File Upload Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">File Upload Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum File Size (MB)
              </label>
              <input
                type="number"
                name="maxFileSize"
                value={formData.maxFileSize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="100"
              />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed File Types
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
                {formData.allowedFileTypes?.map((type, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {type}
                    <button 
                      type="button"
                      onClick={() => {
                        const newTypes = formData.allowedFileTypes?.filter((_, i) => i !== index) || [];
                        setFormData(prev => ({ ...prev, allowedFileTypes: newTypes }));
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                <X className="w-3 h-3" />
              </button>
            </span>
                ))}
          </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add file type (e.g., jpg)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value && !formData.allowedFileTypes?.includes(input.value)) {
                        setFormData(prev => ({
                          ...prev,
                          allowedFileTypes: [...(prev.allowedFileTypes || []), input.value]
                        }));
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
                >
            <Plus className="w-4 h-4 mr-1" />
                  Add
          </button>
              </div>
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

export default AdministratorSettings;
