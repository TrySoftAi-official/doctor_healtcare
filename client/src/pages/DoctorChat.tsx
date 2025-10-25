import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AdminHeader from '@/components/Admin/AdminHeader';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { MessageCircle, Users, Stethoscope } from 'lucide-react';

export const DoctorChat: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
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
    <div className="h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex overflow-hidden relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 mobile-overlay"
          onClick={handleMenuToggle}
        />
      )}
      
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
        <div className="flex-shrink-0 z-40 bg-white/80 backdrop-blur-sm border-b border-green-100">
          <AdminHeader 
            onMenuToggle={handleMenuToggle}
            isMobile={isMobile}
          />
        </div>
        
        {/* Chat Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Messages
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Stethoscope className="w-4 h-4 mr-1" />
                    Chat with your patients
                  </p>
                </div>
              </div>
              
              {/* Mobile Stats */}
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Active Patients</span>
                </div>
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden bg-white">
              <ChatInterface />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
