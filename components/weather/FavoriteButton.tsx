import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useWeather } from '../../context/WeatherContext';
import { FavoriteCity, WeatherData } from '../../types/weather';
import { ThemedText } from '../themed-text';

interface FavoriteButtonProps {
  weatherData: WeatherData;
}

export function FavoriteButton({ weatherData }: FavoriteButtonProps) {
  const { favorites, addToFavorites, removeFromFavorites } = useWeather();
  
  const isFavorite = favorites.some(
    fav => fav.lat === weatherData.location.lat && fav.lon === weatherData.location.lon
  );

  const handleToggleFavorite = () => {
    if (isFavorite) {
      const favoriteToRemove = favorites.find(
        fav => fav.lat === weatherData.location.lat && fav.lon === weatherData.location.lon
      );
      if (favoriteToRemove) {
        removeFromFavorites(favoriteToRemove.id);
      }
    } else {
      const newFavorite: FavoriteCity = {
        id: `${weatherData.location.lat}-${weatherData.location.lon}-${Date.now()}`,
        name: weatherData.location.name,
        country: weatherData.location.country,
        lat: weatherData.location.lat,
        lon: weatherData.location.lon,
        addedAt: Date.now(),
      };
      addToFavorites(newFavorite);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleToggleFavorite}>
      <ThemedText style={styles.icon}>
        {isFavorite ? '❤️' : '🤍'}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  icon: {
    fontSize: 20,
  },
});
