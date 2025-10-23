# Administrator User Setup

## Default Administrator User

The system automatically creates a default administrator user on startup with the following credentials:

- **Email**: `bainfo14@gmail.com`
- **Password**: `123456`
- **Role**: `Administrator`

## Features

- **Single Administrator**: The system ensures only one administrator user exists
- **Automatic Creation**: The administrator user is created automatically when the application starts
- **Security**: Password is properly hashed using bcrypt
- **Verification**: Email is marked as verified by default

## Manual Seeding

If you need to manually run the seeding process, you can use:

### Using npm script:
```bash
npm run seed:admin
```

### Using the provided scripts:
- **Windows**: `scripts/run-seed.bat`
- **Linux/Mac**: `scripts/run-seed.sh`

## Important Notes

1. **Single Administrator Policy**: The system will only create the administrator user if no other administrator exists
2. **Email Uniqueness**: The system checks for existing users with the same email before creating
3. **Automatic Startup**: The administrator user is created automatically when the backend starts
4. **Security**: Change the default password after first login in production

## Database Schema

The administrator user follows the same schema as other users but with:
- `role: 'Administrator'`
- `isActive: true`
- `isEmailVerified: true`
- `firstName: 'System'`
- `lastName: 'Administrator'`
