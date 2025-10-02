import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { WeatherAPI } from '../services/weatherApi';
import { FavoriteCity, Location, WeatherContextType, WeatherData } from '../types/weather';

interface WeatherState {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  currentLocation: Location | null;
  favorites: FavoriteCity[];
}

type WeatherAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WEATHER_DATA'; payload: WeatherData | null }
  | { type: 'SET_CURRENT_LOCATION'; payload: Location | null }
  | { type: 'SET_FAVORITES'; payload: FavoriteCity[] }
  | { type: 'ADD_FAVORITE'; payload: FavoriteCity }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: WeatherState = {
  weatherData: null,
  loading: false,
  error: null,
  currentLocation: null,
  favorites: [],
};

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_WEATHER_DATA':
      return { ...state, weatherData: action.payload, loading: false, error: null };
    case 'SET_CURRENT_LOCATION':
      return { ...state, currentLocation: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'ADD_FAVORITE':
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter(fav => fav.id !== action.payload) };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const weatherAPI = WeatherAPI.getInstance();

  // Load saved data on app start
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save favorites changes
  useEffect(() => {
    saveFavorites(state.favorites);
  }, [state.favorites]);

  const loadSavedData = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('weather_favorites');

      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        dispatch({ type: 'SET_FAVORITES', payload: favorites });
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };


  const saveFavorites = async (favorites: FavoriteCity[]) => {
    try {
      await AsyncStorage.setItem('weather_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const fetchWeatherByLocation = async (lat: number, lon: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const weatherData = await weatherAPI.getWeatherData(lat, lon);
      dispatch({ type: 'SET_WEATHER_DATA', payload: weatherData });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const fetchWeatherByCity = async (cityName: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const weatherData = await weatherAPI.getWeatherByCity(cityName);
      dispatch({ type: 'SET_WEATHER_DATA', payload: weatherData });
      dispatch({ type: 'SET_CURRENT_LOCATION', payload: weatherData.location });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const addToFavorites = (city: FavoriteCity) => {
    const isAlreadyFavorite = state.favorites.some(fav => fav.id === city.id);
    if (!isAlreadyFavorite) {
      dispatch({ type: 'ADD_FAVORITE', payload: city });
    }
  };

  const removeFromFavorites = (cityId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: cityId });
  };


  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: WeatherContextType = {
    weatherData: state.weatherData,
    loading: state.loading,
    error: state.error,
    currentLocation: state.currentLocation,
    favorites: state.favorites,
    fetchWeatherByLocation,
    fetchWeatherByCity,
    addToFavorites,
    removeFromFavorites,
    clearError,
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
