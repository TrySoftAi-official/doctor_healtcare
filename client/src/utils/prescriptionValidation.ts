export interface ValidationError {
  field: string;
  message: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface PrescriptionFormData {
  medications: Medication[];
  notes?: string;
  validUntil: string;
  isRefillable?: boolean;
}

export const prescriptionValidation = {
  validateMedication(medication: Medication, index: number): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!medication.name.trim()) {
      errors.push({
        field: `medication_${index}_name`,
        message: 'Medication name is required'
      });
    } else if (medication.name.length < 2) {
      errors.push({
        field: `medication_${index}_name`,
        message: 'Medication name must be at least 2 characters'
      });
    }

    if (!medication.dosage.trim()) {
      errors.push({
        field: `medication_${index}_dosage`,
        message: 'Dosage is required'
      });
    } else if (!/^\d+[a-zA-Z]*$/.test(medication.dosage.replace(/\s/g, ''))) {
      errors.push({
        field: `medication_${index}_dosage`,
        message: 'Dosage must be in valid format (e.g., 500mg, 10ml)'
      });
    }

    if (!medication.frequency) {
      errors.push({
        field: `medication_${index}_frequency`,
        message: 'Frequency is required'
      });
    }

    if (!medication.duration) {
      errors.push({
        field: `medication_${index}_duration`,
        message: 'Duration is required'
      });
    }

    if (medication.instructions && medication.instructions.length > 500) {
      errors.push({
        field: `medication_${index}_instructions`,
        message: 'Instructions must be less than 500 characters'
      });
    }

    return errors;
  },

  validatePrescription(data: PrescriptionFormData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate medications
    if (!data.medications || data.medications.length === 0) {
      errors.push({
        field: 'medications',
        message: 'At least one medication is required'
      });
    } else {
      data.medications.forEach((medication, index) => {
        const medicationErrors = this.validateMedication(medication, index);
        errors.push(...medicationErrors);
      });
    }

    // Validate valid until date
    if (!data.validUntil) {
      errors.push({
        field: 'validUntil',
        message: 'Valid until date is required'
      });
    } else {
      const validUntilDate = new Date(data.validUntil);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (validUntilDate <= today) {
        errors.push({
          field: 'validUntil',
          message: 'Valid until date must be in the future'
        });
      }

      // Check if date is not too far in the future (1 year max)
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      if (validUntilDate > oneYearFromNow) {
        errors.push({
          field: 'validUntil',
          message: 'Valid until date cannot be more than 1 year in the future'
        });
      }
    }

    // Validate notes
    if (data.notes && data.notes.length > 1000) {
      errors.push({
        field: 'notes',
        message: 'Notes must be less than 1000 characters'
      });
    }

    return errors;
  },

  validateDrugInteraction(medications: Medication[]): Promise<ValidationError[]> {
    // This would integrate with a drug interaction API
    // For now, return empty array as placeholder
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        const errors: ValidationError[] = [];
        
        // Basic interaction checks (simplified)
        const medicationNames = medications.map(med => med.name.toLowerCase());
        
        // Check for common interactions
        if (medicationNames.includes('warfarin') && medicationNames.includes('aspirin')) {
          errors.push({
            field: 'drug_interaction',
            message: 'Warning: Warfarin and Aspirin may increase bleeding risk'
          });
        }
        
        if (medicationNames.includes('metformin') && medicationNames.includes('alcohol')) {
          errors.push({
            field: 'drug_interaction',
            message: 'Warning: Metformin and alcohol may increase risk of lactic acidosis'
          });
        }

        resolve(errors);
      }, 1000);
    });
  },

  validateDosage(medication: string, dosage: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Common dosage validation patterns
    const dosagePatterns = {
      'acetaminophen': /^\d{1,4}mg$/,
      'ibuprofen': /^\d{1,4}mg$/,
      'amoxicillin': /^\d{1,4}mg$/,
      'metformin': /^\d{1,4}mg$/,
      'lisinopril': /^\d{1,3}mg$/,
      'atorvastatin': /^\d{1,3}mg$/
    };

    const medName = medication.toLowerCase();
    const pattern = dosagePatterns[medName as keyof typeof dosagePatterns];
    
    if (pattern && !pattern.test(dosage)) {
      errors.push({
        field: 'dosage',
        message: `Invalid dosage format for ${medication}. Expected format: XXXmg`
      });
    }

    return errors;
  },

  sanitizeMedicationName(name: string): string {
    return name
      .trim()
      .replace(/[^a-zA-Z0-9\s\-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  },

  formatDosage(dosage: string): string {
    return dosage
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/(\d+)(mg|ml|g|mcg|units?)/, '$1$2'); // Ensure proper format
  },

  getValidationSummary(errors: ValidationError[]): string {
    if (errors.length === 0) return '';
    
    const fieldCounts = errors.reduce((acc, error) => {
      const field = error.field.split('_')[0];
      acc[field] = (acc[field] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summary = Object.entries(fieldCounts)
      .map(([field, count]) => `${field}: ${count} error${count > 1 ? 's' : ''}`)
      .join(', ');

    return `Validation failed: ${summary}`;
  }
};

export default prescriptionValidation;
