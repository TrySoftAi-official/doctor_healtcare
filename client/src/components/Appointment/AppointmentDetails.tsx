import { Calendar, ChevronDown } from "lucide-react";
import { useAppointmentBooking } from "@/contexts/AppointmentBookingContext";

const AppointmentDetails = () => {
  const { state, dispatch } = useAppointmentBooking();
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Appointment Details
          </h2>
          <p className="text-lg text-gray-600">
            Fill in your information to complete the booking
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-blue-600 rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-white font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={state.formData.patientName}
                  onChange={(e) => dispatch({ type: 'UPDATE_PATIENT_DETAILS', payload: { patientName: e.target.value } })}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-white text-gray-700"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-white font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={state.formData.patientPhone}
                  onChange={(e) => dispatch({ type: 'UPDATE_PATIENT_DETAILS', payload: { patientPhone: e.target.value } })}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-white text-gray-700"
                />
              </div>

              {/* Select Time */}
              <div>
                <label className="block text-white font-bold mb-2">
                  Select Time
                </label>
                <div className="relative">
                  <select 
                    value={state.formData.appointmentTime}
                    onChange={(e) => dispatch({ type: 'UPDATE_APPOINTMENT_DETAILS', payload: { appointmentTime: e.target.value } })}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none appearance-none bg-white text-gray-700"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Email Address */}
              <div>
                <label className="block text-white font-bold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={state.formData.patientEmail}
                  onChange={(e) => dispatch({ type: 'UPDATE_PATIENT_DETAILS', payload: { patientEmail: e.target.value } })}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-white text-gray-700"
                />
              </div>

              {/* Select Date */}
              <div>
                <label className="block text-white font-bold mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={state.formData.appointmentDate}
                    onChange={(e) => dispatch({ type: 'UPDATE_APPOINTMENT_DETAILS', payload: { appointmentDate: e.target.value } })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-white text-gray-700"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-white font-bold mb-2">
                  Appointment Type
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="appointmentType"
                      value="in-person"
                      checked={state.formData.appointmentType === 'in-person'}
                      onChange={(e) => dispatch({ type: 'UPDATE_APPOINTMENT_DETAILS', payload: { appointmentType: e.target.value as 'in-person' | 'online' } })}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-white font-medium">In-person</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="appointmentType"
                      value="online"
                      checked={state.formData.appointmentType === 'online'}
                      onChange={(e) => dispatch({ type: 'UPDATE_APPOINTMENT_DETAILS', payload: { appointmentType: e.target.value as 'in-person' | 'online' } })}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-white font-medium">Online Consultation</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentDetails;
