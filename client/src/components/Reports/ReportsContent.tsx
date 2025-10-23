import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  LineChart,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

const ReportsContent = () => {
  const { user } = useAuth();
  const userRole = user?.role || "Patient";
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock data - in real app, this would come from API
  const getRoleSpecificData = () => {
    switch (userRole) {
      case "Administrator":
        return {
          title: "System Analytics",
          description: "Comprehensive system performance and user analytics",
          metrics: [
            { label: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "blue" },
            { label: "Active Sessions", value: "1,234", change: "+8%", icon: Activity, color: "green" },
            { label: "System Uptime", value: "99.9%", change: "+0.1%", icon: CheckCircle, color: "green" },
            { label: "Revenue", value: "$45,678", change: "+15%", icon: DollarSign, color: "purple" }
          ],
          reports: [
            { id: 1, name: "User Activity Report", type: "PDF", size: "2.3 MB", date: "2024-01-15" },
            { id: 2, name: "System Performance", type: "Excel", size: "1.8 MB", date: "2024-01-14" },
            { id: 3, name: "Financial Summary", type: "PDF", size: "3.1 MB", date: "2024-01-13" }
          ]
        };
      case "Doctor":
        return {
          title: "Practice Analytics",
          description: "Your practice performance and patient insights",
          metrics: [
            { label: "Total Patients", value: "324", change: "+5%", icon: Users, color: "blue" },
            { label: "Appointments", value: "156", change: "+12%", icon: Calendar, color: "green" },
            { label: "Revenue", value: "$12,450", change: "+8%", icon: DollarSign, color: "purple" },
            { label: "Patient Satisfaction", value: "4.8/5", change: "+0.2", icon: CheckCircle, color: "green" }
          ],
          reports: [
            { id: 1, name: "Patient Demographics", type: "PDF", size: "1.2 MB", date: "2024-01-15" },
            { id: 2, name: "Appointment Analysis", type: "Excel", size: "0.9 MB", date: "2024-01-14" },
            { id: 3, name: "Revenue Report", type: "PDF", size: "1.5 MB", date: "2024-01-13" }
          ]
        };
      case "Patient":
        return {
          title: "Health Reports",
          description: "Your health data and medical reports",
          metrics: [
            { label: "Appointments", value: "8", change: "+2", icon: Calendar, color: "blue" },
            { label: "Prescriptions", value: "3", change: "+1", icon: FileText, color: "green" },
            { label: "Health Score", value: "85%", change: "+5%", icon: Activity, color: "green" },
            { label: "Last Checkup", value: "2 weeks", change: "-1 week", icon: Clock, color: "blue" }
          ],
          reports: [
            { id: 1, name: "Blood Test Results", type: "PDF", size: "0.8 MB", date: "2024-01-15" },
            { id: 2, name: "X-Ray Report", type: "PDF", size: "2.1 MB", date: "2024-01-10" },
            { id: 3, name: "Prescription History", type: "PDF", size: "0.5 MB", date: "2024-01-08" }
          ]
        };
      default:
        return {
          title: "Reports",
          description: "Your reports and analytics",
          metrics: [],
          reports: []
        };
    }
  };

  const data = getRoleSpecificData();

  const getMetricColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      red: "bg-red-100 text-red-600"
    };
    return colors[color as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          {data.title}
        </h1>
        <p className="text-gray-600">
          {data.description}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMetricColor(metric.color)}`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                {metric.change}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {userRole === "Administrator" ? "System Performance" : 
                 userRole === "Doctor" ? "Appointment Trends" : "Health Progress"}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <LineChart className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <PieChart className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                {userRole === "Administrator" ? "User Growth" : 
                 userRole === "Doctor" ? "Patient Satisfaction" : "Appointment History"}
              </h4>
              <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                <LineChart className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                {userRole === "Administrator" ? "Revenue Breakdown" : 
                 userRole === "Doctor" ? "Service Distribution" : "Health Metrics"}
              </h4>
              <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                <PieChart className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {data.reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.type} • {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                Generate Monthly Report
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                Export Patient Data
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                Schedule Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsContent;
