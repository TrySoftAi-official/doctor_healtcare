import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { analyticsService } from "@/services/analyticsService";
import { Modal, Button, message } from "antd";

interface AnalyticsData {
  totalUsers?: number;
  totalDoctors?: number;
  totalPatients?: number;
  totalAppointments?: number;
  upcomingAppointments?: number;
  completedAppointments?: number;
  cancelledAppointments?: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  systemUptime?: number;
  averageResponseTime?: number;
  activeUsers?: number;
  newRegistrations?: number;
  patientSatisfaction?: number;
  doctorRatings?: Array<{ doctor: string; rating: number; reviews: number }>;
  topPerformingDoctors?: Array<{ doctor: string; appointments: number; revenue: number }>;
  recentActivity?: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
}
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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [viewingReport, setViewingReport] = useState<any>(null);

  useEffect(() => {
    fetchAnalyticsData();
    fetchReports();
  }, [userRole, selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (userRole === "Administrator") {
        const data = await analyticsService.getSystemAnalytics();
        setAnalyticsData(data);
      } else {
        const data = await analyticsService.getDashboardData();
        setAnalyticsData(data);
      }
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
      // Set fallback data to prevent crashes
      setAnalyticsData({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        completedAppointments: 0,
        systemUptime: 99.9,
        activeUsers: 0,
        totalRevenue: 0,
        patientSatisfaction: 4.8
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const data = await analyticsService.getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  const handleGenerateReport = async (reportType: string, type: string) => {
    try {
      setGeneratingReport(true);
      const dateRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      };
      
      const newReport = await analyticsService.generateReport(reportType, type, dateRange);
      setReports(prev => [newReport, ...prev]);
      message.success('Report generated successfully');
    } catch (err) {
      message.error('Failed to generate report');
      console.error('Report generation error:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDownloadReport = async (report: any) => {
    try {
      const blob = await analyticsService.downloadReport(report.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.name}.${report.type.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('Report downloaded successfully');
    } catch (err) {
      message.error('Failed to download report');
      console.error('Download error:', err);
    }
  };

  const handleViewReport = async (report: any) => {
    try {
      const blob = await analyticsService.viewReport(report.id);
      const url = window.URL.createObjectURL(blob);
      setViewingReport({ ...report, url });
    } catch (err) {
      message.error('Failed to view report');
      console.error('View error:', err);
    }
  };

  const getRoleSpecificData = () => {
    if (!analyticsData) {
      return {
        title: "System Analytics",
        description: "Comprehensive system performance and user analytics",
        metrics: [],
        reports: []
      };
    }

    switch (userRole) {
      case "Administrator":
        return {
          title: "System Analytics",
          description: "Comprehensive system performance and user analytics",
          metrics: [
            { 
              label: "Total Users", 
              value: analyticsData.totalUsers?.toLocaleString() || "0", 
              change: "+12%", 
              icon: Users, 
              color: "blue" 
            },
            { 
              label: "Active Users", 
              value: analyticsData.activeUsers?.toLocaleString() || "0", 
              change: "+8%", 
              icon: Activity, 
              color: "green" 
            },
            { 
              label: "System Uptime", 
              value: `${analyticsData.systemUptime || 99.9}%`, 
              change: "+0.1%", 
              icon: CheckCircle, 
              color: "green" 
            },
            { 
              label: "Total Revenue", 
              value: `$${(analyticsData.totalRevenue || 0).toLocaleString()}`, 
              change: "+15%", 
              icon: DollarSign, 
              color: "purple" 
            }
          ],
          reports: reports
        };
      case "Doctor":
        return {
          title: "Practice Analytics",
          description: "Your practice performance and patient insights",
          metrics: [
            { 
              label: "Total Patients", 
              value: analyticsData.totalPatients?.toLocaleString() || "0", 
              change: "+5%", 
              icon: Users, 
              color: "blue" 
            },
            { 
              label: "Appointments", 
              value: analyticsData.totalAppointments?.toLocaleString() || "0", 
              change: "+12%", 
              icon: Calendar, 
              color: "green" 
            },
            { 
              label: "Revenue", 
              value: `$${(analyticsData.totalRevenue || 0).toLocaleString()}`, 
              change: "+8%", 
              icon: DollarSign, 
              color: "purple" 
            },
            { 
              label: "Patient Satisfaction", 
              value: `${analyticsData.patientSatisfaction || 4.8}/5`, 
              change: "+0.2", 
              icon: CheckCircle, 
              color: "green" 
            }
          ],
          reports: reports
        };
      case "Patient":
        return {
          title: "Health Reports",
          description: "Your health data and medical reports",
          metrics: [
            { 
              label: "Appointments", 
              value: analyticsData.totalAppointments?.toString() || "0", 
              change: "+2", 
              icon: Calendar, 
              color: "blue" 
            },
            { 
              label: "Completed", 
              value: analyticsData.completedAppointments?.toString() || "0", 
              change: "+1", 
              icon: CheckCircle, 
              color: "green" 
            },
            { 
              label: "Health Score", 
              value: "85%", 
              change: "+5%", 
              icon: Activity, 
              color: "green" 
            },
            { 
              label: "Last Checkup", 
              value: "2 weeks", 
              change: "-1 week", 
              icon: Clock, 
              color: "blue" 
            }
          ],
          reports: reports
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              {data.title}
            </h1>
            <p className="text-gray-600">
              {data.description}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={fetchAnalyticsData}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}


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

          {/* Additional Analytics for Administrators */}
          {userRole === "Administrator" && analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Top Performing Doctors */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Doctors</h4>
                <div className="space-y-3">
                  {analyticsData.topPerformingDoctors?.slice(0, 5).map((doctor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doctor.doctorName}</p>
                          <p className="text-sm text-gray-500">{doctor.appointments} appointments</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${doctor.revenue?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  {analyticsData.recentActivity?.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.user} • {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
            {data.reports.length > 0 ? (
              data.reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{report.name}</p>
                      <p className="text-xs text-gray-500">
                        {report.type} • {report.size} • {report.date}
                      </p>
                      {report.status === 'Generating' && (
                        <p className="text-xs text-yellow-600">Generating...</p>
                      )}
                      {report.status === 'Failed' && (
                        <p className="text-xs text-red-600">Failed</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewReport(report)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="View Report"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button 
                      onClick={() => handleDownloadReport(report)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Download Report"
                      disabled={report.status !== 'Generated'}
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reports available</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button 
                onClick={() => handleGenerateReport('User Activity', 'PDF')}
                disabled={generatingReport}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                {generatingReport ? 'Generating...' : 'Generate Monthly Report'}
              </button>
              <button 
                onClick={() => handleGenerateReport('System Performance', 'Excel')}
                disabled={generatingReport}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                {generatingReport ? 'Generating...' : 'Export System Data'}
              </button>
              <button 
                onClick={() => handleGenerateReport('Financial Summary', 'PDF')}
                disabled={generatingReport}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                {generatingReport ? 'Generating...' : 'Generate Financial Report'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report View Modal */}
      <Modal
        title={viewingReport?.name || 'Report Viewer'}
        open={!!viewingReport}
        onCancel={() => setViewingReport(null)}
        footer={[
          <Button key="download" onClick={() => viewingReport && handleDownloadReport(viewingReport)}>
            Download
          </Button>,
          <Button key="close" onClick={() => setViewingReport(null)}>
            Close
          </Button>
        ]}
        width="90%"
        style={{ maxWidth: '1200px' }}
      >
        {viewingReport && (
          <div className="h-96">
            {viewingReport.type === 'PDF' ? (
              <iframe
                src={viewingReport.url}
                className="w-full h-full border-0"
                title={viewingReport.name}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Preview not available for {viewingReport.type} files</p>
                  <Button onClick={() => handleDownloadReport(viewingReport)}>
                    Download to View
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportsContent;
