import { CalendarClock, BadgeCheck, X } from "lucide-react";
import { useState, useEffect } from "react";
import { appointmentService } from "@/services/appointmentService";
import { doctorService } from "@/services/doctorService";

interface NextAppointment {
  id: string;
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  doctor?: {
    id: string;
    name: string;
    specialty: string;
    avatar?: string;
  };
}

export default function NextAppointmentCard() {
  const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchNextAppointment = async () => {
      let appointments;
      try {
        setLoading(true);
        appointments = await appointmentService.getUpcomingAppointments();
        console.log('Fetched appointments:', appointments);
        
        if (appointments && appointments.length > 0) {
          const nextAppt = appointments[0];
          console.log('Next appointment data:', nextAppt);
          
          let doctorData;
          
          // Check if doctor data is already populated in the appointment
          if (nextAppt.doctorId && typeof nextAppt.doctorId === 'object') {
            // Doctor data is already populated
            doctorData = nextAppt.doctorId;
            console.log('Using populated doctor data:', doctorData);
          } else {
            // Fetch doctor details separately
            doctorData = await doctorService.getDoctor(nextAppt.doctorId);
            console.log('Fetched doctor data:', doctorData);
          }
          
          // Handle the doctor data structure properly
          console.log('Doctor data structure:', JSON.stringify(doctorData, null, 2));
          
          let doctorName = 'Unknown Doctor';
          let doctorSpecialty = 'General Medicine';
          let doctorAvatar = null;
          
          if (doctorData) {
            // Check if doctor has user data (backend structure: doctorData.userId)
            if (doctorData.userId && doctorData.userId.firstName && doctorData.userId.lastName) {
              doctorName = `${doctorData.userId.firstName} ${doctorData.userId.lastName}`;
            } else if (doctorData.user && doctorData.user.firstName && doctorData.user.lastName) {
              // Fallback for different data structure
              doctorName = `${doctorData.user.firstName} ${doctorData.user.lastName}`;
            } else if (doctorData.name) {
              doctorName = doctorData.name;
            }
            
            // Get specialty
            if (doctorData.specialty) {
              doctorSpecialty = doctorData.specialty;
            }
            
            // Get avatar
            if (doctorData.avatar) {
              doctorAvatar = doctorData.avatar;
            } else if (doctorData.userId && doctorData.userId.avatar) {
              doctorAvatar = doctorData.userId.avatar;
            } else if (doctorData.user && doctorData.user.avatar) {
              doctorAvatar = doctorData.user.avatar;
            }
          }
          
          console.log('Processed doctor info:', { doctorName, doctorSpecialty, doctorAvatar });
          console.log('Raw doctor data specialty:', doctorData.specialty);
          console.log('Raw doctor data:', doctorData);
          
          // Handle appointment data structure
          const appointmentData = {
            id: nextAppt._id || nextAppt.id,
            doctorId: typeof nextAppt.doctorId === 'string' 
              ? nextAppt.doctorId 
              : nextAppt.doctorId?._id || nextAppt.doctorId?.id || 'N/A',
            appointmentDate: nextAppt.appointmentDate,
            startTime: nextAppt.startTime,
            endTime: nextAppt.endTime,
            status: nextAppt.status || 'Pending',
            doctor: {
              id: doctorData?._id || doctorData?.id,
              name: doctorName,
              specialty: doctorSpecialty,
              avatar: doctorAvatar
            }
          };
          
          console.log('Processed appointment data:', appointmentData);
          setNextAppointment(appointmentData);
        }
      } catch (error) {
        console.error('Error fetching next appointment:', error);
        console.error('Appointment data:', appointments);
      } finally {
        setLoading(false);
      }
    };

    fetchNextAppointment();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!nextAppointment) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Next Appointment</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No upcoming appointments</p>
        </div>
      </div>
    );
  }

  // Debug: Log the final appointment data
  console.log('Final appointment data for rendering:', nextAppointment);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'Invalid Date';
      }
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid Date';
    }
  };

  const formatTime = (timeString: string) => {
    try {
      if (!timeString) {
        console.error('Empty time string');
        return 'Invalid Time';
      }
      
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error, timeString);
      return 'Invalid Time';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Next Appointment</h3>
          <button 
            onClick={() => setShowDetails(true)}
            className="text-white bg-blue-600 hover:bg-blue-700 text-xs px-3 py-2 rounded-md transition-colors"
          >
            View Details
          </button>
        </div>
        <div className="flex items-center gap-4">
          <img 
            src={nextAppointment.doctor?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"} 
            className="w-12 h-12 rounded-lg object-cover" 
            alt={nextAppointment.doctor?.name}
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">{nextAppointment.doctor?.name || 'Loading...'}</p>
            <p className="text-xs text-gray-500">{nextAppointment.doctor?.specialty || 'General Medicine'}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                <CalendarClock className="w-3 h-3 mr-1" /> {formatTime(nextAppointment.startTime)}, {formatDate(nextAppointment.appointmentDate)}
              </span>
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                <BadgeCheck className="w-3 h-3 mr-1" /> {nextAppointment.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Popup Modal */}
      {showDetails && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetails(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto animate-slideIn transform transition-all duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
                <p className="text-sm text-gray-600 mt-1">View complete appointment information</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Doctor Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img 
                      src={nextAppointment.doctor?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" 
                      alt={nextAppointment.doctor?.name}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{nextAppointment.doctor?.name}</h3>
                    <p className="text-lg text-blue-600 font-medium">{nextAppointment.doctor?.specialty}</p>
                    <p className="text-sm text-gray-500 mt-1">Your assigned doctor</p>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Appointment Details</h4>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CalendarClock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date & Time</label>
                        <p className="text-lg font-semibold text-gray-800">
                          {typeof nextAppointment.appointmentDate === 'string' 
                            ? formatDate(nextAppointment.appointmentDate) 
                            : 'Invalid Date'
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          {typeof nextAppointment.startTime === 'string' && typeof nextAppointment.endTime === 'string'
                            ? `${formatTime(nextAppointment.startTime)} - ${formatTime(nextAppointment.endTime)}`
                            : 'Invalid Time'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <BadgeCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ml-2 ${
                          nextAppointment.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : nextAppointment.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {nextAppointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Technical Details</h4>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Appointment ID</label>
                    <p className="text-sm text-gray-800 font-mono bg-white px-2 py-1 rounded border">
                      {typeof nextAppointment.id === 'string' 
                        ? nextAppointment.id 
                        : (nextAppointment.id as any)?._id || (nextAppointment.id as any)?.id || 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Doctor ID</label>
                    <p className="text-sm text-gray-800 font-mono bg-white px-2 py-1 rounded border">
                      {typeof nextAppointment.doctorId === 'string' 
                        ? nextAppointment.doctorId 
                        : (nextAppointment.doctorId as any)?._id || (nextAppointment.doctorId as any)?.id || 'N/A'
                      }
                    </p>
                  </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {/* <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Close
                  </button>
                  <button className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    Reschedule Appointment
                  </button>
                  <button className="px-6 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    Cancel Appointment
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
