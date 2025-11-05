import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CreatePrescriptionForm from '../CreatePrescriptionForm';

// Mock the dependencies
vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({})
}));

vi.mock('@/components/Toast', () => ({
  useToast: () => ({
    addToast: vi.fn()
  })
}));

vi.mock('@/services/prescriptionService', () => ({
  prescriptionService: {
    createPrescription: vi.fn()
  }
}));

vi.mock('@/utils/prescriptionValidation', () => ({
  prescriptionValidation: {
    validatePrescription: vi.fn(() => []),
    sanitizeMedicationName: vi.fn((name) => name),
    formatDosage: vi.fn((dosage) => dosage),
    validateDrugInteraction: vi.fn(() => Promise.resolve([]))
  }
}));

describe('CreatePrescriptionForm', () => {
  const mockProps = {
    appointmentId: 'appointment-123',
    patientId: 'patient-123',
    patientName: 'John Doe',
    onSuccess: vi.fn(),
    onCancel: vi.fn()
  };

  it('renders prescription form with patient name', () => {
    render(<CreatePrescriptionForm {...mockProps} />);
    
    expect(screen.getByText('Create Prescription')).toBeInTheDocument();
    expect(screen.getByText('For John Doe')).toBeInTheDocument();
  });

  it('renders medication form fields', () => {
    render(<CreatePrescriptionForm {...mockProps} />);
    
    expect(screen.getByText('Medications')).toBeInTheDocument();
    expect(screen.getByText('Add Medication')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
  });

  it('renders form validation fields', () => {
    render(<CreatePrescriptionForm {...mockProps} />);
    
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Valid Until')).toBeInTheDocument();
    expect(screen.getByText('Allow refills')).toBeInTheDocument();
  });
});
