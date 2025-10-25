const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/healthcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas (simplified)
const UserSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: String,
  isActive: Boolean
});

const DoctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  specialty: String,
  isAvailable: { type: Boolean, default: true }
});

const PatientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  appointmentDate: Date,
  startTime: String,
  endTime: String,
  type: String,
  status: { type: String, default: 'confirmed' },
  problemDescription: String
});

const User = mongoose.model('User', UserSchema);
const Doctor = mongoose.model('Doctor', DoctorSchema);
const Patient = mongoose.model('Patient', PatientSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);

async function createAppointment() {
  try {
    
    // Find the doctor and patient records
    const doctor = await Doctor.findOne({ userId: '68f7733f9a474b5afab3d185' });
    const patient = await Patient.findOne({ userId: '68f7733f9a474b5afab3d1c5' });
    
    if (!doctor) {
      const doctorUser = await User.findById('68f7733f9a474b5afab3d185');
      if (doctorUser) {
        const newDoctor = new Doctor({
          userId: doctorUser._id,
          specialty: 'General Medicine',
          isAvailable: true
        });
        await newDoctor.save();
      }
    }
    
    if (!patient) {
      const patientUser = await User.findById('68f7733f9a474b5afab3d1c5');
      if (patientUser) {
        const newPatient = new Patient({
          userId: patientUser._id
        });
        await newPatient.save();
      }
    }
    
    // Get the doctor and patient again
    const doctorRecord = await Doctor.findOne({ userId: '68f7733f9a474b5afab3d185' });
    const patientRecord = await Patient.findOne({ userId: '68f7733f9a474b5afab3d1c5' });
    
    if (!doctorRecord || !patientRecord) {
      return;
    }
    
    
    // Create an appointment
    const appointment = new Appointment({
      patientId: patientRecord._id,
      doctorId: doctorRecord._id,
      appointmentDate: new Date('2025-10-25'),
      startTime: '10:00',
      endTime: '11:00',
      type: 'consultation',
      status: 'confirmed',
      problemDescription: 'Regular checkup and consultation'
    });
    
    await appointment.save();
    
    await mongoose.disconnect();
  } catch (error) {
    await mongoose.disconnect();
  }
}

createAppointment();
