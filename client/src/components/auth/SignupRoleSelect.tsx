import type { UserRole } from "@/types";

interface SignupRoleSelectProps {
  role: UserRole;
  onChange: (role: UserRole) => void;
}

export default function SignupRoleSelect({ role, onChange }: SignupRoleSelectProps) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
      <select 
        value={role} 
        onChange={(e) => onChange(e.target.value as UserRole)} 
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="Doctor">Doctor</option>
        <option value="Patient">Patient</option>
      </select>
      <p className="text-xs text-gray-500 mt-1">
        Choose your account type. Administrator accounts are created by system administrators.
      </p>
    </div>
  );
}
