import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminHeader from "@/components/Admin/AdminHeader";
import NextAppointmentCard from "@/components/patient-panel/NextAppointmentCard";
import MyDoctorsGrid from "@/components/patient-panel/MyDoctorsGrid";
import RecentPrescriptions from "@/components/patient-panel/RecentPrescriptions";
import UpcomingReminders from "@/components/patient-panel/UpcomingReminders";
import AppointmentBooking from "@/pages/AppointmentBooking";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PatientPanel() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      // Use more responsive breakpoints
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Determine which content to show based on the current route
  const renderContent = () => {
    if (location.pathname === '/appointment') {
      return <AppointmentBooking />;
    }
    
    // Default patient dashboard content
    return (
      <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6">
        <NextAppointmentCard />
        <MyDoctorsGrid />
        <RecentPrescriptions />
        <UpcomingReminders />
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-b from-blue-50 to-white flex overflow-hidden relative">
      {/* Fixed Sidebar */}
      <div className={`flex-shrink-0 ${isMobile ? 'absolute inset-y-0 left-0 z-50' : ''}`}>
        <AdminSidebar 
          isOpen={isSidebarOpen}
          onToggle={handleMenuToggle}
          isMobile={isMobile}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Fixed Header */}
        <div className="flex-shrink-0 z-40">
          <AdminHeader 
            onMenuToggle={handleMenuToggle}
            isMobile={isMobile}
          />
        </div>
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
