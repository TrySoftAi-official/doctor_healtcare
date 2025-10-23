import { Bell, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { useState } from "react";

// Type definitions for dashboard data
interface AdminDashboardMetrics {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  upcomingAppointments: number;
  newMessages: number;
}

interface DoctorDashboardMetrics {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  unreadMessages: number;
}

interface PatientDashboardMetrics {
  totalAppointments: number;
  unreadMessages: number;
  unreadNotifications: number;
}

interface DashboardData {
  metrics: AdminDashboardMetrics | DoctorDashboardMetrics | PatientDashboardMetrics;
  appointmentStats?: Array<{ _id: string; count: number }>;
  monthlyTrends?: Array<{ _id: { year: number; month: number }; count: number }>;
  recentAppointments?: Array<any>;
  upcomingAppointments?: Array<any>;
  recentPrescriptions?: Array<any>;
  myDoctors?: Array<any>;
}

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

const AdminHeader = ({ onMenuToggle, isMobile = false }: AdminHeaderProps) => {
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch dashboard data
  const { data: dashboardData, error } = useQuery<DashboardData>({
    queryKey: ['dashboard-data'],
    queryFn: dashboardService.getDashboardData,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1,
  });

  // Log errors for debugging
  if (error) {
    console.error('Dashboard data fetch error:', error);
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get role-specific greeting and title
  const getRoleInfo = () => {
    switch (user?.role) {
      case 'Administrator':
        return {
          greeting: 'Welcome, Admin 👋',
          subtitle: 'Here\'s what\'s happening with your clinic today',
          roleTitle: 'Administrator'
        };
      case 'Doctor':
        return {
          greeting: `Welcome, Dr. ${user?.lastName} 👋`,
          subtitle: 'Your practice overview for today',
          roleTitle: 'Doctor'
        };
      case 'Patient':
        return {
          greeting: `Welcome, ${user?.firstName} 👋`,
          subtitle: 'Your health dashboard for today',
          roleTitle: 'Patient'
        };
      default:
        return {
          greeting: 'Welcome 👋',
          subtitle: 'Your dashboard for today',
          roleTitle: 'User'
        };
    }
  };

  const roleInfo = getRoleInfo();

  // Debug logging
  console.log('Dashboard data:', dashboardData);
  console.log('User:', user);
  console.log('Error:', error);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors mr-4"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        )}

        {/* Welcome Message with Daily Data */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
                {roleInfo.greeting}
              </h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">
                {today} - {roleInfo.subtitle}
              </p>
            </div>
          </div>
        </div>
        
        {/* User Profile and Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4 ml-2 lg:ml-6">
          {/* Notification Bell */}
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
            {(() => {
              let messageCount = 0;
              if (user?.role === 'Administrator') {
                messageCount = (dashboardData?.metrics as AdminDashboardMetrics)?.newMessages || 0;
              } else if (user?.role === 'Doctor') {
                messageCount = (dashboardData?.metrics as DoctorDashboardMetrics)?.unreadMessages || 0;
              } else if (user?.role === 'Patient') {
                messageCount = (dashboardData?.metrics as PatientDashboardMetrics)?.unreadMessages || 0;
              }
              
              return messageCount > 0 ? (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {messageCount}
                  </span>
                </div>
              ) : null;
            })()}
          </div>
          
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={user?.profileImage || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"}
              alt={user?.firstName || 'Admin'}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          
          {/* User Info - Hidden on mobile */}
          <div className="hidden lg:block">
            <p className="font-semibold text-gray-800">
              {user?.role === 'Doctor' ? `Dr. ${user?.lastName}` : `${user?.firstName} ${user?.lastName}`}
            </p>
            <p className="text-sm text-gray-500">{roleInfo.roleTitle}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium hidden lg:inline">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
