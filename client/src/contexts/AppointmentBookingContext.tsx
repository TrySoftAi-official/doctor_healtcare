import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';

// Types
export interface Doctor {
  _id: string;
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar?: string;
  isAvailable: boolean;
}

export interface AppointmentFormData {
  // Doctor Selection
  selectedDoctor: Doctor | null;
  
  // Patient Details
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  
  // Appointment Details
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: 'in-person' | 'online';
  
  // Problem Description
  problemDescription: string;
  noteToDoctor: string;
  uploadedFiles: File[];
}

export interface AppointmentBookingState {
  currentStep: number;
  formData: AppointmentFormData;
  isLoading: boolean;
  error: string | null;
}

// Action Types
type AppointmentBookingAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SELECT_DOCTOR'; payload: Doctor }
  | { type: 'UPDATE_PATIENT_DETAILS'; payload: Partial<Pick<AppointmentFormData, 'patientName' | 'patientEmail' | 'patientPhone'>> }
  | { type: 'UPDATE_APPOINTMENT_DETAILS'; payload: Partial<Pick<AppointmentFormData, 'appointmentDate' | 'appointmentTime' | 'appointmentType'>> }
  | { type: 'UPDATE_PROBLEM_DESCRIPTION'; payload: Partial<Pick<AppointmentFormData, 'problemDescription' | 'noteToDoctor'>> }
  | { type: 'ADD_UPLOADED_FILE'; payload: File }
  | { type: 'REMOVE_UPLOADED_FILE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FORM' };

// Initial State
const initialState: AppointmentBookingState = {
  currentStep: 1,
  formData: {
    selectedDoctor: null,
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: 'in-person',
    problemDescription: '',
    noteToDoctor: '',
    uploadedFiles: [],
  },
  isLoading: false,
  error: null,
};

// Reducer
function appointmentBookingReducer(state: AppointmentBookingState, action: AppointmentBookingAction): AppointmentBookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SELECT_DOCTOR':
      return {
        ...state,
        formData: { ...state.formData, selectedDoctor: action.payload },
        currentStep: 2,
      };
    
    case 'UPDATE_PATIENT_DETAILS':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    
    case 'UPDATE_APPOINTMENT_DETAILS':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    
    case 'UPDATE_PROBLEM_DESCRIPTION':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    
    case 'ADD_UPLOADED_FILE':
      return {
        ...state,
        formData: {
          ...state.formData,
          uploadedFiles: [...state.formData.uploadedFiles, action.payload],
        },
      };
    
    case 'REMOVE_UPLOADED_FILE':
      return {
        ...state,
        formData: {
          ...state.formData,
          uploadedFiles: state.formData.uploadedFiles.filter((_, index) => index !== action.payload),
        },
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET_FORM':
      return initialState;
    
    default:
      return state;
  }
}

// Context
const AppointmentBookingContext = createContext<{
  state: AppointmentBookingState;
  dispatch: React.Dispatch<AppointmentBookingAction>;
} | null>(null);

// Provider
export function AppointmentBookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appointmentBookingReducer, initialState);

  return (
    <AppointmentBookingContext.Provider value={{ state, dispatch }}>
      {children}
    </AppointmentBookingContext.Provider>
  );
}

// Hook
export function useAppointmentBooking() {
  const context = useContext(AppointmentBookingContext);
  if (!context) {
    throw new Error('useAppointmentBooking must be used within an AppointmentBookingProvider');
  }
  return context;
}
