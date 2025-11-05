import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { prescriptionTemplateService, type PrescriptionTemplate, COMMON_TEMPLATES } from '@/services/prescriptionTemplateService';
import { useToast } from '@/components/Toast';
import { 
  Search, 
  Copy, 
  Trash2, 
  Star,
  Clock,
  Users,
  X
} from 'lucide-react';

interface PrescriptionTemplatesProps {
  onSelectTemplate: (template: PrescriptionTemplate) => void;
  onClose: () => void;
}

export default function PrescriptionTemplates({ onSelectTemplate, onClose }: PrescriptionTemplatesProps) {
  const { } = useAuth();
  const { addToast } = useToast();
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [commonTemplates] = useState<PrescriptionTemplate[]>(COMMON_TEMPLATES.map(t => ({
    ...t,
    createdBy: 'system',
    isPublic: true
  })));
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  const specialties = [
    'General Medicine',
    'Cardiology',
    'Endocrinology',
    'Neurology',
    'Pediatrics',
    'Surgery',
    'Dermatology',
    'Orthopedics',
    'Psychiatry',
    'Oncology'
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await prescriptionTemplateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load prescription templates'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateTemplate = async (template: PrescriptionTemplate) => {
    try {
      const newName = `${template.name} (Copy)`;
      await prescriptionTemplateService.duplicateTemplate(template._id!, newName);
      addToast({
        type: 'success',
        title: 'Template Duplicated',
        message: `Template "${newName}" created successfully`
      });
      loadTemplates();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to duplicate template'
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await prescriptionTemplateService.deleteTemplate(templateId);
      addToast({
        type: 'success',
        title: 'Template Deleted',
        message: 'Template deleted successfully'
      });
      loadTemplates();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete template'
      });
    }
  };

  const filteredTemplates = [...templates, ...commonTemplates].filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || template.specialty === selectedSpecialty;
    const matchesVisibility = !showPublicOnly || template.isPublic;
    
    return matchesSearch && matchesSpecialty && matchesVisibility;
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Prescription Templates</h2>
              <p className="text-gray-600 mt-1">Select a template to quickly create prescriptions</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPublicOnly}
                onChange={(e) => setShowPublicOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Public only</span>
            </label>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredTemplates.map((template, index) => (
              <div
                key={template._id || `common-${index}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.specialty}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {template.isPublic && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Users className="w-3 h-3 mr-1" />
                        Public
                      </span>
                    )}
                    {template.createdBy === 'system' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Star className="w-3 h-3 mr-1" />
                        System
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>{template.medications.length}</strong> medication{template.medications.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1">
                    {template.medications.slice(0, 2).map((med, medIndex) => (
                      <div key={medIndex} className="text-xs text-gray-500">
                        {med.name} - {med.dosage}
                      </div>
                    ))}
                    {template.medications.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{template.medications.length - 2} more...
                      </div>
                    )}
                  </div>
                </div>

                {template.commonNotes && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {template.commonNotes}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {template.createdBy === 'system' ? 'System Template' : 'Custom Template'}
                  </span>
                  <div className="flex items-center space-x-2">
                    {template._id && template.createdBy !== 'system' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateTemplate(template);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(template._id!);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(template);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
