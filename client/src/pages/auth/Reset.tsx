import { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { Link, useSearchParams } from "react-router-dom";
import { authService } from "@/services/authService";
import { message } from "antd";

export default function Reset() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      message.error("Invalid reset token");
      return;
    }
    if (password !== confirm) {
      message.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setDone(true);
      message.success("Password reset successfully!");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthForm title="Reset password" subtitle="Enter your new password">
      {done ? (
        <div className="space-y-3">
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">Password updated.</div>
          <Link to="/auth/login" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-semibold">Go to login</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-semibold">{loading? 'Resetting...' : 'Reset password'}</button>
        </form>
      )}
    </AuthForm>
  );
}
