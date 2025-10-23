import { Pill } from "lucide-react";
import { useState, useEffect } from "react";
import { prescriptionService } from "@/services/prescriptionService";

interface Prescription {
  _id: string;
  id?: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  expiryDate: string;
  isDispensed: boolean;
  isRefillable: boolean;
  refillCount: number;
  createdAt: string;
  doctorUser?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  doctor?: {
    name: string;
    specialty: string;
  };
  doctorId?: {
    userId?: {
      firstName: string;
      lastName: string;
      email: string;
    };
    specialty?: string;
  };
}

const PrescriptionRow = ({ prescription, onRefill, onViewDetails }: { prescription: Prescription; onRefill: (id: string) => void; onViewDetails: (prescription: Prescription) => void }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLastRefillDate = (createdAt: string) => {
    return `Prescribed: ${formatDate(createdAt)}`;
  };

  const getDoctorName = () => {
    // Check doctorUser first (populated by backend)
    if (prescription.doctorUser && prescription.doctorUser.firstName && prescription.doctorUser.lastName) {
      return `${prescription.doctorUser.firstName} ${prescription.doctorUser.lastName}`;
    }
    
    // Check doctorId.userId (populated doctor data)
    if (prescription.doctorId && prescription.doctorId.userId && prescription.doctorId.userId.firstName && prescription.doctorId.userId.lastName) {
      return `${prescription.doctorId.userId.firstName} ${prescription.doctorId.userId.lastName}`;
    }
    
    // Check doctor object
    if (prescription.doctor && prescription.doctor.name) {
      return prescription.doctor.name;
    }
    
    // Fallback to Unknown Doctor
    return 'Unknown Doctor';
  };

  const getStatusColor = () => {
    if (prescription.isDispensed) return 'bg-green-100 text-green-700';
    if (prescription.isRefillable) return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusText = () => {
    if (prescription.isDispensed) return 'Dispensed';
    if (prescription.isRefillable) return 'Available for Refill';
    return 'Pending';
  };

  return (
    <div className="space-y-2">
      {prescription.medications.map((medication, index) => (
        <div key={index} className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-blue-600">
              <Pill className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{medication.name}</p>
              <p className="text-xs text-gray-500">{medication.frequency} • {getLastRefillDate(prescription.createdAt)}</p>
              <p className="text-xs text-gray-400">Dr. {getDoctorName()}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
                {prescription.refillCount > 0 && (
                  <span className="text-xs text-gray-500">Refills: {prescription.refillCount}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onViewDetails(prescription)}
              className="text-blue-600 hover:text-blue-700 text-xs px-3 py-2 rounded-md border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              View Details
            </button>
            {prescription.isRefillable && !prescription.isDispensed && (
              <button 
                onClick={() => onRefill(prescription._id || prescription.id || '')}
                className="text-white bg-blue-600 hover:bg-blue-700 text-xs px-3 py-2 rounded-md"
              >
                Refill
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function RecentPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchRecentPrescriptions = async () => {
      try {
        setLoading(true);
        console.log('Fetching recent prescriptions...');
        const data = await prescriptionService.getRecentPrescriptions(5);
        console.log('Received prescriptions data:', data);
        console.log('First prescription doctor data:', data[0]?.doctorUser, data[0]?.doctorId);
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching recent prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPrescriptions();
  }, []);

  const handleRefill = async (prescriptionId: string) => {
    try {
      await prescriptionService.refillPrescription(prescriptionId);
      // Refresh the prescriptions list
      const data = await prescriptionService.getRecentPrescriptions(5);
      setPrescriptions(data);
    } catch (error) {
      console.error('Error refilling prescription:', error);
    }
  };

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowDetails(true);
  };

  const getDoctorName = (prescription: Prescription) => {
    // Check doctorUser first (populated by backend)
    if (prescription.doctorUser && prescription.doctorUser.firstName && prescription.doctorUser.lastName) {
      return `${prescription.doctorUser.firstName} ${prescription.doctorUser.lastName}`;
    }
    
    // Check doctorId.userId (populated doctor data)
    if (prescription.doctorId && prescription.doctorId.userId && prescription.doctorId.userId.firstName && prescription.doctorId.userId.lastName) {
      return `${prescription.doctorId.userId.firstName} ${prescription.doctorId.userId.lastName}`;
    }
    
    // Check doctor object
    if (prescription.doctor && prescription.doctor.name) {
      return prescription.doctor.name;
    }
    
    // Fallback to Unknown Doctor
    return 'Unknown Doctor';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Prescriptions</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between bg-blue-50 rounded-lg p-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Prescriptions</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No recent prescriptions</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Prescriptions</h3>
        <div className="space-y-3">
          {prescriptions.map((prescription) => (
            <PrescriptionRow 
              key={prescription._id} 
              prescription={prescription} 
              onRefill={handleRefill}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      {/* Prescription Details Modal */}
      {showDetails && selectedPrescription && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetails(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto animate-slideIn transform transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Prescription Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Prescription Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Prescription Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Prescription ID</label>
                      <p className="text-sm text-gray-800 font-mono bg-white px-2 py-1 rounded border">{selectedPrescription._id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p className="text-sm text-gray-800">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedPrescription.isDispensed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {selectedPrescription.isDispensed ? 'Dispensed' : 'Pending'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Refill Count</label>
                      <p className="text-sm text-gray-800">{selectedPrescription.refillCount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Refillable</label>
                      <p className="text-sm text-gray-800">{selectedPrescription.isRefillable ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created Date</label>
                      <p className="text-sm text-gray-800">{new Date(selectedPrescription.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                      <p className="text-sm text-gray-800">{new Date(selectedPrescription.expiryDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Doctor Information</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Dr. {getDoctorName(selectedPrescription)}</p>
                      <p className="text-sm text-gray-600">Prescribing Physician</p>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Medications</h3>
                  <div className="space-y-4">
                    {selectedPrescription.medications.map((medication, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800">{medication.name}</h4>
                              <p className="text-sm text-gray-600">{medication.dosage}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Frequency</label>
                            <p className="text-sm text-gray-800">{medication.frequency}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Duration</label>
                            <p className="text-sm text-gray-800">{medication.duration}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Instructions</label>
                            <p className="text-sm text-gray-800">{medication.instructions}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                {selectedPrescription.isRefillable && !selectedPrescription.isDispensed && (
                  <button
                    onClick={() => {
                      handleRefill(selectedPrescription._id);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Request Refill
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
