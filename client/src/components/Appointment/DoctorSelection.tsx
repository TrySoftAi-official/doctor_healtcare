import { Search, ChevronDown, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { doctorService } from "@/services/doctorService";
import { useAppointmentBooking } from "@/contexts/AppointmentBookingContext";

interface Doctor {
  _id: string;
  id: string; // Computed from _id
  specialty: string;
  rating: number;
  isAvailable: boolean;
  user?: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  // Computed properties
  name: string;
  avatar?: string;
}

const DoctorSelection = () => {
  const { state, dispatch } = useAppointmentBooking();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedGender, setSelectedGender] = useState("Any Gender");
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);

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
          
          const transformed = {
            ...doctor,
            id: doctor._id,
            name: doctorName,
            avatar: doctorAvatar,
          };
          
          return transformed;
        });
        setDoctors(transformedDoctors);
        setIsUsingFallbackData(false);
      } catch (error: any) {
        // Set empty array if API fails - no fallback data
        setIsUsingFallbackData(true);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    // Add safety checks for undefined properties
    if (!doctor || !doctor.name || !doctor.specialty) {
      return false;
    }
    
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All Specialties" || 
                           doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    
    return matchesSearch && matchesSpecialty;
  });

  const handleDoctorSelect = (doctor: Doctor) => {
    dispatch({ type: 'SELECT_DOCTOR', payload: doctor });
  };

  if (loading) {
    return (
      <section className="py-16" style={{ backgroundColor: '#F0F7FF' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Select Your Doctor
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our experienced healthcare professionals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center animate-pulse">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" style={{ backgroundColor: '#F0F7FF' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Select Your Doctor
          </h2>
          <p className="text-lg text-gray-600">
            Choose from our experienced healthcare professionals
          </p>
 
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Specialties Dropdown */}
            <div className="relative">
              <select 
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]"
              >
                <option>All Specialties</option>
                <option>Cardiology</option>
                <option>Dentistry</option>
                <option>Dermatology</option>
                <option>General Medicine</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Gender Dropdown */}
            <div className="relative">
              <select 
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
              >
                <option>Any Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Doctor Cards */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("All Specialties");
                setSelectedGender("Any Gender");
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div 
                key={doctor.id} 
                className={`bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-all cursor-pointer ${
                  state.formData.selectedDoctor?.id === doctor.id 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-100'
                }`}
                onClick={() => handleDoctorSelect(doctor)}
              >
              {/* Profile Picture */}
              <div className="mb-4">
                <img
                    src={doctor.avatar ? 
                      (doctor.avatar.startsWith('http') ? doctor.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${doctor.avatar}`) 
                      : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
                    }
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face";
                  }}
                />
              </div>

              {/* Doctor Info */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {doctor.name}
              </h3>
              <p className="text-blue-600 font-medium mb-3">
                  {doctor.specialty || 'General Medicine'}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                          i < Math.floor(doctor.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                    {doctor.rating || 0}
                </span>
              </div>

              {/* Select Button */}
                <button 
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    state.formData.selectedDoctor?.id === doctor.id
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoctorSelect(doctor);
                  }}
                >
                  {state.formData.selectedDoctor?.id === doctor.id ? 'Selected' : 'Select Doctor'}
              </button>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default DoctorSelection;
