import { useAppointmentBooking } from "@/contexts/AppointmentBookingContext";

const DebugFormData = () => {
  const { state } = useAppointmentBooking();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg max-w-md text-xs z-50">
      <h4 className="font-bold mb-2">Debug Form Data:</h4>
      <div className="space-y-1">
        <div>Step: {state.currentStep}</div>
        <div>Doctor: {state.formData.selectedDoctor?.name || 'None'}</div>
        <div>Date: {state.formData.appointmentDate || 'None'}</div>
        <div>Time: {state.formData.appointmentTime || 'None'}</div>
        <div>Type: {state.formData.appointmentType}</div>
        <div>Patient: {state.formData.patientName || 'None'}</div>
        <div>Email: {state.formData.patientEmail || 'None'}</div>
        <div>Phone: {state.formData.patientPhone || 'None'}</div>
        <div>Problem: {state.formData.problemDescription ? 'Set' : 'None'}</div>
        <div>Files: {state.formData.uploadedFiles.length}</div>
        {state.error && <div className="text-red-400">Error: {state.error}</div>}
      </div>
    </div>
  );
};

export default DebugFormData;
