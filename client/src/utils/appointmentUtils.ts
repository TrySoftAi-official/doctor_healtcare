// Utility functions for appointment data formatting and validation

export const formatAppointmentDate = (dateString: string | Date): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const formatAppointmentTime = (timeString: string): string => {
  try {
    if (!timeString) return 'Invalid Time';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
};

export const calculateDuration = (startTime: string, endTime: string): string => {
  try {
    if (!startTime || !endTime) return '30 min';
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    const durationMinutes = endMinutes - startMinutes;
    
    if (durationMinutes <= 0) return '30 min';
    
    return `${durationMinutes} min`;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return '30 min';
  }
};

export const formatPatientName = (patientData: any, problemDescription?: string): string => {
  // Handle null or undefined patient data
  if (!patientData) {
    // Try to extract patient name from problem description as fallback
    if (problemDescription) {
      // Look for email pattern to extract name
      const emailMatch = problemDescription.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch) {
        const email = emailMatch[1];
        // Extract name from email (before @)
        const namePart = email.split('@')[0];
        // Convert to title case
        const name = namePart.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return name;
      }
    }
    return 'Unknown Patient';
  }
  
  const firstName = patientData?.userId?.firstName;
  const lastName = patientData?.userId?.lastName;
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return 'Unknown Patient';
};

export const formatDoctorName = (doctorData: any): string => {
  const firstName = doctorData?.userId?.firstName;
  const lastName = doctorData?.userId?.lastName;
  if (firstName && lastName) return `Dr. ${firstName} ${lastName}`;
  if (firstName) return `Dr. ${firstName}`;
  if (lastName) return `Dr. ${lastName}`;
  return 'Dr. Unknown';
};

export const getStatusColor = (status: string): string => {
  const colors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800"
  };
  return colors[status?.toLowerCase() as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const validateAppointmentData = (appointment: any): boolean => {
  return !!(
    appointment &&
    appointment._id &&
    appointment.appointmentDate &&
    appointment.startTime &&
    appointment.endTime &&
    appointment.status
  );
};
