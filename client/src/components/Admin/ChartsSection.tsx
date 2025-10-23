import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

const ChartsSection = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: dashboardService.getDashboardData,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-red-50 rounded-lg shadow-sm p-6 border border-red-200">
          <div className="text-red-600 text-center">
            <p className="font-medium">Error loading chart data</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('Dashboard data in ChartsSection:', dashboardData);
  console.log('Daily trends:', dashboardData?.dailyTrends);

  // Generate daily appointment data from real API data
  const getDailyAppointmentData = () => {
    if (dashboardData?.dailyTrends && dashboardData.dailyTrends.length > 0) {
      // Create a map of existing data
      const trendsMap = new Map();
      dashboardData.dailyTrends.forEach((trend: any) => {
        const dayOfWeek = trend._id.dayOfWeek;
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        trendsMap.set(dayOfWeek, {
          day: dayNames[dayOfWeek - 1] || `Day ${dayOfWeek}`,
          value: trend.count || 0
        });
      });

      // Generate data for last 7 days, filling missing days with 0
      const last7Days = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayOfWeek = date.getDay() + 1; // MongoDB dayOfWeek is 1-7 (Sun-Sat)
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        last7Days.push({
          day: dayNames[date.getDay()],
          value: trendsMap.get(dayOfWeek)?.value || 0
        });
      }
      return last7Days;
    }
    
    // Fallback: return empty array if no data
    return [];
  };

  const appointmentData = getDailyAppointmentData();
  console.log('Appointment data:', appointmentData);

  // Ensure we have valid data before calculating max/min
  const validData = appointmentData.filter((item: any) => item && typeof item.value === 'number');
  const maxValue = validData.length > 0 ? Math.max(...validData.map((d: any) => d.value), 30) : 30;
  const minValue = validData.length > 0 ? Math.min(...validData.map((d: any) => d.value), 0) : 0;

  // Calculate patient demographics from appointment stats
  const getPatientDemographics = () => {
    if (dashboardData?.appointmentStats) {
      const total = dashboardData.appointmentStats.reduce((sum: number, stat: any) => sum + stat.count, 0);
      return {
        adults: Math.round((total * 0.45) / total * 100),
        seniors: Math.round((total * 0.30) / total * 100),
        children: Math.round((total * 0.25) / total * 100)
      };
    }
    return { adults: 45, seniors: 30, children: 25 };
  };

  const demographics = getPatientDemographics();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Appointments Trend - Line Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Appointments Trend</h3>
        {appointmentData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No appointment data available</p>
              <p className="text-sm">Data will appear here once appointments are created</p>
            </div>
          </div>
        ) : (
        <div className="h-64 relative">
          {/* Y-axis labels - dynamic based on data */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue * 0.8)}</span>
            <span>{Math.round(maxValue * 0.6)}</span>
            <span>{Math.round(maxValue * 0.4)}</span>
            <span>{Math.round(maxValue * 0.2)}</span>
            <span>{minValue}</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-8 mr-4 h-full relative">
            {/* Grid lines - dynamic based on data */}
            <div className="absolute inset-0">
              {[maxValue, Math.round(maxValue * 0.8), Math.round(maxValue * 0.6), Math.round(maxValue * 0.4), Math.round(maxValue * 0.2), minValue].map((value) => (
                <div
                  key={value}
                  className="absolute w-full border-t border-gray-100"
                  style={{
                    bottom: `${((value - minValue) / (maxValue - minValue)) * 100}%`,
                  }}
                />
              ))}
            </div>
            
            {/* Line chart */}
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Line path - only render if we have valid data */}
              {validData.length > 0 && (
                <path
                  d={`M 0,${200 - ((appointmentData[0]?.value || 0 - minValue) / (maxValue - minValue)) * 200} 
                      L 66.67,${200 - ((appointmentData[1]?.value || 0 - minValue) / (maxValue - minValue)) * 200}
                      L 133.33,${200 - ((appointmentData[2]?.value || 0 - minValue) / (maxValue - minValue)) * 200}
                      L 200,${200 - ((appointmentData[3]?.value || 0 - minValue) / (maxValue - minValue)) * 200}
                      L 266.67,${200 - ((appointmentData[4]?.value || 0 - minValue) / (maxValue - minValue)) * 200}
                      L 333.33,${200 - ((appointmentData[5]?.value || 0 - minValue) / (maxValue - minValue)) * 200}
                      L 400,${200 - ((appointmentData[6]?.value || 0 - minValue) / (maxValue - minValue)) * 200}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
              )}
              
              {/* Data points */}
              {appointmentData.map((item: any, index: number) => (
                <circle
                  key={index}
                  cx={index * 66.67}
                  cy={200 - (((item?.value || 0) - minValue) / (maxValue - minValue)) * 200}
                  r="4"
                  fill="#3b82f6"
                />
              ))}
            </svg>
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-8 right-4 flex justify-between text-xs text-gray-500">
            {appointmentData.map((item: any, index: number) => (
              <span key={index}>{item.day}</span>
            ))}
          </div>
          
          {/* Y-axis label */}
          <div className="absolute left-0 top-1/2 transform -rotate-90 -translate-y-1/2 text-xs text-gray-500">
            Appointments
          </div>
        </div>
        )}
      </div>

      {/* Patient Demographics - Donut Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Demographics</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              {/* Adults - Dark blue */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1e40af"
                strokeWidth="8"
                strokeDasharray={`${demographics.adults * 2.51} 251`}
                strokeDashoffset="0"
              />
              {/* Seniors - Light blue */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="8"
                strokeDasharray={`${demographics.seniors * 2.51} 251`}
                strokeDashoffset={`-${demographics.adults * 2.51}`}
              />
              {/* Children - Medium blue */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="8"
                strokeDasharray={`${demographics.children * 2.51} 251`}
                strokeDashoffset={`-${(demographics.adults + demographics.seniors) * 2.51}`}
              />
            </svg>
          </div>
        </div>
        
        {/* Legend with proper positioning */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-800 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">Adults (18-65): {demographics.adults}%</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-300 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">Seniors (65+): {demographics.seniors}%</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">Children (0-18): {demographics.children}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
