import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Theme } from '@/constants/Theme';
import { IconSymbol } from './ui/IconSymbol';
import { SideMenu } from './SideMenu';

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
  const [menuVisible, setMenuVisible] = useState(false);

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
    } else {
      setMenuVisible(true);
    }
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        {showMenu && (
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <Image 
              source={require('@/assets/images/menu.png')} 
              style={styles.menuIcon}
              resizeMode="contain"
            />
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
      
      <SideMenu isVisible={menuVisible} onClose={handleCloseMenu} />
    </>
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
  menuIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  menuText: {
    ...Fonts.bold,
    color: '#464168',
    fontSize: 16,
  },
  title: {
    ...Fonts.title,
    fontSize: 20,
    color: '#464168',
    textAlign: 'center',
    flex: 1,
    marginRight: 32,
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