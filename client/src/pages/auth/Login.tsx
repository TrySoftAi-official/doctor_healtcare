import { useState, useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { message } from "antd";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      // Login with email and password - server will automatically detect the role
      await signIn({ email, password, role: "Patient" }); // Role is ignored by login-email endpoint
      message.success("Login successful!");
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Login failed. Please check your credentials.";
      
      // Handle rate limiting errors
      if (error.response?.status === 429) {
        errorMessage = error.message || "Too many login attempts. Please wait a moment before trying again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Welcome back" subtitle="Sign in to continue">
      <form onSubmit={onSubmit} className="space-y-3">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}
        
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
            placeholder="Enter your password"
            required
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg py-2.5 font-semibold transition-colors"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        
        <div className="flex items-center justify-between text-sm">
          {/* <Link to="/auth/forgot" className="text-blue-600 hover:underline">Forgot password?</Link> */}
          <Link to="/auth/signup" className="text-gray-600 hover:underline">Create account</Link>
        </div>
      </form>
    </AuthForm>
  );
}
