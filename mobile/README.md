# Healthcare Mobile App

React Native Expo mobile application for the Healthcare Management System.

## Features

- **Authentication**: Login, Signup, Forgot Password, Reset Password
- **Role-Based Access**: Administrator, Doctor, Patient dashboards
- **Appointments**: Book, view, manage appointments
- **Prescriptions**: Create, view, refill prescriptions
- **Real-time Chat**: Messaging between doctors and patients
- **Notifications**: Push notifications and in-app notifications
- **Dashboard**: Role-specific dashboards with analytics
- **Settings**: User preferences and profile management
- **File Upload**: Profile images and document uploads
- **Reports**: View reports and analytics

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API URL in `config/env.ts`:
```typescript
export const API_BASE_URL = 'http://your-backend-url:3000';
```

3. Start the development server:
```bash
npm start
```

## Running on Device

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Environment Setup

Create a `.env` file (optional, can use config file):
```
API_URL=http://localhost:3000
SOCKET_URL=http://localhost:3000
```

## Project Structure

```
mobile/
├── app/                 # Expo Router pages
├── components/          # Reusable components
├── services/           # API services
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── types/              # TypeScript types
├── utils/              # Utility functions
└── assets/             # Images and static files
```

