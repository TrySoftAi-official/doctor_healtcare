import { useState } from 'react';
import CreatePrescriptionForm from './CreatePrescriptionForm';
import PrescriptionTemplates from './PrescriptionTemplates';
import PrescriptionAnalytics from '../Analytics/PrescriptionAnalytics';

export default function PrescriptionDemo() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Prescription Management System
        </h1>
        <p className="text-gray-600 mb-8">
          Complete prescription management workflow for healthcare applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Prescription</h3>
          <p className="text-gray-600 mb-4">
            Create new prescriptions with multi-medication support, validation, and templates.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Open Prescription Form
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates</h3>
          <p className="text-gray-600 mb-4">
            Use pre-built prescription templates for common conditions and medications.
          </p>
          <button
            onClick={() => setShowTemplates(true)}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            View Templates
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
          <p className="text-gray-600 mb-4">
            View prescription analytics, trends, and performance metrics.
          </p>
          <button
            onClick={() => setShowAnalytics(true)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            View Analytics
          </button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-bold">✓</span>
            </div>
            <h4 className="font-medium text-gray-900">Multi-Medication</h4>
            <p className="text-sm text-gray-600">Support for multiple medications per prescription</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <h4 className="font-medium text-gray-900">Validation</h4>
            <p className="text-sm text-gray-600">Real-time validation and drug interaction checks</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-yellow-600 font-bold">✓</span>
            </div>
            <h4 className="font-medium text-gray-900">Templates</h4>
            <p className="text-sm text-gray-600">Pre-built templates for common prescriptions</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 font-bold">✓</span>
            </div>
            <h4 className="font-medium text-gray-900">Analytics</h4>
            <p className="text-sm text-gray-600">Comprehensive analytics and reporting</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateForm && (
        <CreatePrescriptionForm
          appointmentId="demo-appointment-123"
          patientId="demo-patient-123"
          patientName="Demo Patient"
          onSuccess={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {showTemplates && (
        <PrescriptionTemplates
          onSelectTemplate={(template) => {
            console.log('Selected template:', template);
            setShowTemplates(false);
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
  );
}
