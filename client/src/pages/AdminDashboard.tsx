import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminHeader from "@/components/Admin/AdminHeader";
import MetricCards from "@/components/Admin/MetricCards";
import ChartsSection from "@/components/Admin/ChartsSection";
import RecentAppointments from "@/components/Admin/RecentAppointments";
import QuickActions from "@/components/Admin/QuickActions";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden relative">
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
          {/* Metric Cards */}
          <MetricCards />
          
          {/* Charts Section */}
          <div className="mt-6 lg:mt-8">
            <ChartsSection />
          </div>
          
          {/* Bottom Section */}
          <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <RecentAppointments />
            <QuickActions />
          </div>
        </main>
      </div>
    </div>
  );
}
