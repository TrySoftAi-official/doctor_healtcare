import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export default function PublicHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="HealthCare" className="h-8" />
          <span className="font-bold text-xl text-blue-600">HealthCare</span>
        </div>

        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/appointment">Book Appointment</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName} {user.lastName}
              </span>
              <Button 
                onClick={signOut}
                variant="outline"
                className="text-gray-600 hover:text-gray-800"
              >
                Sign Out
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link to={`/${user.role}`}>Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="text-gray-600">
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
