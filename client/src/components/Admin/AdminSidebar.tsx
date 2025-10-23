import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Calendar, 
  Mail, 
  BarChart3, 
  Settings as Cog, 
  Heart,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect, useRef } from "react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

const AdminSidebar = ({ onToggle, isMobile = false, isOpen = false }: AdminSidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const role = user?.role || "Patient";

  // Role-based color schemes
  const roleColors = {
    Administrator: {
      primary: "blue",
      accent: "blue-600",
      light: "blue-50",
      dark: "blue-700"
    },
    Doctor: {
      primary: "green", 
      accent: "green-600",
      light: "green-50",
      dark: "green-700"
    },
    Patient: {
      primary: "purple",
      accent: "purple-600", 
      light: "purple-50",
      dark: "purple-700"
    }
  };

  const colors = roleColors[role as keyof typeof roleColors] || roleColors.Patient;

  // Role-based menu configuration
  const menuConfig = {
    Administrator: [
      { name: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/Administrator", description: "Overview & Analytics" },
      { name: "Patients", icon: <Users className="w-5 h-5" />, path: "/Administrator/patients", description: "Manage Patients" },
      { name: "Appointments", icon: <Calendar className="w-5 h-5" />, path: "/Administrator/appointment", description: "Schedule & Manage" },
      { name: "Messages", icon: <Mail className="w-5 h-5" />, path: "/Administrator/messages", description: "Communications" },
      { name: "Reports", icon: <BarChart3 className="w-5 h-5" />, path: "/Administrator/reports", description: "Analytics & Insights" },
      { name: "Settings", icon: <Cog className="w-5 h-5" />, path: "/Administrator/settings", description: "System Configuration" },
    ],
    Doctor: [
      { name: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/Doctor", description: "Practice Overview" },
      { name: "Appointments", icon: <Calendar className="w-5 h-5" />, path: "/Doctor/appointments", description: "My Schedule" },
      { name: "Messages", icon: <Mail className="w-5 h-5" />, path: "/Doctor/messages", description: "Patient Communications" },
      { name: "Reports", icon: <BarChart3 className="w-5 h-5" />, path: "/Doctor/reports", description: "Performance Analytics" },
      { name: "Settings", icon: <Cog className="w-5 h-5" />, path: "/Doctor/settings", description: "Profile & Preferences" },
    ],
    Patient: [
      { name: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/Patient", description: "Health Overview" },
      { name: "Appointments", icon: <Calendar className="w-5 h-5" />, path: "/appointment", description: "My Appointments" },
      { name: "Messages", icon: <Mail className="w-5 h-5" />, path: "/Patient/messages", description: "Doctor Communications" },
      { name: "Settings", icon: <Cog className="w-5 h-5" />, path: "/Patient/settings", description: "Account Settings" },
    ]
  };

  const menu = menuConfig[role as keyof typeof menuConfig] || menuConfig.Patient;

  // Handle window resize and touch detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        if (isOpen && onToggle) {
          onToggle();
        }
        setIsCollapsed(false);
      }
    };

    // Detect touch device
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouchDevice();
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onToggle]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile && isOpen && onToggle) {
      onToggle();
    }
  }, [location.pathname, isMobile, isOpen, onToggle]);

  // Touch handling for swipe gestures
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isMobile) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;
      
      // Swipe right to open sidebar (from left edge)
      if (touchStartX.current < 50 && deltaX > 100 && Math.abs(deltaY) < 100) {
        if (onToggle) onToggle();
      }
      // Swipe left to close sidebar
      else if (isOpen && deltaX < -100 && Math.abs(deltaY) < 100) {
        if (onToggle) onToggle();
      }
    };

    if (isTouchDevice) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobile, isOpen, isTouchDevice, onToggle]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Mobile overlay with improved touch handling
  const MobileOverlay = () => {
    console.log('MobileOverlay render:', { isOpen, isMobile, showOverlay: isOpen && isMobile });
    return isOpen && isMobile && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
        onClick={() => {
          console.log('Overlay clicked');
          if (onToggle) onToggle();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          console.log('Overlay touch end');
          if (onToggle) onToggle();
        }}
      />
    );
  };

  // Debug logging
  console.log('AdminSidebar Debug:', { isOpen, isMobile, isCollapsed });

  const sidebarClasses = `fixed lg:relative z-50 bg-white shadow-xl lg:shadow-lg h-screen transition-all duration-300 ease-in-out flex-shrink-0 ${
    isMobile ? 'w-72 sm:w-80' : isCollapsed ? 'w-16' : 'w-64'
  } ${
    isOpen ? 'translate-x-0' : isMobile ? '-translate-x-full' : 'translate-x-0'
  } ${
    isMobile ? 'top-0 left-0' : ''
  }`;

  return (
    <>
      {/* Mobile Overlay */}
      <MobileOverlay />
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={sidebarClasses}
        onTouchStart={(e) => {
          // Prevent touch events from bubbling to parent
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          // Prevent touch events from bubbling to parent
          e.stopPropagation();
        }}
      >
        {/* Header with Logo and Toggle */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className={`w-10 h-10 bg-gradient-to-br from-${colors.accent} to-${colors.dark} rounded-xl flex items-center justify-center mr-3 shadow-lg`}>
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">HealthCare</h2>
                  <p className={`text-sm text-${colors.accent} font-medium`}>{role} Portal</p>
                </div>
              </div>
            )}
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => {
                if (onToggle) onToggle();
              }}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Role Indicator */}
        {!isCollapsed && (
          <div className="px-4 lg:px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 bg-${colors.accent} rounded-full`}></div>
                <span className={`text-xs font-medium text-${colors.accent} uppercase tracking-wide`}>
                  {role} Portal
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {menu.length} items
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="mt-2 flex-1 overflow-y-auto overscroll-contain">
          {menu.map((item, index) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <div key={item.name} className="relative">
                {/* Menu Item */}
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 lg:px-6 py-4 lg:py-4 mx-2 lg:mx-0 rounded-lg lg:rounded-none
                    transition-all duration-200 ease-in-out group relative touch-manipulation
                    ${active 
                      ? `bg-gradient-to-r from-${colors.light} to-${colors.light} text-${colors.dark} font-semibold shadow-sm border-l-4 border-${colors.accent}` 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 active:bg-gray-100"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                    ${isMobile ? "min-h-[48px]" : ""}
                  `}
                  title={isCollapsed ? `${item.name} - ${item.description}` : ""}
                  onClick={() => {
                    if (isMobile && onToggle) {
                      onToggle();
                    }
                  }}
                >
                  <span className={`
                    ${active ? `text-${colors.accent}` : "text-gray-500 group-hover:text-gray-700"}
                    ${isCollapsed ? "mr-0" : "mr-4"}
                    transition-colors duration-200 relative
                  `}>
                    {item.icon}
                    {/* Active indicator dot */}
                    {active && (
                      <div className={`absolute -top-1 -right-1 w-2 h-2 bg-${colors.accent} rounded-full`}></div>
                    )}
                  </span>
                  
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{item.name}</span>
                        {/* Item number indicator */}
                        <span className="text-xs text-gray-400 ml-2">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                </Link>

                {/* Hover tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 lg:p-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2024 HealthCare Portal
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSidebar;
