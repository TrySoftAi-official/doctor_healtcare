import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import BookAppointment from '@/pages/BookAppointment';
import AdminDashboard from '@/pages/AdminDashboard';
import Settings from '@/pages/Settings';
import Messages from '@/pages/Messages';
import Reports from '@/pages/Reports';
import Appointments from '@/pages/Appointments';
import PatientPanel from '@/pages/PatientPanel';
import DoctorPlan from '@/pages/DoctorPlan';
import AdministratorPatients from '@/pages/AdministratorPatients';
import TestMobile from '@/pages/TestMobile';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import Forgot from '@/pages/auth/Forgot';
import Reset from '@/pages/auth/Reset';
import PublicHeader from '@/layout/Header/PublicHeader';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Placeholder components for routes that don't exist yet
const Services = () => (
  <div className="min-h-screen flex items-center justify-center">
    <h1 className="text-3xl font-bold">Services Page</h1>
  </div>
);

const Contact = () => (
  <div className="min-h-screen flex items-center justify-center">
    <h1 className="text-3xl font-bold">Contact Page</h1>
  </div>
);

export default function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Protected Stakeholder dashboards */}
        <Route 
          path="/Administrator" 
          element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Administrator/settings" 
          element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Administrator/messages" 
          element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <Messages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Administrator/reports" 
          element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Administrator/appointment" 
          element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <Appointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Administrator/patients" 
          element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <AdministratorPatients />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Doctor" 
          element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <DoctorPlan />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Doctor/settings" 
          element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Doctor/messages" 
          element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <Messages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Doctor/reports" 
          element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Doctor/appointments" 
          element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <Appointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Patient" 
          element={
            <ProtectedRoute allowedRoles={['Patient']}>
              <PatientPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Patient/settings" 
          element={
            <ProtectedRoute allowedRoles={['Patient']}>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Patient/messages" 
          element={
            <ProtectedRoute allowedRoles={['Patient']}>
              <Messages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Patient/reports" 
          element={
            <ProtectedRoute allowedRoles={['Patient']}>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Patient/appointments" 
          element={
            <ProtectedRoute allowedRoles={['Patient']}>
              <Appointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/appointment" 
          element={
            <ProtectedRoute allowedRoles={['Patient']}>
              <PatientPanel />
            </ProtectedRoute>
          } 
        />

        {/* Auth - Public routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/forgot" element={<Forgot />} />
        <Route path="/auth/reset" element={<Reset />} />

        {/* Public site */}
        <Route path="/" element={
          <>
            <PublicHeader />
            <Home />
          </>
        } />
        <Route path="/services" element={
          <>
            <PublicHeader />
            <Services />
          </>
        } />
        <Route path="/book" element={
          <>
            <PublicHeader />
            <BookAppointment />
          </>
        } />
        <Route path="/contact" element={
          <>
            <PublicHeader />
            <Contact />
          </>
        } />
        
        {/* Test route */}
        <Route path="/test-mobile" element={<TestMobile />} />
      </Routes>
    </>
  );
}
