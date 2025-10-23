import { useState, useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import SignupRoleSelect from "@/components/auth/SignupRoleSelect";
import { useAuth } from "@/providers/AuthProvider";
import type { UserRole } from "@/types";
import { useNavigate, Link } from "react-router-dom";
import { message } from "antd";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  specialty?: string;
  licenseNumber?: string;
  general?: string;
}

export default function Signup() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Patient");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Navigate based on user role when user is available
  useEffect(() => {
    if (user) {
      if (user.role === "Administrator") {
        navigate("/Administrator");
      } else if (user.role === "Doctor") {
        navigate("/Doctor");
      } else {
        navigate("/Patient");
      }
    }
  }, [user, navigate]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Doctor-specific validation
    if (role === "Doctor") {
      if (!specialty.trim()) {
        newErrors.specialty = "Specialty is required for doctors";
      } else if (specialty.trim().length < 2) {
        newErrors.specialty = "Specialty must be at least 2 characters";
      }
      
      if (!licenseNumber.trim()) {
        newErrors.licenseNumber = "License number is required for doctors";
      } else if (licenseNumber.trim().length < 3) {
        newErrors.licenseNumber = "License number must be at least 3 characters";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const signUpData: any = { 
        email, 
        password, 
        firstName: firstName.trim(), 
        lastName: lastName.trim(), 
        role 
      };
      
      // Add doctor-specific fields if role is Doctor
      if (role === "Doctor") {
        signUpData.specialty = specialty.trim();
        signUpData.licenseNumber = licenseNumber.trim();
      }
      
      await signUp(signUpData);
      message.success("Registration successful!");
      // Navigation will be handled by useEffect when user state updates
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
      setErrors({ general: errorMessage });
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Create account" subtitle="Join the platform">
      <form onSubmit={onSubmit} className="space-y-3">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}
        
        <SignupRoleSelect role={role} onChange={setRole} />
        
        {/* Doctor-specific fields */}
        {role === "Doctor" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Specialty</label>
              <input 
                value={specialty} 
                onChange={(e) => {
                  setSpecialty(e.target.value);
                  if (errors.specialty) setErrors(prev => ({ ...prev, specialty: undefined }));
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.specialty ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Cardiology, Neurology, Pediatrics"
                required
              />
              {errors.specialty && <p className="text-red-600 text-sm mt-1">{errors.specialty}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input 
                value={licenseNumber} 
                onChange={(e) => {
                  setLicenseNumber(e.target.value);
                  if (errors.licenseNumber) setErrors(prev => ({ ...prev, licenseNumber: undefined }));
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your medical license number"
                required
              />
              {errors.licenseNumber && <p className="text-red-600 text-sm mt-1">{errors.licenseNumber}</p>}
            </div>
          </>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input 
            value={firstName} 
            onChange={(e) => {
              setFirstName(e.target.value);
              if (errors.firstName) setErrors(prev => ({ ...prev, firstName: undefined }));
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
            required
          />
          {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input 
            value={lastName} 
            onChange={(e) => {
              setLastName(e.target.value);
              if (errors.lastName) setErrors(prev => ({ ...prev, lastName: undefined }));
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
            required
          />
          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            required
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Create a strong password"
            required
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          <p className="text-gray-500 text-xs mt-1">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
            required
          />
          {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg py-2.5 font-semibold transition-colors"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
        
        <div className="text-sm text-center">
          Already have an account? <Link to="/auth/login" className="text-blue-600 hover:underline">Sign in</Link>
        </div>
      </form>
    </AuthForm>
  );
}
