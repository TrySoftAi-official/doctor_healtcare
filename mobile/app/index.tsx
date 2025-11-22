import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect based on role
  if (user.role === 'Administrator') {
    return <Redirect href="/(tabs)/admin" />;
  } else if (user.role === 'Doctor') {
    return <Redirect href="/(tabs)/doctor" />;
  } else {
    return <Redirect href="/(tabs)/patient" />;
  }
}

