import { useState } from 'react';
import CreatePrescriptionForm from '@/components/Prescription/CreatePrescriptionForm';
import PrescriptionTemplates from '@/components/Prescription/PrescriptionTemplates';
import PrescriptionAnalytics from '@/components/Analytics/PrescriptionAnalytics';

export default function PrescriptionTest() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Prescription Management Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Create Prescription</h2>
            <p className="text-gray-600 mb-4">Test the prescription creation form</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Open Form
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Templates</h2>
            <p className="text-gray-600 mb-4">Test prescription templates</p>
            <button
              onClick={() => setShowTemplates(true)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              View Templates
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600 mb-4">Test prescription analytics</p>
            <button
              onClick={() => setShowAnalytics(true)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Test Data Display */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Data</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Appointment ID:</strong> test-appointment-123</p>
            <p><strong>Patient ID:</strong> test-patient-123</p>
            <p><strong>Patient Name:</strong> John Doe</p>
          </div>
        </div>

        {/* Modals */}
        {showCreateForm && (
          <CreatePrescriptionForm
            appointmentId="test-appointment-123"
            patientId="test-patient-123"
            patientName="John Doe"
            onSuccess={() => {
              setShowCreateForm(false);
              alert('Prescription created successfully!');
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {showTemplates && (
          <PrescriptionTemplates
            onSelectTemplate={(template) => {
              console.log('Selected template:', template);
              setShowTemplates(false);
              alert('Template selected: ' + template.name);
            }}
            onClose={() => setShowTemplates(false)}
          />
        )}

        {showAnalytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Prescription Analytics</h2>
                  <button
                    onClick={() => setShowAnalytics(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <span className="text-gray-500">×</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <PrescriptionAnalytics />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
