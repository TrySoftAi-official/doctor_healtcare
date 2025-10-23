import { AppointmentBookingProvider } from "@/contexts/AppointmentBookingContext";
import AppointmentHero from "@/components/Appointment/AppointmentHero";
import DoctorSelection from "@/components/Appointment/DoctorSelection";
import AppointmentDetails from "@/components/Appointment/AppointmentDetails";
import ProblemDescription from "@/components/Appointment/ProblemDescription";
import ReviewConfirm from "@/components/Appointment/ReviewConfirm";

export default function AppointmentBooking() {
  return (
    <AppointmentBookingProvider>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <AppointmentHero />
        
        {/* Doctor Selection */}
        <DoctorSelection />
        
        {/* Appointment Details */}
        <AppointmentDetails />
        
        {/* Problem Description */}
        <ProblemDescription />
        
        {/* Review & Confirm */}
        <ReviewConfirm />
      </div>
    </AppointmentBookingProvider>
  );
}
