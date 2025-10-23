# Comprehensive Database Seeding

This script populates all database tables with realistic healthcare data covering various scenarios and use cases.

## What Gets Created

### Users (All with password: `123456`)
- **1 Administrator**: admin@healthcare.com
- **8 Doctors**: Various specialties (Cardiology, Dentistry, Dermatology, Orthopedics, General Medicine, Neurology, Pediatrics, Psychiatry)
- **8 Patients**: Diverse medical histories, allergies, and insurance information

### Data Relationships
- **30 Appointments**: Mix of in-person and online appointments with various statuses
- **20 Prescriptions**: Linked to appointments with realistic medications
- **50 Messages**: Conversations between doctors and patients
- **40 Notifications**: Various types (appointments, prescriptions, messages, system announcements)

## Realistic Scenarios Covered

### Medical Specialties
- **Cardiology**: Heart disease, hypertension management
- **Dentistry**: Routine cleanings, cosmetic procedures
- **Dermatology**: Skin conditions, cosmetic treatments
- **Orthopedics**: Joint pain, sports medicine
- **General Medicine**: Family practice, preventive care
- **Neurology**: Epilepsy, stroke, movement disorders
- **Pediatrics**: Child development, vaccinations
- **Psychiatry**: Mental health, anxiety, depression

### Patient Profiles
- **Chronic Conditions**: Diabetes, hypertension, heart disease
- **Allergies**: Medications, food, environmental
- **Insurance Coverage**: Various providers (Blue Cross, Aetna, Cigna, etc.)
- **Emergency Contacts**: Family members and relationships
- **Languages**: English, Spanish, Arabic, Chinese

### Appointment Types
- **In-Person**: Traditional office visits
- **Online**: Telemedicine consultations
- **Statuses**: Pending, Confirmed, Completed, Cancelled, No Show

### Prescription Management
- **Common Medications**: Metformin, Lisinopril, Albuterol, etc.
- **Dosage Instructions**: Frequency, duration, special instructions
- **Refill Management**: Refillable prescriptions with tracking
- **Dispensing**: Pharmacy integration and tracking

## How to Run

### Option 1: Using npm scripts
```bash
# Run comprehensive seed
npm run seed:comprehensive

# Or use the alias
npm run seed:all
```

### Option 2: Using run scripts
```bash
# Windows
scripts/run-seed.bat

# Linux/Mac
scripts/run-seed.sh
```

### Option 3: Direct execution
```bash
npx ts-node scripts/seed-comprehensive.ts
```

## Login Credentials

All users have the password: `123456`

### Admin Access
- **Email**: admin@healthcare.com
- **Password**: 123456
- **Role**: Administrator

### Doctor Access
- **Emails**: dr.*@healthcare.com (e.g., dr.sarah.ahmed@healthcare.com)
- **Password**: 123456
- **Role**: Doctor

### Patient Access
- **Emails**: *@email.com (e.g., john.smith@email.com)
- **Password**: 123456
- **Role**: Patient

## Data Features

### Realistic Medical Data
- **Medical Histories**: Chronic conditions, past surgeries
- **Allergies**: Drug allergies, food allergies, environmental
- **Current Medications**: Active prescriptions with dosages
- **Insurance Information**: Provider details, policy numbers
- **Emergency Contacts**: Family members with contact information

### Appointment Scenarios
- **Routine Checkups**: Annual physicals, wellness visits
- **Specialist Consultations**: Referrals to specialists
- **Follow-up Visits**: Post-treatment monitoring
- **Emergency Consultations**: Urgent care scenarios
- **Telemedicine**: Online consultations with meeting links

### Communication
- **Patient-Doctor Messages**: Questions about treatment, scheduling
- **Appointment Reminders**: Automated notifications
- **Prescription Alerts**: Medication ready notifications
- **System Announcements**: Platform updates and features

## Database Tables Populated

1. **users** - User accounts for all roles
2. **doctors** - Doctor profiles with specialties and availability
3. **patients** - Patient profiles with medical information
4. **appointments** - Scheduled appointments with status tracking
5. **prescriptions** - Medication prescriptions and refills
6. **messages** - Communication between users
7. **notifications** - System and appointment notifications

## Notes

- The script clears existing data before seeding
- All timestamps are realistic (past, present, future dates)
- Data relationships are properly maintained
- Medical information follows realistic patterns
- Insurance and contact information is fictional but realistic
- All passwords are set to `123456` for easy testing

## Troubleshooting

If you encounter issues:
1. Ensure MongoDB is running
2. Check database connection in your environment
3. Verify all dependencies are installed (`npm install`)
4. Check that the backend can connect to the database
5. Review console output for specific error messages
