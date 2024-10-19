// App.tsx
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedBackground from './AnimatedBackground';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
}

const WeatherHome: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');

  const [tomorrowWeather, setTomorrowWeather] = useState<WeatherData | null>(
    null,
  );
  const [dayAfterTomorrowWeather, setDayAfterTomorrowWeather] =
    useState<WeatherData | null>(null);
  const iconAnimation = useRef(new Animated.Value(1)).current;

  const fetchWeather = async () => {
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`,
      );
      setWeather(response.data);
      setError('');

      // Fetch forecast data for yesterday and tomorrow
      const forecastResponse = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`,
      );

      // Get yesterday's and tomorrow's data
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      console.log(process.env.API_KEY);

      const tomorrowData = forecastResponse.data.list.find(
        item =>
          new Date(item.dt * 1000).toDateString() === tomorrow.toDateString(),
      );

      // Remove yesterday's weather data
      // setYesterdayWeather(yesterdayData ? { ... } : null); // This line is removed
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2); // Set to day after tomorrow

      const dayAfterTomorrowData = forecastResponse.data.list.find(
        item =>
          new Date(item.dt * 1000).toDateString() ===
          dayAfterTomorrow.toDateString(),
      );

      setTomorrowWeather(
        tomorrowData
          ? {
              main: tomorrowData.main,
              weather: tomorrowData.weather,
              list: [], // Provide an empty list to satisfy the WeatherData structure
            }
          : null,
      );
      setDayAfterTomorrowWeather(
        dayAfterTomorrowData
          ? {
              main: dayAfterTomorrowData.main,
              weather: dayAfterTomorrowData.weather,
              list: [], // Provide an empty list to satisfy the WeatherData structure
            }
          : null,
      );
    } catch (err) {
      setError('City not found');
      setWeather(null);
      setTomorrowWeather(null);
      setDayAfterTomorrowWeather(null);
    }
  };

  const animateIcon = () => {
    iconAnimation.setValue(1);
    Animated.timing(iconAnimation, {
      toValue: 1.5, // Scale up
      duration: 300,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(iconAnimation, {
        toValue: 1, // Scale back down
        duration: 300,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <AnimatedBackground />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Weather App</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            value={city}
            onChangeText={setCity}
            placeholderTextColor="#A9A9A9"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              fetchWeather();
              animateIcon();
            }}>
            <Animated.View style={{transform: [{scale: iconAnimation}]}}>
              <Ionicons name="search" size={24} color="white" />
            </Animated.View>
          </TouchableOpacity>
        </View>
        {weather && (
          <>
            <View style={styles.weatherContainer}>
              <Text style={styles.weatherTitle}>{`Weather in ${city}`}</Text>
              <Image
                style={styles.weatherIcon}
                source={{
                  uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                }}
              />
              <Text style={styles.temperature}>{`${weather.main.temp}°C`}</Text>
              <Text style={styles.description}>
                {weather.weather[0].description}
              </Text>
              <Text
                style={
                  styles.humidity
                }>{`Humidity: ${weather.main.humidity}%`}</Text>
            </View>

            {/* Tomorrow's Weather Card */}
            {tomorrowWeather && (
              <View style={styles.weatherContainer}>
                <Text style={styles.weatherTitle}>Tomorrow's Weather</Text>
                <Image
                  style={styles.weatherIcon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${tomorrowWeather.weather[0].icon}@2x.png`,
                  }}
                />
                <Text
                  style={
                    styles.temperature
                  }>{`${tomorrowWeather.main.temp}°C`}</Text>
                <Text style={styles.description}>
                  {tomorrowWeather.weather[0].description}
                </Text>
                <Text
                  style={
                    styles.humidity
                  }>{`Humidity: ${tomorrowWeather.main.humidity}%`}</Text>
              </View>
            )}
            {/* Day After Tomorrow's Weather Card */}
            {dayAfterTomorrowWeather && (
              <View style={styles.weatherContainer}>
                <Text style={styles.weatherTitle}>
                  Day After Tomorrow's Weather
                </Text>
                <Image
                  style={styles.weatherIcon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${dayAfterTomorrowWeather.weather[0].icon}@2x.png`,
                  }}
                />
                <Text
                  style={
                    styles.temperature
                  }>{`${dayAfterTomorrowWeather.main.temp}°C`}</Text>
                <Text style={styles.description}>
                  {dayAfterTomorrowWeather.weather[0].description}
                </Text>
                <Text
                  style={
                    styles.humidity
                  }>{`Humidity: ${dayAfterTomorrowWeather.main.humidity}%`}</Text>
              </View>
            )}
          </>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 18,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  weatherContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#E0F7FA', // Card color
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  weatherTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6347',
  },
  description: {
    fontSize: 20,
    color: '#555',
    marginBottom: 10,
  },
  humidity: {
    fontSize: 18,
    color: '#777',
  },
  errorText: {
    marginTop: 12,
    color: 'red',
    textAlign: 'center',
  },
});

export default WeatherHome;
