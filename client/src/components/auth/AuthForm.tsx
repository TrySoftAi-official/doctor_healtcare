export default function AuthForm({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
        {subtitle ? <p className="text-sm text-gray-600 mb-4">{subtitle}</p> : null}
        {children}
      </div>
    </div>
  );
}
