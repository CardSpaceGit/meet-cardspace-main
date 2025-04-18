import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { BlurView } from 'expo-blur';
import { Fonts } from '@/constants/Fonts';
import { Theme } from '@/constants/Theme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  SlideOutRight,
  runOnJS
} from 'react-native-reanimated';
import { 
  Gesture, 
  GestureDetector, 
  GestureHandlerRootView 
} from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.9; // 80% of screen width

interface SideMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  active?: boolean;
}

const MenuItem = ({ icon, label, onPress, active = false }: MenuItemProps) => (
  <TouchableOpacity 
    style={[styles.menuItem, active && styles.menuItemActive]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuItemIconContainer, active && styles.menuItemIconContainerActive]}>
      {icon}
    </View>
    <Text style={[styles.menuItemLabel, active && styles.menuItemLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

export function SideMenu({ isVisible, onClose }: SideMenuProps) {
  const { user } = useUser();
  const { signOut } = useAuth();
  const slideAnim = useSharedValue(-MENU_WIDTH);
  const isDragging = useSharedValue(false);

  React.useEffect(() => {
    if (isVisible) {
      slideAnim.value = withTiming(0, { duration: 300 });
    } else {
      slideAnim.value = withTiming(-MENU_WIDTH, { duration: 300 });
    }
  }, [isVisible, slideAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideAnim.value }]
    };
  });

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const handleSignOut = async () => {
    onClose();
    setTimeout(async () => {
      await signOut();
    }, 300);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      // Only allow dragging to the left (negative direction)
      if (event.translationX < 0) {
        slideAnim.value = event.translationX;
      }
    })
    .onEnd((event) => {
      isDragging.value = false;
      // If dragged more than 1/3 of the menu width, close it
      if (event.translationX < -MENU_WIDTH / 3) {
        slideAnim.value = withTiming(-MENU_WIDTH, { duration: 300 }, () => {
          runOnJS(onClose)();
        });
      } else {
        // Otherwise snap back to open position
        slideAnim.value = withTiming(0, { duration: 300 });
      }
    });

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <BlurView 
              intensity={Platform.OS === 'ios' ? 60 : 100} 
              tint="dark" 
              style={styles.backdrop}
            />
          </TouchableWithoutFeedback>
          
          <GestureDetector gesture={panGesture}>
            <Animated.View 
              style={[
                styles.menuContainer,
                animatedStyle
              ]}
            >
              <View style={styles.menuContent}>
                <SafeAreaView style={styles.safeArea}>
                  <View style={styles.dragHandle} />
                  <ScrollView style={styles.scrollView}>
                    {/* User Profile Section */}
                    <View style={styles.profileSection}>
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
                      <Text style={styles.userName}>
                        {user?.firstName} {user?.lastName}
                      </Text>
                      <Text style={styles.userEmail}>{user?.emailAddresses[0]?.emailAddress}</Text>
                    </View>
                    
                    {/* Menu Items */}
                    <View style={styles.menuItems}>
                      <MenuItem
                        icon={require('@/assets/images/home-icon.png')}
                        label="Home"
                        onPress={() => handleNavigation('/(protected)/')}
                        active={false}
                      />
                      
                      <MenuItem
                        icon={require('@/assets/images/card-icon.png')}
                        label="My Cards"
                        onPress={() => handleNavigation('/(protected)/cards')}
                        active={false}
                      />
                      
                      <MenuItem
                        icon={require('@/assets/images/profile-icon.png')}
                        label="Profile"
                        onPress={() => handleNavigation('/(protected)/profile')}
                        active={false}
                      />
                      
                      <View style={styles.divider} />
                      
                      <MenuItem
                        icon={
                          <View style={[styles.menuItemIconContainer, styles.logoutIconContainer]}>
                            <Text style={styles.logoutIconText}>↪</Text>
                          </View>
                        }
                        label="Sign Out"
                        onPress={handleSignOut}
                        active={false}
                      />
                    </View>
                  </ScrollView>
                  
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 21, 29, 0.6)',
  },
  menuContainer: {
    width: MENU_WIDTH,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
  menuContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    flex: 1,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(240, 240, 240, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.style_07,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitials: {
    ...Fonts.bold,
    fontSize: 28,
    color: '#FFFFFF',
  },
  userName: {
    ...Fonts.bold,
    fontSize: 18,
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    ...Fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  menuItems: {
    padding: 20,
    paddingTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemActive: {
    backgroundColor: 'rgba(70, 65, 104, 0.08)',
  },
  menuItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(70, 65, 104, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemIconContainerActive: {
    backgroundColor: '#464168',
  },
  menuItemIcon: {
    width: 20,
    height: 20,
  },
  menuItemLabel: {
    fontFamily: Fonts.regular.fontFamily,
    fontSize: 16,
    color: '#464168',
  },
  menuItemLabelActive: {
    fontFamily: Fonts.bold.fontFamily,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  logoutIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(235, 71, 71, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoutIconText: {
    fontSize: 18,
    color: '#EB4747',
    transform: [{ scaleX: -1 }],
  },
  logoutText: {
    color: '#EB4747',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: Theme.colors.textPrimary,
    lineHeight: 28,
  },
}); 