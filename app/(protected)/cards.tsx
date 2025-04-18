import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ScrollView 
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Theme } from '@/constants/Theme';
import { Fonts } from '@/constants/Fonts';

// Add types for the card data
interface LoyaltyCard {
  id: string;
  name: string;
  logo: any;
  color: string;
  points: number;
  nextReward: string;
  pointsToNextReward: number;
}

// Mock data for loyalty cards
const mockCards: LoyaltyCard[] = [
  {
    id: '1',
    name: 'Starbucks',
    logo: require('@/assets/images/card-placeholder.png'),
    color: '#00704A',
    points: 250,
    nextReward: 'Free Drink',
    pointsToNextReward: 50
  },
  {
    id: '2',
    name: 'Sephora',
    logo: require('@/assets/images/card-placeholder.png'),
    color: '#D81B60',
    points: 175,
    nextReward: '$10 Off',
    pointsToNextReward: 75
  }
];

export default function CardsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleAddCard = () => {
    // Navigate to add card screen
    console.log('Add a card');
  };

  const renderCard = ({ item }: { item: LoyaltyCard }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: item.color }]}
      onPress={() => console.log(`Open ${item.name} card`)}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <Image source={item.logo} style={styles.cardLogo} />
        <Text style={styles.cardName}>{item.name}</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.pointsText}>{item.points} points</Text>
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardText}>Next: {item.nextReward}</Text>
          <Text style={styles.pointsToGoText}>
            {item.pointsToNextReward} points to go
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="My Cards" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.sectionTitle}>Your Loyalty Cards</Text>
        
        {mockCards.map(card => renderCard({ item: card }))}
        
        <TouchableOpacity 
          style={styles.addCardButton}
          onPress={handleAddCard}
        >
          <View style={styles.addCardInner}>
            <Text style={styles.addCardPlus}>+</Text>
            <Text style={styles.addCardText}>Add New Card</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 80,
  },
  sectionTitle: {
    ...Fonts.title,
    fontSize: 20,
    color: Theme.colors.textPrimary,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  cardName: {
    ...Fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  cardDetails: {
    marginTop: 8,
  },
  pointsText: {
    ...Fonts.bold,
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  rewardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  rewardText: {
    ...Fonts.regular,
    fontSize: 14,
    color: '#FFFFFF',
  },
  pointsToGoText: {
    ...Fonts.regular,
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  addCardButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Theme.colors.style_07,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addCardInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  addCardPlus: {
    ...Fonts.bold,
    fontSize: 32,
    color: Theme.colors.style_07,
    marginBottom: 8,
  },
  addCardText: {
    ...Fonts.regular,
    fontSize: 16,
    color: Theme.colors.style_07,
  },
  bottomPadding: {
    height: 80,
  },
}); 