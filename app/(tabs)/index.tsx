import { ThemedText } from '@/components/themed-text';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { ErrorDisplay } from '@/components/weather/ErrorDisplay';
import { FavoriteButton } from '@/components/weather/FavoriteButton';
import { LoadingSpinner } from '@/components/weather/LoadingSpinner';
import { WeatherForecast } from '@/components/weather/WeatherForecast';
import { useWeather } from '@/context/WeatherContext';
import { LocationService } from '@/services/locationService';
import { FavoriteCity, Location } from '@/types/weather';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { 
    weatherData, 
    loading, 
    error, 
    fetchWeatherByLocation, 
    fetchWeatherByCity,
    clearError,
    addToFavorites,
    favorites
  } = useWeather();
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      console.log('asking for location permission...');
      const hasPermission = await LocationService.requestLocationPermission();
      setLocationPermissionGranted(hasPermission);
      
      if (hasPermission) {
        console.log('permission ok, getting location...');
        const location = await LocationService.getCurrentLocation();
        if (location) {
          console.log('got location:', location.name, location.country);
          await fetchWeatherByLocation(location.lat, location.lon);
        } else {
          console.log('no location data, using karachi...');
          await fetchWeatherByCity('Karachi');
        }
      } else {
        console.log('permission denied, using karachi...');
        await fetchWeatherByCity('Karachi');
      }
    } catch (error) {
      console.error('location error:', error);
      // fallback to karachi
      try {
        await fetchWeatherByCity('Karachi');
      } catch (fallbackError) {
        console.log('karachi fetch failed:', fallbackError);
      }
      setLocationPermissionGranted(false);
    }
  };

  const handleRetry = () => {
    clearError();
    initializeLocation();
  };

  const handleRefresh = () => {
    if (weatherData) {
      fetchWeatherByLocation(weatherData.location.lat, weatherData.location.lon);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    setIsSearching(true);
    clearError();

    try {
      const results = await LocationService.searchLocation(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Failed to search for cities. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCitySelect = async (city: Location) => {
    try {
      await fetchWeatherByCity(city.name);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearch(false);
    } catch (error) {
      console.error('Error fetching weather for city:', error);
    }
  };

  const handleAddToFavorites = (city: Location) => {
    // check if already favorite
    let alreadyFavorite = false;
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].lat === city.lat && favorites[i].lon === city.lon) {
        alreadyFavorite = true;
        break;
      }
    }
    
    if (!alreadyFavorite) {
      let newFavorite: FavoriteCity = {
        id: city.lat + '-' + city.lon + '-' + Date.now(),
        name: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
        addedAt: Date.now(),
      };
      addToFavorites(newFavorite);
      Alert.alert('Success', city.name + ' added to favorites!');
    } else {
      Alert.alert('Already Added', city.name + ' is already in your favorites.');
    }
  };

  const renderSearchResult = ({ item }: { item: Location }) => {
    // check if favorite
    let isFavorite = false;
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].lat === item.lat && favorites[i].lon === item.lon) {
        isFavorite = true;
        break;
      }
    }

    return (
      <View style={styles.searchResultItem}>
        <TouchableOpacity
          style={styles.searchResultContent}
          onPress={() => handleCitySelect(item)}
        >
          <View style={styles.cityInfo}>
            <ThemedText style={styles.cityName}>{item.name}</ThemedText>
            <ThemedText style={styles.countryName}>{item.country}</ThemedText>
            <ThemedText style={styles.coordinates}>
              {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
            </ThemedText>
          </View>
          <ThemedText style={styles.selectIcon}>→</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleAddToFavorites(item)}
        >
          <ThemedText style={styles.favoriteIcon}>
            {isFavorite ? '❤️' : '🤍'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && !weatherData) {
    return <LoadingSpinner message="Getting your location and weather data..." />;
  }

  if (error && !weatherData) {
    return <ErrorDisplay error={error} onRetry={handleRetry} />;
  }

  if (!weatherData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorTitle}>Welcome to Weather App!</ThemedText>
          <ThemedText style={styles.errorMessage}>
            {locationPermissionGranted 
              ? 'Loading weather data...' 
              : 'Welcome! Use the Search tab to find weather for any city worldwide.'
            }
          </ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <ThemedText style={styles.retryButtonText}>
              {locationPermissionGranted ? 'Refresh' : 'Try Again'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Weather</ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton} onPress={() => setShowSearch(!showSearch)}>
            <ThemedText style={styles.searchButtonText}>🔍</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <ThemedText style={styles.refreshButtonText}>🔄</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search city..."
              placeholderTextColor="#666666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
                <ThemedText style={styles.clearButtonText}>✕</ThemedText>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={styles.searchSubmitButton}
            onPress={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            <ThemedText style={styles.searchSubmitButtonText}>
              {isSearching ? 'Searching...' : 'Search'}
            </ThemedText>
          </TouchableOpacity>

          {searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
              <ThemedText style={styles.searchResultsTitle}>
                Search Results ({searchResults.length})
              </ThemedText>
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item, index) => `${item.name}-${item.country}-${index}`}
                showsVerticalScrollIndicator={false}
                style={styles.searchResultsList}
              />
            </View>
          )}
        </View>
      )}

      <CurrentWeather weatherData={weatherData} />
      <View style={styles.favoriteContainer}>
        <FavoriteButton weatherData={weatherData} />
      </View>
      <WeatherForecast weatherData={weatherData} />

      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Updating weather..." />
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    padding: 8,
    marginRight: 8,
  },
  searchButtonText: {
    fontSize: 20,
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 20,
  },
  favoriteContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    opacity: 0.8,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    color: '#000000',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 18,
    opacity: 0.6,
  },
  searchSubmitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchSubmitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchResultsContainer: {
    marginTop: 20,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  searchResultsList: {
    maxHeight: 300,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  searchResultContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  countryName: {
    fontSize: 14,
    opacity: 0.7,
  },
  coordinates: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  selectIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 12,
  },
  favoriteIcon: {
    fontSize: 20,
  },
});