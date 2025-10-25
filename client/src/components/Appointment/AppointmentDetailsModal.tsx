import React from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, MapPin, Video } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { appointmentService } from '@/services/appointmentService';

interface AppointmentDetailsModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (appointmentId: string, newStatus: string) => void;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onStatusChange
}) => {
  const { addToast } = useToast();

  if (!isOpen || !appointment) return null;

  const handleStatusChange = async (newStatus: string) => {
    try {
      await appointmentService.updateAppointmentStatus(appointment._id, newStatus);
      onStatusChange(appointment._id, newStatus);
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Appointment status changed to ${newStatus}`,
      });
      onClose();
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: error.response?.data?.message || 'Failed to update appointment status',
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Not set';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Debug Information */}
          {import.meta.env.DEV && (
            <div className="bg-gray-100 p-4 rounded-lg text-xs">
              <h4 className="font-bold mb-2">Debug Information:</h4>
              <div className="space-y-1">
                <div>Appointment ID: {appointment._id}</div>
                <div>Patient ID: {JSON.stringify(appointment.patientId)}</div>
                <div>Patient User: {JSON.stringify(appointment.patientUser)}</div>
                <div>Status: {appointment.status}</div>
                <div>Problem: {appointment.problemDescription}</div>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>

          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Name</span>
                <p className="text-gray-800">
                  {appointment.patientId?.userId?.firstName || appointment.patientUser?.firstName || 'Unknown'} {appointment.patientId?.userId?.lastName || appointment.patientUser?.lastName || 'Patient'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Email</span>
                <p className="text-gray-800 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {appointment.patientId?.userId?.email || appointment.patientUser?.email || 'Not provided'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Phone</span>
                <p className="text-gray-800 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {appointment.patientId?.userId?.phone || appointment.patientUser?.phone || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Date</span>
                <p className="text-gray-800">{formatDate(appointment.appointmentDate)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Time</span>
                <p className="text-gray-800 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Type</span>
                <p className="text-gray-800 flex items-center">
                  {appointment.type === 'in-person' ? (
                    <>
                      <MapPin className="w-4 h-4 mr-1" />
                      In-person
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-1" />
                      Online Consultation
                    </>
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Duration</span>
                <p className="text-gray-800">
                  {appointment.duration || '1 hour'}
                </p>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Problem Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {appointment.problemDescription || 'No problem description provided'}
            </p>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Doctor Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {appointment.notes}
              </p>
            </div>
          )}

          {/* Diagnosis */}
          {appointment.diagnosis && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Diagnosis</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {appointment.diagnosis}
              </p>
            </div>
          )}

          {/* Treatment */}
          {appointment.treatment && (
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Treatment</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {appointment.treatment}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-3">
            {/* Debug: Show current status */}
            <div className="text-xs text-gray-500 mb-2 w-full">
              Current Status: {appointment.status} (Type: {typeof appointment.status})
            </div>
            
            {/* Status-specific buttons */}
            {(appointment.status === 'Pending') && (
              <>
                <button
                  onClick={() => handleStatusChange('Confirmed')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  ✅ Confirm Appointment
                </button>
                <button
                  onClick={() => handleStatusChange('Cancelled')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  ❌ Cancel Appointment
                </button>
                <button
                  onClick={() => handleStatusChange('No Show')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  🚫 Mark as No Show
                </button>
              </>
            )}
            
            {(appointment.status === 'Confirmed') && (
              <>
                <button
                  onClick={() => handleStatusChange('Completed')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ✅ Mark as Completed
                </button>
                <button
                  onClick={() => handleStatusChange('Cancelled')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  ❌ Cancel Appointment
                </button>
                <button
                  onClick={() => handleStatusChange('No Show')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  🚫 Mark as No Show
                </button>
              </>
            )}
            
            {(appointment.status === 'Completed') && (
              <div className="text-green-600 font-medium">
                ✅ Appointment Completed
              </div>
            )}
            
            {(appointment.status === 'Cancelled') && (
              <div className="text-red-600 font-medium">
                ❌ Appointment Cancelled
              </div>
            )}
            
            {(appointment.status === 'No Show') && (
              <div className="text-orange-600 font-medium">
                🚫 Patient No Show
              </div>
            )}
            
            {/* Fallback: Show all possible actions if status doesn't match */}
            {!['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'].includes(appointment.status) && (
              <>
                <button
                  onClick={() => handleStatusChange('Confirmed')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  ✅ Confirm
                </button>
                <button
                  onClick={() => handleStatusChange('Completed')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ✅ Complete
                </button>
                <button
                  onClick={() => handleStatusChange('Cancelled')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={() => handleStatusChange('No Show')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  🚫 No Show
                </button>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
