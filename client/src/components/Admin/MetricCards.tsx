import { Users, Calendar, X, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

const MetricCards = () => {
  
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: dashboardService.getDashboardData,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1,
  });

  // Debug logging
  console.log('Dashboard data in MetricCards:', dashboardData);
  console.log('Metrics:', dashboardData?.metrics);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-red-50 rounded-lg shadow-sm p-6 border border-red-200">
          <div className="text-red-600 text-center">
            <p className="font-medium">Error loading dashboard data</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.metrics ? [
    {
      title: "Total Patients",
      value: dashboardData.metrics.totalPatients?.toString() || "0",
      change: "+12%", // This would need to be calculated from historical data
      trend: "up",
      icon: (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
      ),
    },
    {
      title: "Upcoming Appointments",
      value: dashboardData.metrics.upcomingAppointments?.toString() || "0",
      change: "+8%", // This would need to be calculated from historical data
      trend: "up",
      icon: (
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Calendar className="w-6 h-6 text-green-600" />
        </div>
      ),
    },
    {
      title: "Total Appointments",
      value: dashboardData.metrics.totalAppointments?.toString() || "0",
      change: "-3%", // This would need to be calculated from historical data
      trend: "down",
      icon: (
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <X className="w-6 h-6 text-red-600" />
        </div>
      ),
    },
    {
      title: "New Messages",
      value: dashboardData.metrics.newMessages?.toString() || "0",
      change: "+5%", // This would need to be calculated from historical data
      trend: "up",
      icon: (
        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Mail className="w-6 h-6 text-yellow-600" />
        </div>
      ),
    },
  ] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {metric.trend === "up" ? "↗" : "↘"} {metric.change}
                </span>
              </div>
            </div>
            {metric.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
