import { useState, useEffect } from "react";

interface AdminSidebarTestProps {
  isOpen?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

const AdminSidebarTest = ({ onToggle, isMobile = false, isOpen = false }: AdminSidebarTestProps) => {
  console.log('AdminSidebarTest Debug:', { isOpen, isMobile });

  const sidebarClasses = `fixed z-50 bg-white shadow-xl h-screen transition-all duration-300 ease-in-out ${
    isMobile ? 'w-72 top-0 left-0' : 'w-64'
  } ${
    isOpen ? 'translate-x-0' : isMobile ? '-translate-x-full' : 'translate-x-0'
  }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            console.log('Overlay clicked');
            if (onToggle) onToggle();
          }}
        />
      )}
      
      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Test Sidebar</h2>
            {isMobile && (
              <button
                onClick={() => {
                  console.log('Close button clicked');
                  if (onToggle) onToggle();
                }}
                className="w-8 h-8 bg-gray-200 rounded"
              >
                ✕
              </button>
            )}
          </div>
          <div className="mt-4">
            <p>Mobile: {isMobile ? 'Yes' : 'No'}</p>
            <p>Open: {isOpen ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebarTest;
