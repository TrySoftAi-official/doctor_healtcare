import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointmentService";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Video, 
  MapPin,
  Plus,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText
} from "lucide-react";

interface Appointment {
  id: string;
  patient?: string;
  doctor?: string;
  patientPhone?: string;
  doctorSpecialty?: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: string;
  notes: string;
  symptoms?: string;
  location?: string;
}

const AppointmentsContent = () => {
  const { user } = useAuth();
  const userRole = user?.role || "Patient";
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("list"); // list, calendar, grid
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch appointments based on user role
  const { data: appointmentsData, isLoading, error } = useQuery({
    queryKey: ['appointments', userRole, user?.id],
    queryFn: async () => {
      if (userRole === "Doctor") {
        return await appointmentService.getAppointments();
      } else if (userRole === "Patient") {
        return await appointmentService.getAppointments();
      } else {
        // Administrator - get all appointments
        return await appointmentService.getAppointments();
      }
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Transform appointments data based on role
  const getRoleSpecificData = () => {
    const appointments = appointmentsData || [];
    
    switch (userRole) {
      case "Administrator":
        return {
          title: "System Appointments",
          description: "Manage all system appointments and scheduling",
          appointments: appointments.map((apt: any) => ({
            id: apt._id,
            patient: `${apt.patientId?.userId?.firstName || 'Unknown'} ${apt.patientId?.userId?.lastName || 'Patient'}`,
            doctor: `${apt.doctorId?.userId?.firstName || 'Dr.'} ${apt.doctorId?.userId?.lastName || 'Unknown'}`,
            date: new Date(apt.appointmentDate).toLocaleDateString(),
            time: new Date(apt.appointmentDate).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            }),
            duration: apt.duration || "30 min",
            type: apt.appointmentType || "Consultation",
            status: apt.status?.toLowerCase() || "pending",
            notes: apt.notes || "No notes available"
          }))
        };
      case "Doctor":
        return {
          title: "My Appointments",
          description: "Manage your patient appointments and schedule",
          appointments: appointments
            .filter((apt: any) => apt.doctorId?._id === user?.id)
            .map((apt: any) => ({
              id: apt._id,
              patient: (() => {
                const firstName = apt.patientId?.userId?.firstName;
                const lastName = apt.patientId?.userId?.lastName;
                if (firstName && lastName) return `${firstName} ${lastName}`;
                if (firstName) return firstName;
                if (lastName) return lastName;
                return 'Unknown Patient';
              })(),
              patientPhone: apt.patientId?.phoneNumber || "No phone available",
              date: new Date(apt.appointmentDate).toLocaleDateString(),
              time: new Date(apt.appointmentDate).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              }),
              duration: apt.duration || "30 min",
              type: apt.appointmentType || "Consultation",
              status: apt.status?.toLowerCase() || "pending",
              notes: apt.notes || "No notes available",
              symptoms: apt.symptoms || "No symptoms reported"
            }))
        };
      case "Patient":
        return {
          title: "My Appointments",
          description: "View and manage your healthcare appointments",
          appointments: appointments
            .filter((apt: any) => apt.patientId?._id === user?.id)
            .map((apt: any) => ({
              id: apt._id,
              doctor: (() => {
                const firstName = apt.doctorId?.userId?.firstName;
                const lastName = apt.doctorId?.userId?.lastName;
                if (firstName && lastName) return `Dr. ${firstName} ${lastName}`;
                if (firstName) return `Dr. ${firstName}`;
                if (lastName) return `Dr. ${lastName}`;
                return 'Dr. Unknown';
              })(),
              doctorSpecialty: apt.doctorId?.specialty || "General Medicine",
              date: new Date(apt.appointmentDate).toLocaleDateString(),
              time: new Date(apt.appointmentDate).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              }),
              duration: apt.duration || "30 min",
              type: apt.appointmentType || "Consultation",
              status: apt.status?.toLowerCase() || "pending",
              location: apt.location || "Main Clinic",
              notes: apt.notes || "No notes available"
            }))
        };
      default:
        return {
          title: "Appointments",
          description: "Manage appointments",
          appointments: []
        };
    }
  };

  const data = getRoleSpecificData();

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      confirmed: CheckCircle,
      pending: Clock,
      cancelled: XCircle,
      completed: CheckCircle
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const filteredAppointments = data.appointments.filter((appointment: Appointment) =>
    (userRole === "Patient" ? appointment.doctor : appointment.patient)
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
              <div className="divide-y divide-gray-200">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 animate-pulse">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-48"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 rounded-lg shadow-sm p-6 border border-red-200">
          <div className="text-red-600 text-center">
            <p className="font-medium">Error loading appointments</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          {data.title}
        </h1>
        <p className="text-gray-600">
          {data.description}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${userRole === "Patient" ? "doctors" : "patients"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
         
        </div>
   
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {userRole === "Administrator" ? "All Appointments" : 
                 userRole === "Doctor" ? "Today's Schedule" : "Upcoming Appointments"}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment: Appointment) => {
                const StatusIcon = getStatusIcon(appointment.status);
                return (
                  <div
                    key={appointment.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {userRole === "Patient" ? appointment.doctor : appointment.patient}
                            </h4>
                            {userRole === "Patient" && (
                              <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
                            )}
                            {userRole === "Doctor" && (
                              <p className="text-sm text-gray-600">{appointment.patientPhone}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.duration}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{appointment.notes}</p>
                        {userRole === "Doctor" && appointment.symptoms && (
                          <p className="text-sm text-red-600">
                            <strong>Symptoms:</strong> {appointment.symptoms}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {appointment.status}
                        </span>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {selectedAppointment ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Appointment Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Patient/Doctor</label>
                    <p className="text-gray-900">
                      {userRole === "Patient" ? selectedAppointment.doctor : selectedAppointment.patient}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <p className="text-gray-900">{selectedAppointment.date}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Time</label>
                      <p className="text-gray-900">{selectedAppointment.time}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Duration</label>
                      <p className="text-gray-900">{selectedAppointment.duration}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-gray-900">{selectedAppointment.type}</p>
                    </div>
                  </div>
                  {selectedAppointment.location && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedAppointment.location}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                <p className="text-gray-600 mb-4">{selectedAppointment.notes}</p>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    <FileText className="w-4 h-4 mr-2" />
                    View Records
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select an appointment
              </h3>
              <p className="text-gray-600">
                Choose an appointment from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsContent;
