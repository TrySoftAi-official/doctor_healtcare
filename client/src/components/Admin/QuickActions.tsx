import { Plus, Calendar, FileText, BarChart3 } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Patient detail",
      icon: <Plus className="w-6 h-6 text-white" />,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Schedule",
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Records",
      icon: <FileText className="w-6 h-6 text-white" />,
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} text-white rounded-lg p-4 flex flex-col items-center justify-center space-y-2 transition-colors`}
          >
            {action.icon}
            <span className="text-sm font-medium">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
