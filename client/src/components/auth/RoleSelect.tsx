import type { UserRole } from "@/types";

interface RoleSelectProps {
  role: UserRole;
  onChange: (role: UserRole) => void;
}

export default function RoleSelect({ role, onChange }: RoleSelectProps) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">Sign in as</label>
      <select 
        value={role} 
        onChange={(e) => onChange(e.target.value as UserRole)} 
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="Administrator">Administrator</option>
        <option value="Doctor">Doctor</option>
        <option value="Patient">Patient</option>
      </select>
    </div>
  );
}
