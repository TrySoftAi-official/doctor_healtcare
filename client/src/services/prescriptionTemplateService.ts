import api from '@/lib/api';

export interface PrescriptionTemplate {
  _id?: string;
  name: string;
  specialty: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  commonNotes: string;
  createdBy: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplateRequest {
  name: string;
  specialty: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  commonNotes: string;
  isPublic?: boolean;
}

export const prescriptionTemplateService = {
  async getTemplates(specialty?: string) {
    const response = await api.get('/prescription-templates', { 
      params: { specialty } 
    });
    return response.data;
  },

  async getMyTemplates() {
    const response = await api.get('/prescription-templates/my-templates');
    return response.data;
  },

  async getTemplate(id: string) {
    const response = await api.get(`/prescription-templates/${id}`);
    return response.data;
  },

  async createTemplate(data: CreateTemplateRequest) {
    const response = await api.post('/prescription-templates', data);
    return response.data;
  },

  async updateTemplate(id: string, data: Partial<CreateTemplateRequest>) {
    const response = await api.patch(`/prescription-templates/${id}`, data);
    return response.data;
  },

  async deleteTemplate(id: string) {
    const response = await api.delete(`/prescription-templates/${id}`);
    return response.data;
  },

  async duplicateTemplate(id: string, newName: string) {
    const response = await api.post(`/prescription-templates/${id}/duplicate`, { 
      name: newName 
    });
    return response.data;
  }
};

// Common prescription templates
export const COMMON_TEMPLATES: Omit<PrescriptionTemplate, 'createdBy' | 'isPublic'>[] = [
  {
    name: 'Common Cold Relief',
    specialty: 'General Medicine',
    medications: [
      {
        name: 'Acetaminophen',
        dosage: '500mg',
        frequency: 'every_6_hours',
        duration: '7_days',
        instructions: 'Take with food to reduce stomach upset'
      },
      {
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'every_8_hours',
        duration: '7_days',
        instructions: 'Take with food, avoid if allergic to aspirin'
      }
    ],
    commonNotes: 'Rest and drink plenty of fluids. If symptoms persist beyond 7 days, contact your doctor.'
  },
  {
    name: 'Hypertension Management',
    specialty: 'Cardiology',
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'once_daily',
        duration: 'ongoing',
        instructions: 'Take at the same time each day, preferably in the morning'
      },
      {
        name: 'Hydrochlorothiazide',
        dosage: '25mg',
        frequency: 'once_daily',
        duration: 'ongoing',
        instructions: 'Take with food to reduce stomach upset'
      }
    ],
    commonNotes: 'Monitor blood pressure regularly. Follow low-sodium diet. Regular follow-up appointments required.'
  },
  {
    name: 'Diabetes Management',
    specialty: 'Endocrinology',
    medications: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'twice_daily',
        duration: 'ongoing',
        instructions: 'Take with meals to reduce stomach upset'
      }
    ],
    commonNotes: 'Monitor blood glucose levels regularly. Follow diabetic diet. Regular HbA1c testing required.'
  },
  {
    name: 'Pain Management - Post Surgery',
    specialty: 'Surgery',
    medications: [
      {
        name: 'Hydrocodone',
        dosage: '5mg',
        frequency: 'every_6_hours',
        duration: '7_days',
        instructions: 'Take as needed for pain, not to exceed 4 times daily'
      },
      {
        name: 'Ibuprofen',
        dosage: '600mg',
        frequency: 'every_8_hours',
        duration: '7_days',
        instructions: 'Take with food to reduce stomach upset'
      }
    ],
    commonNotes: 'Use ice packs for swelling. Follow post-operative care instructions. Contact if pain worsens.'
  }
];
