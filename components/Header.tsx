import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Theme } from '@/constants/Theme';
import { IconSymbol } from './ui/IconSymbol';

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
}

export function Header({
  title = 'Welcome',
  showMenu = true,
  showProfile = true,
  onMenuPress,
  onProfilePress,
}: HeaderProps) {
  const { user } = useUser();
  const router = useRouter();

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/(protected)/profile');
    }
  };

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    }
    // Default menu behavior could be added here
  };

  return (
    <View style={styles.container}>
      {showMenu && (
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <View style={styles.menuIconContainer}>
            <View style={[styles.menuLine, { width: 24 }]} />
            <View style={[styles.menuLine, { width: 18 }]} />
            <View style={[styles.menuLine, { width: 12 }]} />
          </View>
          <Text style={styles.menuText}>Menu</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{title}</Text>

      {showProfile && (
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitials}>
                {user?.firstName?.[0] || ''}
                {user?.lastName?.[0] || ''}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    marginRight: 8,
    justifyContent: 'center',
  },
  menuLine: {
    height: 3,
    backgroundColor: '#6A5ACD',
    marginVertical: 2,
    borderRadius: 2,
  },
  menuText: {
    ...Fonts.bold,
    color: '#464168',
    fontSize: 16,
  },
  title: {
    ...Fonts.title,
    fontSize: 24,
    color: '#464168',
    textAlign: 'center',
    flex: 1,
  },
  profileButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  profileImagePlaceholder: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.style_07,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    ...Fonts.bold,
    color: '#FFFFFF',
    fontSize: 16,
  },
}); 