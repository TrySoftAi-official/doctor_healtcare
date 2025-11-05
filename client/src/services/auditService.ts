import api from '@/lib/api';

export interface AuditLog {
  _id: string;
  entityType: 'prescription' | 'appointment' | 'user' | 'system';
  entityId: string;
  action: 'created' | 'updated' | 'deleted' | 'dispensed' | 'cancelled' | 'refilled';
  performedBy: string;
  performedByRole: string;
  timestamp: Date;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditFilters {
  entityType?: string;
  action?: string;
  performedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export const auditService = {
  async getAuditLogs(filters?: AuditFilters): Promise<AuditLog[]> {
    const response = await api.get('/audit/logs', { params: filters });
    return response.data;
  },

  async getPrescriptionAuditLogs(prescriptionId: string): Promise<AuditLog[]> {
    const response = await api.get(`/audit/prescriptions/${prescriptionId}`);
    return response.data;
  },

  async getAppointmentAuditLogs(appointmentId: string): Promise<AuditLog[]> {
    const response = await api.get(`/audit/appointments/${appointmentId}`);
    return response.data;
  },

  async getUserAuditLogs(userId: string): Promise<AuditLog[]> {
    const response = await api.get(`/audit/users/${userId}`);
    return response.data;
  },

  async getSystemAuditLogs(filters?: AuditFilters): Promise<AuditLog[]> {
    const response = await api.get('/audit/system', { params: filters });
    return response.data;
  },

  async exportAuditLogs(filters?: AuditFilters, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await api.post('/audit/export', { 
      filters, 
      format 
    }, {
      responseType: 'blob'
    });
    return response.data;
  },

  async getAuditStatistics(dateRange?: { start: string; end: string }) {
    const response = await api.get('/audit/statistics', { 
      params: dateRange 
    });
    return response.data;
  }
};

// Audit logging utility functions
export const auditLogger = {
  logPrescriptionCreated: (prescriptionId: string, doctorId: string, patientId: string) => ({
    entityType: 'prescription' as const,
    entityId: prescriptionId,
    action: 'created' as const,
    performedBy: doctorId,
    metadata: { patientId }
  }),

  logPrescriptionUpdated: (prescriptionId: string, doctorId: string, changes: Record<string, any>) => ({
    entityType: 'prescription' as const,
    entityId: prescriptionId,
    action: 'updated' as const,
    performedBy: doctorId,
    changes
  }),

  logPrescriptionDispensed: (prescriptionId: string, dispensedBy: string, patientId: string) => ({
    entityType: 'prescription' as const,
    entityId: prescriptionId,
    action: 'dispensed' as const,
    performedBy: dispensedBy,
    metadata: { patientId }
  }),

  logPrescriptionRefilled: (prescriptionId: string, patientId: string, refillCount: number) => ({
    entityType: 'prescription' as const,
    entityId: prescriptionId,
    action: 'refilled' as const,
    performedBy: patientId,
    metadata: { refillCount }
  }),

  logAppointmentCreated: (appointmentId: string, patientId: string, doctorId: string) => ({
    entityType: 'appointment' as const,
    entityId: appointmentId,
    action: 'created' as const,
    performedBy: patientId,
    metadata: { doctorId }
  }),

  logAppointmentUpdated: (appointmentId: string, updatedBy: string, changes: Record<string, any>) => ({
    entityType: 'appointment' as const,
    entityId: appointmentId,
    action: 'updated' as const,
    performedBy: updatedBy,
    changes
  }),

  logUserLogin: (userId: string, ipAddress?: string) => ({
    entityType: 'user' as const,
    entityId: userId,
    action: 'updated' as const,
    performedBy: userId,
    metadata: { login: true, ipAddress }
  }),

  logSystemEvent: (event: string, details: Record<string, any>) => ({
    entityType: 'system' as const,
    entityId: 'system',
    action: 'updated' as const,
    performedBy: 'system',
    metadata: { event, ...details }
  })
};

export default auditService;
