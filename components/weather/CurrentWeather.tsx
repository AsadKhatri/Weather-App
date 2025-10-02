import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { WeatherAPI } from '../../services/weatherApi';
import { WeatherData } from '../../types/weather';

interface CurrentWeatherProps {
  weatherData: WeatherData;
}

const { width } = Dimensions.get('window');

export function CurrentWeather({ weatherData }: CurrentWeatherProps) {
  const weatherAPI = WeatherAPI.getInstance();
  const current = weatherData.current;
  const weather = current.weather[0];

  const styles = createStyles();

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Text style={styles.locationName}>{weatherData.location.name}</Text>
        <Text style={styles.countryName}>{weatherData.location.country}</Text>
      </View>

      <View style={styles.weatherContainer}>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>
            {weatherAPI.formatTemperature(current.temp)}
          </Text>
          <Text style={styles.weatherDescription}>
            {weather.description}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Text style={styles.weatherIcon}>
            {weatherAPI.getWeatherIcon(weather.icon)}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Feels like</Text>
            <Text style={styles.detailValue}>
              {weatherAPI.formatTemperature(current.feels_like)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>
              {weatherAPI.formatHumidity(current.humidity)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Wind</Text>
            <Text style={styles.detailValue}>
              {weatherAPI.formatWindSpeed(current.wind_speed)} {weatherAPI.getWindDirection(current.wind_deg)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Pressure</Text>
            <Text style={styles.detailValue}>
              {weatherAPI.formatPressure(current.pressure)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Visibility</Text>
            <Text style={styles.detailValue}>
              {Math.round(current.visibility / 1000)} km
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>UV Index</Text>
            <Text style={styles.detailValue}>
              {Math.round(current.temp_max - current.temp_min)}° range
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = () => StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  countryName: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  temperatureContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 64,
    fontWeight: '300',
    color: '#1a1a1a',
    lineHeight: 70,
  },
  weatherDescription: {
    fontSize: 18,
    color: '#666666',
    textTransform: 'capitalize',
    marginTop: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    fontSize: 80,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
});
