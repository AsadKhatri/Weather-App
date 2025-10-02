export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
  dt: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
    deg: number;
  };
  pop: number; // probability of precipitation
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastItem[];
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
}

export interface Location {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: number;
}

export interface WeatherContextType {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  currentLocation: Location | null;
  favorites: FavoriteCity[];
  fetchWeatherByLocation: (lat: number, lon: number) => Promise<void>;
  fetchWeatherByCity: (cityName: string) => Promise<void>;
  addToFavorites: (city: FavoriteCity) => void;
  removeFromFavorites: (cityId: string) => void;
  clearError: () => void;
}
