import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Theme } from '@/constants/Theme';

interface NavItem {
  name: string;
  label: string;
  icon: any;
  activeIcon?: any;
  route: string;
}

interface BottomNavProps {
  items?: NavItem[];
}

export function BottomNav({ items = defaultNavItems }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavPress = (route: string) => {
    router.replace(route as any);
  };

  return (
    <View style={styles.bottomTab}>
      {items.map((item) => {
        const isActive = pathname === item.route;
        
        return (
          <TouchableOpacity 
            key={item.name}
            style={styles.tabItem} 
            onPress={() => handleNavPress(item.route)}
            activeOpacity={0.7}
          >
            <Image 
              source={isActive && item.activeIcon ? item.activeIcon : item.icon} 
              style={[styles.tabIcon, isActive && styles.activeTabIcon]}
              resizeMode="contain"
            />
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Default navigation items for the app
const defaultNavItems: NavItem[] = [
  {
    name: 'home',
    label: 'Home',
    icon: require('@/assets/images/home-icon.png'),
    route: '/(protected)/'
  },
  {
    name: 'cards',
    label: 'Cards',
    icon: require('@/assets/images/card-icon.png'),
    route: '/(protected)/cards'
  },
  {
    name: 'profile',
    label: 'Profile',
    icon: require('@/assets/images/profile-icon.png'),
    route: '/(protected)/profile'
  }
];

const styles = StyleSheet.create({
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 5,
    elevation: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    opacity: 0.7,
  },
  activeTabIcon: {
    opacity: 1,
    tintColor: Theme.colors.style_07,
  },
  tabText: {
    ...Fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  activeTabText: {
    ...Fonts.bold,
    color: Theme.colors.style_07,
  },
}); 