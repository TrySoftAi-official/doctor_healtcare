# Healthcare Management System - Backend API

A comprehensive NestJS backend API for a healthcare management system with MongoDB database.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Administrator, Doctor, Patient)
- Password reset functionality
- Email verification

### Core Modules
- **Users Management**: User profiles, roles, and permissions
- **Doctors**: Doctor profiles, specialties, availability, ratings
- **Patients**: Patient profiles, medical history, insurance info
- **Appointments**: Booking, scheduling, status management
- **Prescriptions**: Digital prescriptions, refill management
- **Messages**: Real-time messaging between users
- **Notifications**: System notifications and alerts
- **Dashboard**: Role-specific dashboards with analytics
- **Settings**: User preferences and system configuration
- **File Upload**: Profile images and document management

### API Features
- RESTful API design
- Swagger/OpenAPI documentation
- Input validation with class-validator
- Error handling and logging
- Rate limiting and security headers
- CORS configuration
- File upload support

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/healthcare_db
   JWT_SECRET=xaki1253ya
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=development
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:3000/api/docs`

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/profile` - Get user profile
- `PATCH /auth/change-password` - Change password

### Users
- `GET /users` - Get all users (Admin only)
- `GET /users/profile` - Get current user profile
- `PATCH /users/profile` - Update current user profile
- `GET /users/:id` - Get user by ID

### Doctors
- `GET /doctors` - Get all doctors
- `GET /doctors/specialties` - Get all specialties
- `GET /doctors/available` - Get available doctors
- `GET /doctors/my-profile` - Get current doctor profile (Doctor only)
- `PATCH /doctors/my-profile` - Update doctor profile (Doctor only)
- `GET /doctors/:id` - Get doctor by ID

### Patients
- `GET /patients` - Get all patients (Admin/Doctor only)
- `GET /patients/my-profile` - Get current patient profile (Patient only)
- `PATCH /patients/my-profile` - Update patient profile (Patient only)
- `GET /patients/:id` - Get patient by ID (Admin/Doctor only)

### Appointments
- `POST /appointments` - Create appointment
- `GET /appointments` - Get all appointments
- `GET /appointments/upcoming` - Get upcoming appointments
- `GET /appointments/:id` - Get appointment by ID
- `PATCH /appointments/:id` - Update appointment
- `PATCH /appointments/:id/cancel` - Cancel appointment
- `DELETE /appointments/:id` - Delete appointment (Admin only)

### Prescriptions
- `POST /prescriptions` - Create prescription (Doctor only)
- `GET /prescriptions` - Get all prescriptions
- `GET /prescriptions/my-prescriptions` - Get patient prescriptions (Patient only)
- `GET /prescriptions/:id` - Get prescription by ID
- `PATCH /prescriptions/:id` - Update prescription (Doctor only)
- `PATCH /prescriptions/:id/dispense` - Dispense prescription (Admin only)
- `PATCH /prescriptions/:id/refill` - Refill prescription (Patient only)

### Messages
- `POST /messages` - Send message
- `GET /messages` - Get all messages
- `GET /messages/my-messages` - Get current user messages
- `GET /messages/unread` - Get unread messages
- `GET /messages/conversation/:userId` - Get conversation with user
- `PATCH /messages/:id/read` - Mark message as read
- `DELETE /messages/:id` - Delete message

### Notifications
- `GET /notifications` - Get all notifications
- `GET /notifications/my-notifications` - Get current user notifications
- `GET /notifications/unread` - Get unread notifications
- `PATCH /notifications/:id/read` - Mark notification as read
- `DELETE /notifications/:id` - Delete notification

### Dashboard
- `GET /dashboard` - Get dashboard data based on user role
- `GET /dashboard/stats` - Get quick statistics

### Settings
- `GET /settings/profile` - Get profile settings
- `PATCH /settings/profile` - Update profile settings
- `PATCH /settings/notifications` - Update notification preferences
- `PATCH /settings/privacy` - Update privacy settings

### File Upload
- `POST /upload/single` - Upload single file
- `POST /upload/multiple` - Upload multiple files
- `POST /upload/profile-image` - Upload profile image
- `DELETE /upload/:filename` - Delete file

## Database Schema

### User
- Basic user information (email, password, name, phone, etc.)
- Role-based access (Administrator, Doctor, Patient)
- Profile settings and preferences

### Doctor
- Professional information (specialty, license, experience)
- Availability schedule
- Rating and reviews
- Consultation fees

### Patient
- Medical history and allergies
- Current medications
- Insurance information
- Emergency contacts

### Appointment
- Patient and doctor references
- Date, time, and duration
- Status tracking (Pending, Confirmed, Completed, Cancelled)
- Notes and diagnosis

### Prescription
- Medication details (name, dosage, frequency)
- Doctor and patient references
- Dispensing status
- Refill management

### Message
- Sender and recipient
- Content and attachments
- Read status and timestamps

### Notification
- User-specific notifications
- Type and priority
- Read status and delivery

## Security Features

- JWT token authentication
- Role-based authorization
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Security headers with Helmet
- Input validation and sanitization

## Development

### Running the application

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

### Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

### Linting

```bash
# lint
npm run lint

# format
npm run format
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/healthcare_db` |
| `JWT_SECRET` | JWT secret key | `your-super-secret-jwt-key-here` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `MAX_FILE_SIZE` | Maximum file upload size | `10485760` (10MB) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
