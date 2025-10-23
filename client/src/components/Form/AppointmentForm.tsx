import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { doctorService } from "@/services/doctorService";
import { appointmentService } from "@/services/appointmentService";
import { useAuth } from "@/providers/AuthProvider";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar?: string;
  isAvailable: boolean;
}

export default function AppointmentForm() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    doctorId: "",
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    type: "in-person",
    problemDescription: "",
    notes: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getDoctors({ isAvailable: true });
        
        // Transform the API response to match our expected format
        const transformedDoctors = data.map((doctor: any) => {
          // Handle different possible data structures
          let doctorName = 'Unknown Doctor';
          let doctorAvatar = undefined;
          
          if (doctor.user) {
            // If user data is populated
            doctorName = `${doctor.user.firstName || ''} ${doctor.user.lastName || ''}`.trim();
            doctorAvatar = doctor.user.profileImage;
          } else if (doctor.firstName && doctor.lastName) {
            // If user data is not populated but doctor has name fields directly
            doctorName = `${doctor.firstName} ${doctor.lastName}`;
          } else if (doctor.name) {
            // If doctor already has a name field
            doctorName = doctor.name;
          }
          
          // Fallback to a more descriptive name if still unknown
          if (doctorName === 'Unknown Doctor' || !doctorName) {
            doctorName = `Dr. ${doctor.specialty || 'Medical Professional'}`;
          }
          
          return {
            ...doctor,
            id: doctor._id,
            name: doctorName,
            avatar: doctorAvatar,
          };
        });
        
        setDoctors(transformedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      alert('Please log in to book an appointment');
      return;
    }

    try {
      setSubmitting(true);
      await appointmentService.createAppointment({
        doctorId: form.doctorId,
        patientId: user.id,
        appointmentDate: form.date,
        appointmentTime: form.time,
        type: form.type as 'consultation' | 'follow-up' | 'emergency',
        reason: form.problemDescription,
        notes: form.notes,
      });
      
      alert('Appointment booked successfully!');
      // Reset form
      setForm({
        doctorId: "",
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        type: "in-person",
        problemDescription: "",
        notes: "",
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-8 w-full max-w-4xl mx-auto"
    >
      {/* Doctor Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Doctor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                form.doctorId === doctor.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleChange("doctorId", doctor.id)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={doctor.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={doctor.name}
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{doctor.name}</h4>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <Input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="pl-10"
              required
            />
          </div>

          {/* Email Address */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <Input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="pl-10"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </div>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Date */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            </div>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="pl-10"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Select Time */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
              </svg>
            </div>
            <Select onValueChange={(v) => handleChange("time", v)} required>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointment Type */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 15.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 8H12c.8 0 1.54.37 2.01.99L16 11l1.99-2.01A2.5 2.5 0 0 1 20 8h2.54c.8 0 1.54.37 2.01.99L27 15.5V22h-7z"/>
              </svg>
            </div>
            <Select onValueChange={(v) => handleChange("type", v)}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Appointment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In-person</SelectItem>
                <SelectItem value="online">Online Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Problem Description */}
      <div className="mt-8">
        <div className="flex items-center mb-3">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          <label className="text-gray-800 font-semibold">Problem Description</label>
        </div>
        <Textarea
          placeholder="Describe your symptoms and concerns..."
          value={form.problemDescription}
          onChange={(e) => handleChange("problemDescription", e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      {/* Additional Notes */}
      <div className="mt-6">
        <div className="flex items-center mb-3">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          <label className="text-gray-800 font-semibold">Additional Notes (Optional)</label>
        </div>
        <Textarea
          placeholder="Any additional information for the doctor..."
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      {/* Confirm Appointment Button */}
      <Button
        type="submit"
        disabled={submitting || !form.doctorId}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg disabled:opacity-50"
      >
        {submitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Booking Appointment...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            Confirm Appointment
          </>
        )}
      </Button>
    </form>
  );
}
