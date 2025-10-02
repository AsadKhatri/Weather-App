import { ThemedText } from '@/components/themed-text';
import { useWeather } from '@/context/WeatherContext';
import { FavoriteCity } from '@/types/weather';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const { 
    favorites, 
    addToFavorites, 
    removeFromFavorites, 
    fetchWeatherByCity,
    loading
  } = useWeather();
  
  const [refreshing, setRefreshing] = useState(false);

  const handleCityPress = async (city: FavoriteCity) => {
    try {
      await fetchWeatherByCity(city.name);
    } catch (error) {
      console.error('Error fetching weather for favorite city:', error);
      Alert.alert('Error', 'Failed to load weather for this city');
    }
  };

  const handleRemoveFavorite = (city: FavoriteCity) => {
    Alert.alert(
      'Remove Favorite',
      `Are you sure you want to remove ${city.name} from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFromFavorites(city.id)
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteCity }) => (
    <TouchableOpacity
      style={[styles.favoriteItem, { backgroundColor: '#ffffff' }]}
      onPress={() => handleCityPress(item)}
    >
      <View style={styles.favoriteContent}>
        <View style={styles.cityInfo}>
          <ThemedText style={styles.cityName}>{item.name}</ThemedText>
          <ThemedText style={styles.countryName}>{item.country}</ThemedText>
        </View>
        <View style={styles.favoriteActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCityPress(item)}
          >
            <ThemedText style={styles.actionButtonText}>View</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => handleRemoveFavorite(item)}
          >
            <ThemedText style={[styles.actionButtonText, styles.removeButtonText]}>Remove</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyTitle}>No Favorites Yet</ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        Add cities to your favorites by searching for them and tapping the heart icon
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Favorites</ThemedText>
        <ThemedText style={styles.subtitle}>
          {favorites.length} {favorites.length === 1 ? 'city' : 'cities'} saved
        </ThemedText>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1a1a1a"
            />
          }
        />
      ) : (
        renderEmptyState()
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ThemedText style={styles.loadingText}>Loading weather data...</ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  favoriteItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteContent: {
    padding: 16,
  },
  cityInfo: {
    marginBottom: 12,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  countryName: {
    fontSize: 14,
    opacity: 0.7,
  },
  favoriteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButtonText: {
    color: '#FF3B30',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
  },
});
