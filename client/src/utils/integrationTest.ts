import api from '@/lib/api';

/**
 * Comprehensive integration test for all API services
 * This file tests the connection between frontend services and backend endpoints
 */

export interface IntegrationTestResult {
  service: string;
  endpoint: string;
  method: string;
  status: 'success' | 'error' | 'skipped';
  message: string;
  responseTime?: number;
}

class IntegrationTester {
  private results: IntegrationTestResult[] = [];

  async testAllServices(): Promise<IntegrationTestResult[]> {
    console.log('🧪 Starting comprehensive API integration tests...');
    
    // Test API base connection
    await this.testApiConnection();
    
    // Test authentication endpoints
    await this.testAuthEndpoints();
    
    // Test appointment endpoints
    await this.testAppointmentEndpoints();
    
    // Test doctor endpoints
    await this.testDoctorEndpoints();
    
    // Test patient endpoints
    await this.testPatientEndpoints();
    
    // Test prescription endpoints
    await this.testPrescriptionEndpoints();
    
    // Test notification endpoints
    await this.testNotificationEndpoints();
    
    // Test message endpoints
    await this.testMessageEndpoints();
    
    // Test dashboard endpoints
    await this.testDashboardEndpoints();
    
    // Test upload endpoints
    await this.testUploadEndpoints();
    
    // Test settings endpoints
    await this.testSettingsEndpoints();
    
    console.log('✅ Integration tests completed!');
    return this.results;
  }

