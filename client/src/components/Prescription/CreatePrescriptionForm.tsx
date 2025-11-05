import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { prescriptionService, type CreatePrescriptionRequest } from '@/services/prescriptionService';
import { useToast } from '@/components/Toast';
import { prescriptionValidation } from '@/utils/prescriptionValidation';
import PrescriptionTemplates from './PrescriptionTemplates';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  AlertCircle, 
  Calendar,
  Pill,
  FileText
} from 'lucide-react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface CreatePrescriptionFormProps {
  appointmentId: string;
  patientId: string;
  patientName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const FREQUENCY_OPTIONS = [
  { value: 'once_daily', label: 'Once Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'three_times_daily', label: 'Three Times Daily' },
  { value: 'four_times_daily', label: 'Four Times Daily' },
  { value: 'as_needed', label: 'As Needed' },
  { value: 'every_4_hours', label: 'Every 4 Hours' },
  { value: 'every_6_hours', label: 'Every 6 Hours' },
  { value: 'every_8_hours', label: 'Every 8 Hours' },
  { value: 'every_12_hours', label: 'Every 12 Hours' },
  { value: 'weekly', label: 'Weekly' }
];

const DURATION_OPTIONS = [
  { value: '3_days', label: '3 Days' },
  { value: '5_days', label: '5 Days' },
  { value: '7_days', label: '1 Week' },
  { value: '10_days', label: '10 Days' },
  { value: '14_days', label: '2 Weeks' },
  { value: '21_days', label: '3 Weeks' },
  { value: '30_days', label: '1 Month' },
  { value: '60_days', label: '2 Months' },
  { value: '90_days', label: '3 Months' },
  { value: 'ongoing', label: 'Ongoing' }
];

const COMMON_MEDICATIONS = [
  'Acetaminophen', 'Ibuprofen', 'Amoxicillin', 'Lisinopril', 'Metformin',
  'Atorvastatin', 'Omeprazole', 'Losartan', 'Albuterol', 'Gabapentin',
  'Hydrocodone', 'Tramadol', 'Sertraline', 'Fluoxetine', 'Amlodipine'
];

export default function CreatePrescriptionForm({ 
  appointmentId, 
  patientId, 
  patientName, 
  onSuccess, 
  onCancel 
}: CreatePrescriptionFormProps) {
  const { } = useAuth();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [isRefillable, setIsRefillable] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTemplates, setShowTemplates] = useState(false);
  const [drugInteractionWarnings, setDrugInteractionWarnings] = useState<string[]>([]);

  useEffect(() => {
    // Set default valid until date (30 days from now)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    setValidUntil(defaultDate.toISOString().split('T')[0]);
  }, []);

  const validateForm = (): boolean => {
    const formData = {
      medications,
      notes,
      validUntil,
      isRefillable
    };

    const validationErrors = prescriptionValidation.validatePrescription(formData);
    const newErrors: Record<string, string> = {};

    validationErrors.forEach(error => {
      newErrors[error.field] = error.message;
    });

    setErrors(newErrors);
    return validationErrors.length === 0;
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    let processedValue = value;
    
    // Sanitize medication name
    if (field === 'name') {
      processedValue = prescriptionValidation.sanitizeMedicationName(value);
    }
    
    // Format dosage
    if (field === 'dosage') {
      processedValue = prescriptionValidation.formatDosage(value);
    }

    const updated = medications.map((med, i) => 
      i === index ? { ...med, [field]: processedValue } : med
    );
    setMedications(updated);
    
    // Clear error for this field
    const errorKey = `medication_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }

    // Check for drug interactions
    checkDrugInteractions(updated);
  };

  const checkDrugInteractions = async (meds: Medication[]) => {
    try {
      const warnings = await prescriptionValidation.validateDrugInteraction(meds);
      setDrugInteractionWarnings(warnings.map(w => w.message));
    } catch (error) {
      console.error('Drug interaction check failed:', error);
    }
  };

  const handleTemplateSelect = (template: any) => {
    setMedications(template.medications);
    setNotes(template.commonNotes || '');
    setShowTemplates(false);
    
    // Clear any existing errors
    setErrors({});
    
    addToast({
      type: 'success',
      title: 'Template Applied',
      message: `Template "${template.name}" applied successfully`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors before submitting'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const prescriptionData: CreatePrescriptionRequest = {
        patientId,
        medications: medications.filter(med => med.name.trim()),
        notes: notes.trim() || undefined,
        validUntil: new Date(validUntil).toISOString(),
        appointmentId,
        isRefillable
      };

      await prescriptionService.createPrescription(prescriptionData);
      
      addToast({
        type: 'success',
        title: 'Prescription Created',
        message: `Prescription created successfully for ${patientName}`
      });
      
      onSuccess();
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Creation Failed',
        message: error.response?.data?.message || 'Failed to create prescription'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Prescription</h2>
              <p className="text-gray-600 mt-1">For {patientName}</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Medications Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Pill className="w-5 h-5 mr-2 text-blue-600" />
                Medications
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTemplates(true)}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Templates
                </button>
                <button
                  type="button"
                  onClick={addMedication}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Medication
                </button>
              </div>
            </div>

            {/* Drug Interaction Warnings */}
            {drugInteractionWarnings.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Drug Interaction Warning</h4>
                    <ul className="mt-1 text-sm text-yellow-700">
                      {drugInteractionWarnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {medications.map((medication, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Medication Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medication Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={medication.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`medication_${index}_name`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter medication name"
                          list={`medications-${index}`}
                        />
                        <datalist id={`medications-${index}`}>
                          {COMMON_MEDICATIONS.map(med => (
                            <option key={med} value={med} />
                          ))}
                        </datalist>
                      </div>
                      {errors[`medication_${index}_name`] && (
                        <p className="text-red-600 text-sm mt-1">{errors[`medication_${index}_name`]}</p>
                      )}
                    </div>

                    {/* Dosage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage *
                      </label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`medication_${index}_dosage`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 500mg, 10ml"
                      />
                      {errors[`medication_${index}_dosage`] && (
                        <p className="text-red-600 text-sm mt-1">{errors[`medication_${index}_dosage`]}</p>
                      )}
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency *
                      </label>
                      <select
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`medication_${index}_frequency`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select frequency</option>
                        {FREQUENCY_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors[`medication_${index}_frequency`] && (
                        <p className="text-red-600 text-sm mt-1">{errors[`medication_${index}_frequency`]}</p>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration *
                      </label>
                      <select
                        value={medication.duration}
                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`medication_${index}_duration`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select duration</option>
                        {DURATION_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors[`medication_${index}_duration`] && (
                        <p className="text-red-600 text-sm mt-1">{errors[`medication_${index}_duration`]}</p>
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructions
                      </label>
                      <textarea
                        value={medication.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="e.g., Take with food, Avoid alcohol, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4 inline mr-1" />
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Additional notes for the prescription..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Valid Until *
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.validUntil ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.validUntil && (
                  <p className="text-red-600 text-sm mt-1">{errors.validUntil}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRefillable"
                  checked={isRefillable}
                  onChange={(e) => setIsRefillable(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isRefillable" className="ml-2 block text-sm text-gray-700">
                  Allow refills
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Prescription
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Prescription Templates Modal */}
      {showTemplates && (
        <PrescriptionTemplates
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}
