import { useAppointmentBooking } from "@/contexts/AppointmentBookingContext";
import { appointmentService } from "@/services/appointmentService";
import { useState } from "react";

const ReviewConfirm = () => {
  const { state, dispatch } = useAppointmentBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookAppointment = async () => {
    if (!state.formData.selectedDoctor) {
      dispatch({ type: 'SET_ERROR', payload: 'Please select a doctor' });
      return;
    }

    if (!state.formData.patientName || !state.formData.patientEmail || !state.formData.patientPhone) {
      dispatch({ type: 'SET_ERROR', payload: 'Please fill in all patient details' });
      return;
    }

    if (!state.formData.appointmentDate || !state.formData.appointmentTime) {
      dispatch({ type: 'SET_ERROR', payload: 'Please select appointment date and time' });
      return;
    }

    try {
      setIsSubmitting(true);
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Calculate end time (assuming 1 hour appointment)
      const startTime = state.formData.appointmentTime;
      const [hours, minutes] = startTime.split(':').map(Number);
      const endTime = `${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      // Combine problem description and note to doctor
      let combinedDescription = state.formData.problemDescription || '';
      if (state.formData.noteToDoctor) {
        combinedDescription += (combinedDescription ? '\n\n' : '') + `Note to Doctor: ${state.formData.noteToDoctor}`;
      }

      const appointmentData = {
        doctorId: state.formData.selectedDoctor._id,
        appointmentDate: state.formData.appointmentDate,
        startTime: state.formData.appointmentTime,
        endTime: endTime,
        type: state.formData.appointmentType as 'in-person' | 'online',
        problemDescription: combinedDescription || undefined,
      };

      await appointmentService.createAppointment(appointmentData);
      
      // Reset form on success
      dispatch({ type: 'RESET_FORM' });
      
      // Show success message (you can implement a toast notification here)
      alert('Appointment booked successfully!');
      
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to book appointment' });
    } finally {
      setIsSubmitting(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not selected';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Not selected';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Review & Confirm
          </h2>
          <p className="text-lg text-gray-600">
            Double-check your appointment details before booking
          </p>
        </div>

        {/* Summary Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <span className="text-gray-600">Selected Doctor:</span>
                <p className="font-bold text-gray-800">
                  {state.formData.selectedDoctor?.name || 'Not selected'}
                </p>
                {state.formData.selectedDoctor && (
                  <p className="text-sm text-gray-500">
                    {state.formData.selectedDoctor.specialty}
                  </p>
                )}
              </div>
              <div>
                <span className="text-gray-600">Date & Time:</span>
                <p className="font-bold text-gray-800">
                  {formatDate(state.formData.appointmentDate)} - {formatTime(state.formData.appointmentTime)}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Consultation Type:</span>
                <p className="font-bold text-gray-800">
                  {state.formData.appointmentType === 'in-person' ? 'In-person' : 'Online Consultation'}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <span className="text-gray-600">Patient Name:</span>
                <p className="font-bold text-gray-800">
                  {state.formData.patientName || 'Not provided'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Contact:</span>
                <p className="font-bold text-gray-800">
                  {state.formData.patientPhone || 'Not provided'}
                </p>
                <p className="text-sm text-gray-500">
                  {state.formData.patientEmail || 'No email provided'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Uploaded Files:</span>
                <p className="font-bold text-gray-800">
                  {state.formData.uploadedFiles.length} document{state.formData.uploadedFiles.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Problem Description Summary */}
          {state.formData.problemDescription && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Problem Description:</h4>
              <p className="text-gray-700">{state.formData.problemDescription}</p>
              {state.formData.noteToDoctor && (
                <>
                  <h4 className="font-semibold text-gray-800 mb-2 mt-4">Note to Doctor:</h4>
                  <p className="text-gray-700">{state.formData.noteToDoctor}</p>
                </>
              )}
            </div>
          )}

          {/* Error Display */}
          {state.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{state.error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center mt-8">
            <button 
              onClick={handleBookAppointment}
              disabled={isSubmitting || state.isLoading}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || state.isLoading ? 'Booking Appointment...' : 'Book Appointment Now'}
            </button>
            <div>
              <button 
                onClick={() => dispatch({ type: 'RESET_FORM' })}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Cancel or Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewConfirm;
