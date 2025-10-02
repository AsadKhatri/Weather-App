import { apiBaseUrl, temperatureUnit, weatherApiKey } from '../config/api';
import { WeatherData } from '../types/weather';

export class WeatherAPI {
  private static instance: WeatherAPI;
  private apiKey: string;

  constructor(apiKey: string = weatherApiKey) {
    this.apiKey = apiKey;
  }

  static getInstance(apiKey?: string): WeatherAPI {
    if (!WeatherAPI.instance) {
      WeatherAPI.instance = new WeatherAPI(apiKey);
    }
    return WeatherAPI.instance;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    const url = new URL(`${apiBaseUrl}${endpoint}`);
    url.searchParams.append('appid', this.apiKey);
    url.searchParams.append('units', temperatureUnit);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Weather API request failed:', error);
      throw error;
    }
  }

  async getCurrentWeather(lat: number, lon: number): Promise<any> {
    return this.makeRequest('/weather', {
      lat: lat.toString(),
      lon: lon.toString(),
    });
  }

  async getForecast(lat: number, lon: number): Promise<any> {
    return this.makeRequest('/forecast', {
      lat: lat.toString(),
      lon: lon.toString(),
    });
  }

  async searchCity(cityName: string): Promise<any> {
    return this.makeRequest('/weather', {
      q: cityName,
    });
  }

  async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        this.getCurrentWeather(lat, lon),
        this.getForecast(lat, lon),
      ]);

      // convert api response to our format
      const weatherData: WeatherData = {
        current: {
          temp: currentResponse.main.temp,
          feels_like: currentResponse.main.feels_like,
          temp_min: currentResponse.main.temp_min,
          temp_max: currentResponse.main.temp_max,
          pressure: currentResponse.main.pressure,
          humidity: currentResponse.main.humidity,
          visibility: currentResponse.visibility,
          wind_speed: currentResponse.wind.speed,
          wind_deg: currentResponse.wind.deg,
          weather: currentResponse.weather,
          dt: currentResponse.dt,
          sunrise: currentResponse.sys.sunrise,
          sunset: currentResponse.sys.sunset,
        },
        forecast: this.processDailyForecast(forecastResponse.list),
        location: {
          name: currentResponse.name,
          country: currentResponse.sys.country,
          lat: currentResponse.coord.lat,
          lon: currentResponse.coord.lon,
        },
      };

      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw error;
    }
  }

  async getWeatherByCity(cityName: string): Promise<WeatherData> {
    try {
      const cityResponse = await this.searchCity(cityName);
      return this.getWeatherData(cityResponse.coord.lat, cityResponse.coord.lon);
    } catch (error) {
      console.error('Failed to fetch weather by city:', error);
      throw error;
    }
  }

  getWeatherIcon(iconCode: string): string {
    // weather icon mapping
    const iconMap: Record<string, string> = {
      '01d': '☀️', // clear sky day
      '01n': '🌙', // clear sky night
      '02d': '⛅', // few clouds day
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '03n': '☁️',
      '04d': '☁️', // broken clouds
      '04n': '☁️',
      '09d': '🌧️', // shower rain
      '09n': '🌧️',
      '10d': '🌦️', // rain day
      '10n': '🌧️', // rain night
      '11d': '⛈️', // thunderstorm
      '11n': '⛈️',
      '13d': '❄️', // snow
      '13n': '❄️',
      '50d': '🌫️', // mist
      '50n': '🌫️',
    };
    
    return iconMap[iconCode] || '🌤️';
  }

  formatTemperature(temp: number): string {
    return `${Math.round(temp)}°C`;
  }

  formatWindSpeed(speed: number): string {
    return `${Math.round(speed * 3.6)} km/h`; // m/s to km/h
  }

  formatHumidity(humidity: number): string {
    return `${humidity}%`;
  }

  formatPressure(pressure: number): string {
    return `${pressure} hPa`;
  }

  getWindDirection(deg: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  }

  private processDailyForecast(forecastList: any[]): any[] {
    const dailyData: { [key: string]: any } = {};
    
    // group by day
    forecastList.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          dt: item.dt,
          main: {
            temp: item.main.temp,
            temp_min: item.main.temp_min,
            temp_max: item.main.temp_max,
            humidity: item.main.humidity,
          },
          weather: item.weather,
          wind: {
            speed: item.wind.speed,
            deg: item.wind.deg,
          },
          pop: item.pop,
          items: [item]
        };
      } else {
        // update min/max temps
        dailyData[dayKey].main.temp_min = Math.min(dailyData[dayKey].main.temp_min, item.main.temp_min);
        dailyData[dayKey].main.temp_max = Math.max(dailyData[dayKey].main.temp_max, item.main.temp_max);
        dailyData[dayKey].main.humidity = item.main.humidity; // latest humidity
        dailyData[dayKey].wind = item.wind; // latest wind
        dailyData[dayKey].pop = Math.max(dailyData[dayKey].pop, item.pop); // max precipitation
        dailyData[dayKey].items.push(item);
      }
    });
    
    // return first 7 days
    return Object.values(dailyData).slice(0, 7);
  }
}
