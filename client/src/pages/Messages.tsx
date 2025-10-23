import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminHeader from "@/components/Admin/AdminHeader";
import MessagesContent from "@/components/Messages/MessagesContent";
import { useState, useEffect } from "react";

export default function Messages() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Use more responsive breakpoints
      const isMobileView = window.innerWidth < 1024;
      const isTabletView = window.innerWidth < 1280;
      console.log('Mobile detection:', { width: window.innerWidth, isMobileView, isTabletView });
      setIsMobile(isMobileView);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuToggle = () => {
    console.log('Menu toggle clicked:', { isMobile, isSidebarOpen });
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
        
        {/* Scrollable Messages Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <MessagesContent />
        </main>
      </div>
    </div>
  );
}
