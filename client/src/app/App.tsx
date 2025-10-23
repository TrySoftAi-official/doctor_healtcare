import { AuthProvider } from '@/providers/AuthProvider';
import  ReactQueryProvider  from '@/providers/ReactQueryProvider';
// import { AntConfigProvider } from '@/providers/AntConfigProvider';
import AppRoutes from '@/routes/AppRoutes';

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;