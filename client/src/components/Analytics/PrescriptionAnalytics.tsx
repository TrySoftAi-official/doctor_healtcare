import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { analyticsService } from '@/services/analyticsService';
import { 
  BarChart3, 
  TrendingUp, 
  Pill, 
  AlertTriangle,
  Clock,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface PrescriptionAnalyticsProps {
  dateRange?: { start: string; end: string };
}

export default function PrescriptionAnalytics({ dateRange }: PrescriptionAnalyticsProps) {
  const { } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await analyticsService.getPrescriptionAnalytics(dateRange);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load prescription analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAnalytics}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prescription Analytics</h2>
          <p className="text-gray-600">Overview of prescription data and trends</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Pill className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics?.totalPrescriptions || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dispensed</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics?.dispensedPrescriptions || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics?.pendingPrescriptions || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Refill Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analytics?.prescriptionRefillRate || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prescription Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription Trends</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Chart visualization would go here</p>
              <p className="text-sm">Data points: {analytics?.prescriptionTrends?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {analytics?.prescriptionStatusDistribution?.map((status: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    status.status === 'dispensed' ? 'bg-green-500' :
                    status.status === 'pending' ? 'bg-yellow-500' :
                    status.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {status.status.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatNumber(status.count)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Medications and Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Prescribed Medications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Prescribed Medications</h3>
          <div className="space-y-3">
            {analytics?.mostPrescribedMedications?.slice(0, 5).map((med: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{med.medication}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatNumber(med.count)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Prescribing Doctors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Prescribing Doctors</h3>
          <div className="space-y-3">
            {analytics?.topPrescribingDoctors?.slice(0, 5).map((doctor: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <span className="text-sm font-medium text-gray-700">{doctor.doctor}</span>
                    <p className="text-xs text-gray-500">{doctor.specialty}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatNumber(doctor.prescriptions)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {analytics?.averagePrescriptionDuration || 0} days
            </p>
            <p className="text-sm text-gray-600">Average Duration</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(analytics?.totalPrescriptions || 0)}
            </p>
            <p className="text-sm text-gray-600">This Period</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatPercentage(analytics?.prescriptionRefillRate || 0)}
            </p>
            <p className="text-sm text-gray-600">Refill Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