  private async testApiConnection(): Promise<void> {
    try {
      const startTime = Date.now();
      await api.get('/');
      const responseTime = Date.now() - startTime;
      
      this.addResult({
        service: 'API',
        endpoint: '/',
        method: 'GET',
        status: 'success',
        message: 'API base connection successful',
        responseTime
      });
    } catch (error) {
      this.addResult({
        service: 'API',
        endpoint: '/',
        method: 'GET',
        status: 'error',
        message: `API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  private async testAuthEndpoints(): Promise<void> {
    const authEndpoints = [
      { method: 'POST', endpoint: '/auth/login', service: 'AuthService' },
      { method: 'POST', endpoint: '/auth/register', service: 'AuthService' },
      { method: 'POST', endpoint: '/auth/forgot-password', service: 'AuthService' },
      { method: 'POST', endpoint: '/auth/reset-password', service: 'AuthService' },
      { method: 'GET', endpoint: '/auth/profile', service: 'AuthService' },
      { method: 'PATCH', endpoint: '/auth/change-password', service: 'AuthService' }
    ];

    for (const endpoint of authEndpoints) {
      await this.testEndpoint(endpoint.service, endpoint.endpoint, endpoint.method);
    }
  }

  private async testAppointmentEndpoints(): Promise<void> {
    const appointmentEndpoints = [
      { method: 'POST', endpoint: '/appointments', service: 'AppointmentService' },
      { method: 'GET', endpoint: '/appointments', service: 'AppointmentService' },
      { method: 'GET', endpoint: '/appointments/upcoming', service: 'AppointmentService' },
      { method: 'GET', endpoint: '/appointments/doctor/:id', service: 'AppointmentService' },
      { method: 'GET', endpoint: '/appointments/patient/:id', service: 'AppointmentService' },
      { method: 'GET', endpoint: '/appointments/:id', service: 'AppointmentService' },
      { method: 'PATCH', endpoint: '/appointments/:id', service: 'AppointmentService' },
      { method: 'PATCH', endpoint: '/appointments/:id/cancel', service: 'AppointmentService' },
      { method: 'DELETE', endpoint: '/appointments/:id', service: 'AppointmentService' }
    ];

    for (const endpoint of appointmentEndpoints) {
      await this.testEndpoint(endpoint.service, endpoint.endpoint, endpoint.method);
    }
  }

  private async testDoctorEndpoints(): Promise<void> {
    const doctorEndpoints = [
      { method: 'GET', endpoint: '/doctors', service: 'DoctorService' },
      { method: 'GET', endpoint: '/doctors/specialties', service: 'DoctorService' },
      { method: 'GET', endpoint: '/doctors/available', service: 'DoctorService' },
      { method: 'GET', endpoint: '/doctors/my-profile', service: 'DoctorService' },
      { method: 'PATCH', endpoint: '/doctors/my-profile', service: 'DoctorService' },
      { method: 'PATCH', endpoint: '/doctors/my-profile/availability', service: 'DoctorService' },
      { method: 'GET', endpoint: '/doctors/:id', service: 'DoctorService' },
      { method: 'PATCH', endpoint: '/doctors/:id', service: 'DoctorService' },
      { method: 'PATCH', endpoint: '/doctors/:id/rating', service: 'DoctorService' }
    ];

    for (const endpoint of doctorEndpoints) {
      await this.testEndpoint(endpoint.service, endpoint.endpoint, endpoint.method);
    }
  }

  private async testPatientEndpoints(): Promise<void> {
    const patientEndpoints = [
      { method: 'GET', endpoint: '/patients', service: 'PatientService' },
      { method: 'GET', endpoint: '/patients/my-profile', service: 'PatientService' },
      { method: 'PATCH', endpoint: '/patients/my-profile', service: 'PatientService' },
      { method: 'PATCH', endpoint: '/patients/my-profile/medical-history', service: 'PatientService' },
      { method: 'PATCH', endpoint: '/patients/my-profile/allergies', service: 'PatientService' },
      { method: 'PATCH', endpoint: '/patients/my-profile/medications', service: 'PatientService' },
      { method: 'PATCH', endpoint: '/patients/my-profile/insurance', service: 'PatientService' },
      { method: 'GET', endpoint: '/patients/:id', service: 'PatientService' },
      { method: 'PATCH', endpoint: '/patients/:id', service: 'PatientService' }
    ];

    for (const endpoint of patientEndpoints) {
      await this.testEndpoint(endpoint.service, endpoint.endpoint, endpoint.method);
    }
  }

  private async testPrescriptionEndpoints(): Promise<void> {
    const prescriptionEndpoints = [
      { method: 'POST', endpoint: '/prescriptions', service: 'PrescriptionService' },
      { method: 'GET', endpoint: '/prescriptions', service: 'PrescriptionService' },
      { method: 'GET', endpoint: '/prescriptions/my-prescriptions', service: 'PrescriptionService' },
      { method: 'GET', endpoint: '/prescriptions/my-prescriptions/recent', service: 'PrescriptionService' },
      { method: 'GET', endpoint: '/prescriptions/doctor-prescriptions', service: 'PrescriptionService' },
      { method: 'GET', endpoint: '/prescriptions/:id', service: 'PrescriptionService' },
      { method: 'PATCH', endpoint: '/prescriptions/:id', service: 'PrescriptionService' },
      { method: 'PATCH', endpoint: '/prescriptions/:id/dispense', service: 'PrescriptionService' },
      { method: 'PATCH', endpoint: '/prescriptions/:id/refill', service: 'PrescriptionService' }
    ];

    for (const endpoint of prescriptionEndpoints) {
      await this.testEndpoint(endpoint.service, endpoint.endpoint, endpoint.method);
    }
  }

  private async testNotificationEndpoints(): Promise<void> {
    const notificationEndpoints = [
      { method: 'POST', endpoint: '/notifications', service: 'NotificationService' },
      { method: 'GET', endpoint: '/notifications', service: 'NotificationService' },
      { method: 'GET', endpoint: '/notifications/my-notifications', service: 'NotificationService' },
      { method: 'GET', endpoint: '/notifications/unread', service: 'NotificationService' },
      { method: 'GET', endpoint: '/notifications/count', service: 'NotificationService' },
      { method: 'GET', endpoint: '/notifications/recent', service: 'NotificationService' },
      { method: 'GET', endpoint: '/notifications/:id', service: 'NotificationService' },
      { method: 'PATCH', endpoint: '/notifications/:id/read', service: 'NotificationService' },
      { method: 'PATCH', endpoint: '/notifications/:id/unread', service: 'NotificationService' },
      { method: 'PATCH', endpoint: '/notifications/mark-all-read', service: 'NotificationService' },
      { method: 'DELETE', endpoint: '/notifications/:id', service: 'NotificationService' },
      { method: 'DELETE', endpoint: '/notifications/all', service: 'NotificationService' }
    ];

    for (const endpoint of notificationEndpoints) {
      await this.testEndpoint(endpoint.service, endpoint.endpoint, endpoint.method);
    }
  }

  private async testMessageEndpoints(): Promise<void> {
    const messageEndpoints = [
      { method: 'POST', endpoint: '/messages', service: 'MessageService' },
      { method: 'GET', endpoint: '/messages', service: 'MessageService' },
      { method: 'GET', endpoint: '/messages/my-messages', service: 'MessageService' },
      { method: 'GET', endpoint: '/messages/unread', service: 'MessageService' },
      { method: 'GET', endpoint: '/messages/recent', service: 'MessageService' },
      { method: 'GET', endpoint: '/messages/conversation/:userId', service: 'MessageService' },
      { method: 'GET', endpoint: '/messages/:id', service: 'MessageService' },
      { method: 'PATCH', endpoint: '/messages/:id/read', service: 'MessageService' },
      { method: 'PATCH', endpoint: '/messages/:id/unread', service: 'MessageService' },
      { method: 'DELETE', endpoint: '/messages/:id', service: 'MessageService' }
    ];

    for (const endpoint of messageEndpoints) {
      await this.testEndpoint(endpoint.service, endpoint.endpoint, endpoint.method);
    }
  }

  private async testDashboardEndpoints(): Promise<void> {
    const dashboardEndpoints = [
      { method: 'GET', endpoint: '/dashboard', service: 'DashboardService' },
      { method: 'GET', endpoint: '/dashboard/stats', service: 'DashboardService' }
    ];

    for (const endpoint of dashboardEndpoints) {
      await this.testEndpoint(endpoint.service, endpoint.endpoint, endpoint.method);
    }
  }

  private async testUploadEndpoints(): Promise<void> {
    const uploadEndpoints = [
      { method: 'POST', endpoint: '/upload/single', service: 'UploadService' },
      { method: 'POST', endpoint: '/upload/multiple', service: 'UploadService' },
      { method: 'POST', endpoint: '/upload/profile-image', service: 'UploadService' },
      { method: 'POST', endpoint: '/upload/document', service: 'UploadService' },
      { method: 'DELETE', endpoint: '/upload/:filename', service: 'UploadService' }
    ];

    for (const endpoint of uploadEndpoints) {
      await this.testEndpoint(endpoint.service, endpoint.endpoint, endpoint.method);
    }
  }

  private async testSettingsEndpoints(): Promise<void> {
    const settingsEndpoints = [
      { method: 'GET', endpoint: '/settings/profile', service: 'SettingsService' },
      { method: 'PATCH', endpoint: '/settings/profile', service: 'SettingsService' },
      { method: 'PATCH', endpoint: '/settings/notifications', service: 'SettingsService' },
      { method: 'PATCH', endpoint: '/settings/privacy', service: 'SettingsService' },
      { method: 'PATCH', endpoint: '/settings/doctor', service: 'SettingsService' },
      { method: 'PATCH', endpoint: '/settings/patient', service: 'SettingsService' },
      { method: 'GET', endpoint: '/settings/system', service: 'SettingsService' },
      { method: 'PATCH', endpoint: '/settings/system', service: 'SettingsService' }
    ];

    for (const endpoint of settingsEndpoints) {
      await this.testEndpoint(endpoint.service, endpoint.endpoint, endpoint.method);
    }
  }

  private async testEndpoint(service: string, endpoint: string, method: string): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Test with OPTIONS request first to check CORS
      await api.options(endpoint);
      const responseTime = Date.now() - startTime;
      
      this.addResult({
        service,
        endpoint,
        method,
        status: 'success',
        message: `Endpoint accessible (CORS enabled)`,
        responseTime
      });
    } catch (error) {
      // If OPTIONS fails, try the actual method
      try {
        const startTime = Date.now();
        let response;
        
        switch (method) {
          case 'GET':
            response = await api.get(endpoint);
            break;
          case 'POST':
            response = await api.post(endpoint, {});
            break;
          case 'PATCH':
            response = await api.patch(endpoint, {});
            break;
          case 'DELETE':
            response = await api.delete(endpoint);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        
        const responseTime = Date.now() - startTime;
        
        this.addResult({
          service,
          endpoint,
          method,
          status: 'success',
          message: `Endpoint accessible (${response.status})`,
          responseTime
        });
      } catch (methodError) {
        this.addResult({
          service,
          endpoint,
          method,
          status: 'error',
          message: `Endpoint failed: ${methodError instanceof Error ? methodError.message : 'Unknown error'}`
        });
      }
    }
  }

  private addResult(result: IntegrationTestResult): void {
    this.results.push(result);
    console.log(`${result.status === 'success' ? '✅' : '❌'} ${result.service} - ${result.method} ${result.endpoint}: ${result.message}`);
  }

  getResults(): IntegrationTestResult[] {
    return this.results;
  }

  getSummary(): { total: number; success: number; errors: number; successRate: number } {
    const total = this.results.length;
    const success = this.results.filter(r => r.status === 'success').length;
    const errors = this.results.filter(r => r.status === 'error').length;
    const successRate = total > 0 ? (success / total) * 100 : 0;

    return { total, success, errors, successRate };
  }
}

// Export a function to run the integration test
export async function runIntegrationTest(): Promise<IntegrationTestResult[]> {
  const tester = new IntegrationTester();
  return await tester.testAllServices();
}

// Export the tester class for custom usage
export { IntegrationTester };
