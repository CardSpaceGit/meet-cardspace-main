import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ProtectedHome() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    // The redirect will happen automatically due to the protected layout
  };

  const goToProfile = () => {
    router.push('/(protected)/profile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      
      <View style={styles.card}>
        <Text style={styles.greeting}>
          Hello, {user?.firstName || 'User'}
        </Text>
        <Text style={styles.infoText}>
          You are now signed in with {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={goToProfile}
        >
          <Text style={styles.buttonText}>View Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.signOutButton]} 
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#6c47ff',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  signOutButton: {
    backgroundColor: '#ff4747',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
}); 