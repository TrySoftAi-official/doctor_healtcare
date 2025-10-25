// import { BadgeCheck } from "lucide-react"; // Removed unused import
import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointmentService";
import { useAuth } from "@/providers/AuthProvider";
import { formatAppointmentTime, formatPatientName } from "@/utils/appointmentUtils";

const Row = ({ avatar, name, problem, time, status }: { avatar: string; name: string; problem: string; time: string; status: "Pending" | "Confirmed" | "Completed" | "Cancelled" }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return "bg-yellow-100 text-yellow-700";
      case 'confirmed':
        return "bg-green-100 text-green-700";
      case 'completed':
        return "bg-blue-100 text-blue-700";
      case 'cancelled':
      case 'canceled':
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="grid grid-cols-12 items-center py-3 px-4 hover:bg-gray-50 rounded-lg">
      <div className="col-span-4 flex items-center gap-3">
        <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-500">{problem}</p>
        </div>
      </div>
      <div className="col-span-2 text-sm text-gray-700">{time}</div>
      <div className="col-span-3">
        <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      <div className="col-span-3 text-right">
        <button className="text-white bg-blue-600 hover:bg-blue-700 text-xs px-3 py-2 rounded-md">View Details</button>
      </div>
    </div>
  );
};

export default function UpcomingAppointmentsTable() {
  const { user } = useAuth();

  
  // Fetch appointments for the doctor
  const { data: appointmentsData, isLoading, error } = useQuery({
    queryKey: ['doctor-upcoming-appointments', user?.id],
    queryFn: async () => {
      // Use getAppointments() and filter on frontend since backend filtering has issues
      return await appointmentService.getAppointments();
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Filter and transform appointments for this doctor
  const getUpcomingAppointments = () => {
    if (!appointmentsData) return [];
    
    console.log('All appointments data:', appointmentsData);
    console.log('Current user ID:', user?.id);
    console.log('User role:', user?.role);
    
    // Filter appointments for this doctor and get upcoming ones
    const doctorAppointments = appointmentsData.filter((apt: any) => {
      console.log('Checking appointment:', {
        appointmentId: apt._id,
        doctorId: apt.doctorId,
        doctorIdType: typeof apt.doctorId,
        doctorIdId: apt.doctorId?._id,
        doctorUserId: apt.doctorId?.userId?._id,
        userRole: user?.role,
        userId: user?.id
      });
      
      // Check if this appointment belongs to the current doctor
      const isDoctorAppointment = apt.doctorId?._id === user?.id || 
                                  apt.doctorId === user?.id ||
                                  (typeof apt.doctorId === 'object' && apt.doctorId?.userId?._id === user?.id);
      
      const isUpcoming = new Date(apt.appointmentDate) >= new Date();
      
      console.log('Appointment filter result:', { isDoctorAppointment, isUpcoming });
      
      return isDoctorAppointment && isUpcoming;
    });

    console.log('Filtered doctor appointments:', doctorAppointments);

    // Sort by appointment date
    const sortedAppointments = doctorAppointments.sort((a: any, b: any) => 
      new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
    );

    // Take only the next 5 appointments
    return sortedAppointments.slice(0, 5).map((apt: any) => ({
      id: apt._id,
      name: formatPatientName(apt.patientId, apt.problemDescription),
      problem: apt.appointmentType || apt.type || 'General Checkup',
      time: formatAppointmentTime(apt.startTime),
      status: apt.status || 'Pending',
      avatar: `https://ui-avatars.com/api/?name=${apt.patientId?.userId?.firstName || 'U'}+${apt.patientId?.userId?.lastName || 'P'}&background=random`
    }));
  };

  const upcomingAppointments = getUpcomingAppointments();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="px-2 py-3">
          <div className="hidden lg:grid grid-cols-12 text-xs text-gray-500 px-4 pb-2">
            <div className="col-span-4">Patient Name</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Action</div>
          </div>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="grid grid-cols-12 items-center py-3 px-4 animate-pulse">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="col-span-3">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="col-span-3 text-right">
                  <div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
        </div>
        <div className="p-6">
          <div className="text-red-600 text-center">
            <p className="font-medium">Error loading appointments</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
      </div>
      <div className="px-2 py-3">
        <div className="hidden lg:grid grid-cols-12 text-xs text-gray-500 px-4 pb-2">
          <div className="col-span-4">Patient Name</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-3 text-right">Action</div>
        </div>
        <div className="space-y-2">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment: any) => (
              <Row
                key={appointment.id}
                avatar={appointment.avatar}
                name={appointment.name}
                problem={appointment.problem}
                time={appointment.time}
                status={appointment.status as "Pending" | "Confirmed" | "Completed" | "Cancelled"}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
