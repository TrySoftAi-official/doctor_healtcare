import AppointmentForm from "@/components/Form/AppointmentForm";

export default function BookAppointment() {
  return (
    <section className="py-12 bg-blue-50 min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Schedule Your Appointment</h2>
        <p className="text-gray-600 mt-2">
          Easy and convenient booking for quality healthcare
        </p>
      </div>
      <AppointmentForm />
    </section>
  );
}
