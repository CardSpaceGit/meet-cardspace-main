import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user information...</Text>
      </View>
    );
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {user.imageUrl ? (
          <Image 
            source={{ uri: user.imageUrl }} 
            style={styles.profileImage} 
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImagePlaceholderText}>
              {user.firstName?.charAt(0) || ''}
              {user.lastName?.charAt(0) || ''}
            </Text>
          </View>
        )}
        
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.email}>
          {user.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User ID</Text>
          <Text style={styles.infoValue}>{user.id}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created</Text>
          <Text style={styles.infoValue}>
            {formatDate(user.createdAt)}
          </Text>
        </View>
        
        {user.lastSignInAt && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Sign In</Text>
            <Text style={styles.infoValue}>
              {formatDate(user.lastSignInAt)}
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6c47ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImagePlaceholderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
  },
  button: {
    margin: 20,
    backgroundColor: '#6c47ff',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
}); 