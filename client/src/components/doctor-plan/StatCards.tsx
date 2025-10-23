import { CheckCircle2, Clock3, XCircle, CalendarDays } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointmentService";
import { useAuth } from "@/providers/AuthProvider";

const StatCard = ({ title, value, color, icon }: { title: string; value: string | number; color: string; icon: React.ReactNode }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4`}> 
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default function StatCards() {
  const { user } = useAuth();
  
  // Fetch appointments for the doctor
  const { data: appointmentsData, isLoading, error } = useQuery({
    queryKey: ['doctor-appointments', user?.id],
    queryFn: async () => {
      return await appointmentService.getAppointments();
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Calculate statistics from real data
  const calculateStats = () => {
    if (!appointmentsData) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        canceled: 0
      };
    }

    // Filter appointments for this doctor
    const doctorAppointments = appointmentsData.filter((apt: any) => 
      apt.doctorId?._id === user?.id || apt.doctorId === user?.id
    );

    const total = doctorAppointments.length;
    const completed = doctorAppointments.filter((apt: any) => 
      apt.status?.toLowerCase() === 'completed'
    ).length;
    const pending = doctorAppointments.filter((apt: any) => 
      apt.status?.toLowerCase() === 'pending'
    ).length;
    const canceled = doctorAppointments.filter((apt: any) => 
      apt.status?.toLowerCase() === 'cancelled' || apt.status?.toLowerCase() === 'canceled'
    ).length;

    return { total, completed, pending, canceled };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full bg-red-50 rounded-xl shadow-sm border border-red-200 p-4">
          <div className="text-red-600 text-center">
            <p className="font-medium">Error loading statistics</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Appointments" 
        value={stats.total} 
        color="bg-blue-100 text-blue-600" 
        icon={<CalendarDays className="w-5 h-5" />} 
      />
      <StatCard 
        title="Completed" 
        value={stats.completed} 
        color="bg-green-100 text-green-600" 
        icon={<CheckCircle2 className="w-5 h-5" />} 
      />
      <StatCard 
        title="Pending" 
        value={stats.pending} 
        color="bg-yellow-100 text-yellow-600" 
        icon={<Clock3 className="w-5 h-5" />} 
      />
      <StatCard 
        title="Canceled" 
        value={stats.canceled} 
        color="bg-red-100 text-red-600" 
        icon={<XCircle className="w-5 h-5" />} 
      />
    </div>
  );
}
