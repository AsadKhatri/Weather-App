# Weather App 🌤️

A simple and clean weather application built with React Native and Expo. Get current weather conditions and 7-day forecasts for your location or any city worldwide.

## Features ✨

### Core Features
- **📍 Geolocation**: Automatic location detection with permission handling
- **🌡️ Current Weather**: Real-time temperature, conditions, and detailed weather information
- **📅 7-Day Forecast**: Extended weather forecast with daily predictions
- **🔍 City Search**: Search and get weather for any city worldwide
- **❤️ Favorites**: Save your favorite cities for quick access

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Context API**: Global state management for weather data and user preferences
- **AsyncStorage**: Persistent storage for favorites
- **Responsive Design**: Optimized for all screen sizes
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Smooth loading indicators

## Screenshots 📱

The app includes two main screens:
1. **Weather Tab**: Current weather and forecast with integrated search functionality
2. **Favorites Tab**: Manage your saved favorite cities

## Installation & Setup 🚀

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd WeatherApp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Location Permissions
The app requires location permissions to work properly. Make sure to:

**For iOS:**
- Add location usage descriptions in `app.json`:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "This app needs access to location to show weather for your current location."
      }
    }
  }
}
```

**For Android:**
- Location permissions are automatically handled by Expo

### 4. Run the Application
```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

## Project Structure 📁

```
WeatherApp/
├── app/                          # App screens and navigation
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Weather home screen with search
│   │   └── favorites.tsx        # Favorites management screen
│   └── _layout.tsx              # Root layout with providers
├── components/                   # Reusable components
│   ├── weather/                 # Weather-specific components
│   │   ├── CurrentWeather.tsx   # Current weather display
│   │   ├── WeatherForecast.tsx  # 7-day forecast
│   │   ├── LoadingSpinner.tsx   # Loading states
│   │   ├── ErrorDisplay.tsx     # Error handling
│   │   └── FavoriteButton.tsx   # Add/remove favorites
│   └── themed-*.tsx             # Themed base components
├── context/                     # Global state management
│   └── WeatherContext.tsx       # Weather app context
├── services/                    # External services
│   ├── weatherApi.ts           # OpenWeatherMap API integration
│   └── locationService.ts      # Location and geocoding services
├── types/                       # TypeScript type definitions
│   └── weather.ts              # Weather-related types
└── config/                      # App constants and themes
    └── api.ts                  # API configuration
```

## API Configuration 🔧

### OpenWeatherMap API
The app uses the OpenWeatherMap API for weather data with the following endpoints:
- Current Weather: `GET /weather`
- 5-Day Forecast: `GET /forecast`
- Geocoding: `GET /weather` (for city search)

## Features Deep Dive 🔍

### Location Services
- **Permission Handling**: Graceful permission requests with user-friendly messages
- **Geolocation**: High-accuracy location detection
- **Reverse Geocoding**: Convert coordinates to city names
- **Error Handling**: Fallback options when location services fail

### Weather Data
- **Real-time Updates**: Current temperature, conditions, and atmospheric data
- **Detailed Information**: Humidity, wind speed, pressure, visibility
- **7-Day Forecast**: Extended predictions with precipitation probability
- **Weather Icons**: Emoji-based weather condition indicators

### User Experience
- **Favorites**: Save and manage favorite cities with AsyncStorage
- **Search**: Intelligent city search with geocoding
- **Error Recovery**: Retry mechanisms and helpful error messages
- **Clean UI**: Simple, intuitive interface


## Troubleshooting 🔧

### Common Issues

**1. Location Permission Denied**
- Check device location settings
- Ensure app has location permissions
- Try restarting the app

**2. Weather Data Not Loading**
- Check internet connection
- Verify API is accessible
- Check console for error messages

**3. Build Errors**
- Clear cache: `expo start -c`
- Delete node_modules and reinstall
- Check for TypeScript errors


## Development Notes 📝

### Assumptions Made
- Users have internet connectivity for weather data
- Location permissions are granted for optimal experience
- Device supports geolocation services

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Expo](https://expo.dev/) for the development platform
- [React Native](https://reactnative.dev/) for the mobile framework

---