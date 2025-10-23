import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

const RecentAppointments = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: dashboardService.getDashboardData,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1,
  });

  // Debug logging
  console.log('Dashboard data in RecentAppointments:', dashboardData);
  console.log('Recent appointments:', dashboardData?.recentAppointments);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'text-green-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'COMPLETED':
        return 'text-blue-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTime = (date: string | Date) => {
    const appointmentDate = new Date(date);
    return appointmentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const appointments = dashboardData?.recentAppointments?.map((appointment: any) => {
    // Get patient name with proper fallback logic
    const firstName = appointment.patientId?.userId?.firstName;
    const lastName = appointment.patientId?.userId?.lastName;
    
    let patientName = 'Unknown Patient';
    if (firstName && lastName) {
      patientName = `${firstName} ${lastName}`;
    } else if (firstName) {
      patientName = firstName;
    } else if (lastName) {
      patientName = lastName;
    }
    
    return {
      id: appointment._id,
      name: patientName,
      type: appointment.appointmentType || 'General Checkup',
      time: formatTime(appointment.appointmentDate),
      status: appointment.status,
      statusColor: getStatusColor(appointment.status),
      avatar: `https://ui-avatars.com/api/?name=${firstName || 'U'}+${lastName || 'P'}&background=random`
    };
  }) || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h3>
        <div className="text-red-600 text-center py-8">
          <p className="font-medium">Error loading appointments</p>
          <p className="text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h3>
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <img
                src={appointment.avatar}
                alt={appointment.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{appointment.name}</h4>
                <p className="text-sm text-gray-600">{appointment.type}</p>
                <p className="text-sm text-gray-500">{appointment.time}</p>
              </div>
              <span className={`text-sm font-medium ${appointment.statusColor}`}>
                {appointment.status}
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">
            <p>No recent appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentAppointments;
