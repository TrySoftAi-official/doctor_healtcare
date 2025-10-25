import { AuthProvider } from '@/providers/AuthProvider';
import  ReactQueryProvider  from '@/providers/ReactQueryProvider';
import { ToastProvider } from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
// import { AntConfigProvider } from '@/providers/AntConfigProvider';
import AppRoutes from '@/routes/AppRoutes';

function App() {
  return (
    <ErrorBoundary>
      <ReactQueryProvider>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </ReactQueryProvider>
    </ErrorBoundary>
  );
}

export default App;