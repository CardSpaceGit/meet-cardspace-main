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
import { CardAddModal } from '@/components/CardAddModal';

export default function AddBrandMenuScreen() {
  const router = useRouter();
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<BrandType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<BrandType | null>(null);

  // Fetch brands and categories from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch brands and categories (start with featured categories for better UX)
        const [brandsData, categoriesData] = await Promise.all([
          fetchBrands(), // Fetch all brands without filters
          fetchFeaturedCategories()
        ]);
        
        setBrands(brandsData);
        setFilteredBrands(brandsData); // Explicitly set filtered brands to all brands initially
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
        setFilteredBrands(brands); // Ensure we still show all brands on error
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
  }, [searchQuery, selectedCategoryId, brands]); // Add brands as a dependency

  const handleBrandSelect = (brand: BrandType) => {
    setSelectedBrand(brand);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleScanBarcode = () => {
    // Will implement barcode scanning in a future update
    Alert.alert('Scan Barcode', 'Barcode scanning will be available in a future update.');
    setModalVisible(false);
  };

  const handleManualEntry = () => {
    // Will implement manual card entry in a future update
    Alert.alert('Manual Entry', 'Manual card entry will be available in a future update.');
    setModalVisible(false);
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
        source={{ uri: item.card_url }}
        style={styles.brandImage}
        resizeMode="contain"
        defaultSource={require('@/assets/images/card-placeholder.png')}
      />
      <View style={styles.brandInfo}>
        <Text style={styles.brandName}>{item.name}</Text>
        <Text 
          style={styles.brandSubtitle}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.subtitle}
        </Text>
      </View>
      <Image 
        source={require('@/assets/images/right-info-arrow.png')}
        style={styles.rightArrow}
        resizeMode="contain"
      />
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
                // Reset filters when retrying to ensure user sees all brands
                setSearchQuery('');
                setSelectedCategoryId(null);
                
                const [brandsData, categoriesData] = await Promise.all([
                  fetchBrands(), // Fetch all brands without filters
                  fetchFeaturedCategories()
                ]);
                
                setBrands(brandsData);
                setFilteredBrands(brandsData); // Explicitly set filtered brands to all brands initially
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
            source={require('@/assets/images/back.png')} 
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
          ListHeaderComponent={() => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                !selectedCategoryId && styles.selectedCategoryChip,
                { borderColor: !selectedCategoryId ? ColorPalette.style_07 : ColorPalette.style_03 }
              ]}
              onPress={() => setSelectedCategoryId(null)}
            >
              <Text 
                style={[
                  styles.categoryChipText,
                  !selectedCategoryId && [
                    styles.selectedCategoryChipText,
                    { color: '#FFFFFF' }
                  ]
                ]}
              >
                All Brands
              </Text>
            </TouchableOpacity>
          )}
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

      {/* Card Add Modal */}
      <CardAddModal 
        isVisible={modalVisible}
        onClose={handleModalClose}
        brand={selectedBrand}
        onScanPress={handleScanBarcode}
        onManualPress={handleManualEntry}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.white,
    paddingTop: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.style_03,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 32,
    height: 32,
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
    height: 48,
    backgroundColor: ColorPalette.style_04,
    borderRadius: 24,
    paddingHorizontal: 16,
    ...Fonts.regular,
    fontSize: 16,
    borderWidth: 1,
    borderColor: ColorPalette.style_03,
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
    padding: 2,
    flexGrow: 1, // Allow content to grow if needed
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomColor: ColorPalette.style_03,
    borderBottomWidth: 1,
  },
  brandImage: {
    width: 120,
    height: 56,
    borderRadius: 12,
    backgroundColor: ColorPalette.white,
  },
  brandInfo: {
    flex: 1,
    marginLeft: 0,
    marginRight: 8,
  },
  brandName: {
    ...Fonts.title,
    fontSize: 16,
    marginBottom: 4,
    color: ColorPalette.textPrimary,
  },
  brandSubtitle: {
    ...Fonts.regular,
    fontSize: 14,
    color: ColorPalette.textSecondary,
  },
  rightArrow: {
    width: 24,
    height: 24,
    marginLeft: 8,
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