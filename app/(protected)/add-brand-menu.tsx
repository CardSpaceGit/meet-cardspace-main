import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/Theme';
import { ColorPalette } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { fetchBrands, Brand as BrandType } from '@/app/services/brandService';
import { 
  fetchAllCategories, 
  fetchFeaturedCategories, 
  Category as CategoryType 
} from '@/app/services/categoryService';

export default function AddBrandMenuScreen() {
  const router = useRouter();
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<BrandType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands and categories from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch brands and categories (start with featured categories for better UX)
        const [brandsData, categoriesData] = await Promise.all([
          fetchBrands(),
          fetchFeaturedCategories()
        ]);
        
        setBrands(brandsData);
        setFilteredBrands(brandsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load brands. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter brands based on search query and selected category
  useEffect(() => {
    const filterData = async () => {
      try {
        setIsLoading(true);
        
        // If we have a search query or category filter, fetch filtered data
        if (searchQuery || selectedCategoryId) {
          const filteredData = await fetchBrands(searchQuery, selectedCategoryId || undefined);
          setFilteredBrands(filteredData);
        } else {
          // Otherwise, just use the full brand list
          setFilteredBrands(brands);
        }
      } catch (err) {
        console.error('Error filtering data:', err);
        // Don't show error for filtering, just use what we have
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the filter to prevent too many requests
    const debounceTimeout = setTimeout(() => {
      filterData();
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchQuery, selectedCategoryId]);

  const handleBrandSelect = (brand: BrandType) => {
    console.log('Selected brand:', brand);
    // Navigate back to home or to a card creation screen with the selected brand
    // router.push(...);
    router.back();
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderBrandItem = ({ item }: { item: BrandType }) => (
    <TouchableOpacity 
      style={styles.brandCard} 
      onPress={() => handleBrandSelect(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.logo_url }}
        style={styles.brandLogo}
        resizeMode="contain"
        defaultSource={require('@/assets/images/card-placeholder.png')}
      />
      <View style={styles.brandInfo}>
        <Text style={styles.brandName}>{item.name}</Text>
        <Text style={styles.brandSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryChip = ({ item }: { item: CategoryType }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.categoryChip,
        selectedCategoryId === item.id && styles.selectedCategoryChip,
        { borderColor: selectedCategoryId === item.id ? item.color : ColorPalette.style_03 }
      ]}
      onPress={() => {
        setSelectedCategoryId(
          selectedCategoryId === item.id ? null : item.id
        );
      }}
    >
      <Text 
        style={[
          styles.categoryChipText,
          selectedCategoryId === item.id && [
            styles.selectedCategoryChipText,
            { color: '#FFFFFF' }
          ]
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyList = () => {
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={async () => {
              try {
                setIsLoading(true);
                setError(null);
                const [brandsData, categoriesData] = await Promise.all([
                  fetchBrands(),
                  fetchFeaturedCategories()
                ]);
                
                setBrands(brandsData);
                setFilteredBrands(brandsData);
                setCategories(categoriesData);
              } catch (err) {
                console.error('Error retrying data load:', err);
                setError('Failed to load brands. Please try again.');
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No brands found</Text>
      </View>
    );
  };

  const renderEmptyCategories = () => {
    if (isLoading) return null;
    
    return (
      <Text style={styles.emptyCategoriesText}>No categories available</Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Custom header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Image 
            source={require('@/assets/images/rightarrow.png')} 
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add a Brand Card</Text>
        <View style={styles.headerRight} />
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search brands..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      
      {/* Categories horizontal scroll */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          ListEmptyComponent={renderEmptyCategories}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ColorPalette.style_07} />
          <Text style={styles.loadingText}>Loading brands...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBrands}
          renderItem={renderBrandItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.brandsList}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          windowSize={10}
          removeClippedSubviews={true}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.style_03,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    transform: [{ rotate: '180deg' }], // Rotate right arrow to make it a left arrow
  },
  headerTitle: {
    ...Fonts.title,
    fontSize: 18,
    color: ColorPalette.textPrimary,
  },
  headerRight: {
    width: 40, // To balance the header
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.style_03,
  },
  searchInput: {
    height: 44,
    backgroundColor: ColorPalette.style_04,
    borderRadius: 22,
    paddingHorizontal: 16,
    ...Fonts.regular,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.style_03,
  },
  categoriesList: {
    paddingHorizontal: 16,
    minWidth: '100%', // Ensure it fills the width when empty
  },
  emptyCategoriesText: {
    ...Fonts.regular,
    color: ColorPalette.textSecondary,
    padding: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: ColorPalette.style_04,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: ColorPalette.style_03,
  },
  selectedCategoryChip: {
    backgroundColor: ColorPalette.style_07,
    borderColor: ColorPalette.style_07,
  },
  categoryChipText: {
    ...Fonts.regular,
    fontSize: 14,
    color: ColorPalette.textPrimary,
  },
  selectedCategoryChipText: {
    color: '#FFFFFF',
  },
  brandsList: {
    padding: 16,
    paddingBottom: 30, // Less bottom padding now that we don't have the nav
    flexGrow: 1, // Allow content to grow if needed
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  brandLogo: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: ColorPalette.style_04,
  },
  brandInfo: {
    flex: 1,
    marginLeft: 12,
  },
  brandName: {
    ...Fonts.title,
    fontSize: 16,
    marginBottom: 4,
  },
  brandSubtitle: {
    ...Fonts.regular,
    fontSize: 14,
    color: ColorPalette.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Fonts.regular,
    marginTop: 12,
    color: ColorPalette.textSecondary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    ...Fonts.regular,
    color: ColorPalette.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    ...Fonts.regular,
    color: ColorPalette.style_05,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: ColorPalette.style_07,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  retryButtonText: {
    ...Fonts.regular,
    color: '#FFFFFF',
    fontSize: 14,
  }
}); 