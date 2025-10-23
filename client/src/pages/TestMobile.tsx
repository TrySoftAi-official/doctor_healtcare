import AdminSidebarTest from "@/components/Admin/AdminSidebarTest";
import { useState, useEffect } from "react";

export default function TestMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      console.log('Mobile detection:', { width: window.innerWidth, isMobileView });
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
      {/* Test Sidebar */}
      <div className={`flex-shrink-0 ${isMobile ? 'absolute inset-y-0 left-0 z-50' : ''}`}>
        <AdminSidebarTest 
          isOpen={isSidebarOpen}
          onToggle={handleMenuToggle}
          isMobile={isMobile}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Test Header */}
        <div className="flex-shrink-0 z-40 bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={handleMenuToggle}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors mr-4"
                aria-label="Toggle menu"
              >
                ☰
              </button>
            )}
            
            <h1 className="text-xl font-semibold">Test Mobile Sidebar</h1>
            
            <div className="text-sm text-gray-600">
              Mobile: {isMobile ? 'Yes' : 'No'} | Open: {isSidebarOpen ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
        
        {/* Test Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Mobile Sidebar Test</h2>
            <p className="mb-4">This is a test page to verify mobile sidebar functionality.</p>
            <p className="mb-4">Current screen width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px</p>
            <p className="mb-4">Is mobile: {isMobile ? 'Yes' : 'No'}</p>
            <p className="mb-4">Sidebar open: {isSidebarOpen ? 'Yes' : 'No'}</p>
            
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Resize your browser window to less than 1024px width</li>
                <li>Click the hamburger menu (☰) button in the header</li>
                <li>The sidebar should slide in from the left</li>
                <li>Click the overlay or the X button to close</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
