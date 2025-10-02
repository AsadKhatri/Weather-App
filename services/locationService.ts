import * as Location from 'expo-location';
import { Location as LocationType } from '../types/weather';

export class LocationService {
  static async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<LocationType | null> {
    try {
      console.log('Getting current location...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log('Got coords:', location.coords.latitude, location.coords.longitude);

      // try to get city name from coordinates
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log('Geocode result:', reverseGeocode);

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const cityName = address.city || address.region || address.district || 'Current Location';
        const countryName = address.country || 'Unknown';
        
        console.log('Found city:', cityName, countryName);
        
        return {
          name: cityName,
          country: countryName,
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        };
      }

      console.log('No city data, using coords');
      return {
        name: 'Current Location',
        country: 'Unknown',
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  static async searchLocation(query: string): Promise<LocationType[]> {
    try {
      // using openweather geocoding api
      const API_KEY = '460f0eef75944641e731ea9b807a42b8';
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      
      const results = await response.json();
      
      return results.map((result: any) => ({
        name: result.name,
        country: result.country,
        lat: result.lat,
        lon: result.lon,
      }));
    } catch (error) {
      console.error('Error searching location:', error);
      // fallback to expo geocoding
      try {
        const geocodeResults = await Location.geocodeAsync(query);
        return geocodeResults.map((result, index) => ({
          name: `Location ${index + 1}`,
          country: 'Unknown',
          lat: result.latitude,
          lon: result.longitude,
        }));
      } catch (fallbackError) {
        console.error('Fallback geocoding also failed:', fallbackError);
        throw error;
      }
    }
  }

  static formatLocationName(location: LocationType): string {
    return `${location.name}, ${location.country}`;
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // distance in km
    return distance;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
