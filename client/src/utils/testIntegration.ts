// Test integration utility
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 401) {
      console.log('✅ API is running - Authentication required (expected)');
      return true;
    }
    
    if (response.ok) {
      console.log('✅ API is running and accessible');
      return true;
    }
    
    console.log('❌ API connection failed');
    return false;
  } catch (error) {
    console.log('❌ API connection error:', error);
    return false;
  }
};

export const testBackendHealth = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/docs`);
    
    if (response.ok) {
      console.log('✅ Backend is running - Swagger docs accessible');
      return true;
    }
    
    console.log('❌ Backend health check failed');
    return false;
  } catch (error) {
    console.log('❌ Backend health check error:', error);
    return false;
  }
};
