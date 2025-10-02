import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WeatherAPI } from '../../services/weatherApi';
import { WeatherData } from '../../types/weather';

interface WeatherForecastProps {
  weatherData: WeatherData;
}

const { width } = Dimensions.get('window');

export function WeatherForecast({ weatherData }: WeatherForecastProps) {
  const weatherAPI = WeatherAPI.getInstance();
  const styles = createStyles();

  const formatDay = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>7-Day Forecast</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {weatherData.forecast.map((day, index) => {
          const weather = day.weather[0];
          return (
            <View key={index} style={styles.forecastCard}>
              <Text style={styles.dayText}>{formatDay(day.dt)}</Text>
              <Text style={styles.timeText}>{formatTime(day.dt)}</Text>
              
              <View style={styles.iconContainer}>
                <Text style={styles.weatherIcon}>
                  {weatherAPI.getWeatherIcon(weather.icon)}
                </Text>
              </View>

              <Text style={styles.temperature}>
                {weatherAPI.formatTemperature(day.main.temp)}
              </Text>

              <View style={styles.tempRange}>
                <Text style={styles.tempHigh}>
                  {weatherAPI.formatTemperature(day.main.temp_max)}
                </Text>
                <Text style={styles.tempSeparator}>/</Text>
                <Text style={styles.tempLow}>
                  {weatherAPI.formatTemperature(day.main.temp_min)}
                </Text>
              </View>

              <Text style={styles.description}>
                {weather.description}
              </Text>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Humidity</Text>
                  <Text style={styles.detailValue}>
                    {weatherAPI.formatHumidity(day.main.humidity)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Wind</Text>
                  <Text style={styles.detailValue}>
                    {weatherAPI.formatWindSpeed(day.wind.speed)}
                  </Text>
                </View>
              </View>

              {day.pop > 0 && (
                <View style={styles.precipitationContainer}>
                  <Text style={styles.precipitationLabel}>Precipitation</Text>
                  <Text style={styles.precipitationValue}>
                    {Math.round(day.pop * 100)}%
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = () => StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  scrollContainer: {
    paddingRight: 20,
  },
  forecastCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: width * 0.35,
    alignItems: 'center',
    minHeight: 280,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  iconContainer: {
    marginBottom: 12,
  },
  weatherIcon: {
    fontSize: 40,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  tempRange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tempHigh: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  tempSeparator: {
    fontSize: 14,
    color: '#666666',
    marginHorizontal: 4,
  },
  tempLow: {
    fontSize: 14,
    color: '#666666',
  },
  description: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  precipitationContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  precipitationLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  precipitationValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A90E2',
  },
});
