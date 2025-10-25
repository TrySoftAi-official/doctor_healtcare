import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AdminHeader from '@/components/Admin/AdminHeader';
import { ChatInterface } from '../components/Chat/ChatInterface';

export const PatientChat: React.FC = () => {
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
        
        {/* Chat Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Messages</h1>
                <p className="text-sm text-muted-foreground">
                  Chat with your doctor
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ChatInterface />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
