import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { doctorService } from "@/services/doctorService";
import { appointmentService } from "@/services/appointmentService";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar?: string;
  isAvailable: boolean;
}

const DoctorCard = ({ doctor, onBookAppointment }: { doctor: Doctor; onBookAppointment: (doctorId: string) => void }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
    <img 
      src={doctor.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"} 
      className="w-16 h-16 rounded-full object-cover mx-auto mb-2" 
      alt={doctor.name}
    />
    <h4 className="text-sm font-semibold text-gray-800">{doctor.name}</h4>
    <p className="text-xs text-gray-500 mb-2">{doctor.specialty}</p>
    <div className="flex items-center justify-center text-yellow-400 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < Math.round(doctor.rating) ? 'fill-yellow-400' : ''}`} />
      ))}
      <span className="ml-2 text-xs text-gray-600">{doctor.rating}</span>
    </div>
    <button 
      onClick={() => onBookAppointment(doctor.id)}
      className="text-white bg-blue-600 hover:bg-blue-700 text-xs px-3 py-2 rounded-md"
    >
      Book Appointment
    </button>
  </div>
);

export default function MyDoctorsGrid() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyDoctors = async () => {
      try {
        setLoading(true);
        // Get doctors that the patient has appointments with
        const appointments = await appointmentService.getAppointments();
        const doctorIds = [...new Set(appointments.map((apt: any) => {
          // Handle both string IDs and populated objects
          if (typeof apt.doctorId === 'string') {
            return apt.doctorId;
          } else if (apt.doctorId && apt.doctorId._id) {
            return apt.doctorId._id;
          } else if (apt.doctorId && apt.doctorId.id) {
            return apt.doctorId.id;
          }
          return null;
        }).filter(Boolean))];
        
        // Fetch doctor details for each unique doctor
        const doctorPromises = doctorIds.map((doctorId: string) => doctorService.getDoctor(doctorId));
        const doctorData = await Promise.all(doctorPromises);
        
        // Transform the doctor data to ensure proper name display
        const transformedDoctors = doctorData.map((doctor: any) => {
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
        console.error('Error fetching my doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyDoctors();
  }, []);

  const handleBookAppointment = (doctorId: string) => {
    // Navigate to appointment booking with selected doctor
    window.location.href = `/appointment?doctorId=${doctorId}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <div className="w-24 text-blue-700 font-semibold text-sm transform -rotate-90 origin-left hidden sm:block">My Doctors</div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <div className="w-24 text-blue-700 font-semibold text-sm transform -rotate-90 origin-left hidden sm:block">My Doctors</div>
          <div className="flex-1 text-center py-8">
            <p className="text-gray-500 text-sm">No doctors found</p>
            <p className="text-gray-400 text-xs mt-1">Book an appointment to see your doctors here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center mb-3">
        <div className="w-24 text-blue-700 font-semibold text-sm transform -rotate-90 origin-left hidden sm:block">My Doctors</div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <DoctorCard 
              key={doctor.id} 
              doctor={doctor} 
              onBookAppointment={handleBookAppointment}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
