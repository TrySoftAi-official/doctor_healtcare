import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminHeader from "@/components/Admin/AdminHeader";
import ProfileInformation from "@/components/Settings/ProfileInformation";
import NotificationPreferences from "@/components/Settings/NotificationPreferences";
import DoctorSettings from "@/components/Settings/DoctorSettings";
import AdministratorSettings from "@/components/Settings/AdministratorSettings";
import PatientSettings from "@/components/Settings/PatientSettings";
import PrivacySecurity from "@/components/Settings/PrivacySecurity";
import HelpSupport from "@/components/Settings/HelpSupport";
import { useState, useEffect } from "react";

export default function Settings() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="flex-shrink-0">
        <AdminSidebar 
          isOpen={isSidebarOpen}
          onToggle={handleMenuToggle}
          isMobile={isMobile}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Header */}
        <div className="flex-shrink-0">
          <AdminHeader 
            onMenuToggle={handleMenuToggle}
            isMobile={isMobile}
          />
        </div>
        
        {/* Scrollable Settings Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Settings</h1>
              <p className="text-gray-600">Customize your healthcare experience</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-4 lg:space-y-6">
              <ProfileInformation />
              <NotificationPreferences />
              <DoctorSettings />
              <AdministratorSettings />
              <PatientSettings />
              <PrivacySecurity />
              <HelpSupport />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
