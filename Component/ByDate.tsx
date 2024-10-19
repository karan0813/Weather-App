import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define the interface for the weather data item
interface WeatherDataItem {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
}

const ByDate: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [specificWeather, setSpecificWeather] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const fetchWeatherByDate = async () => {
    if (!selectedDate || !city) return;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`,
      );
      const specificWeatherData = response.data.list.find(
        (item: WeatherDataItem) =>
          new Date(item.dt * 1000).toDateString() ===
          new Date(selectedDate).toDateString(),
      );

      console.log(process.env.API_KEY);

      setSpecificWeather(
        specificWeatherData
          ? {
              main: specificWeatherData.main,
              weather: specificWeatherData.weather,
              list: [], // Provide an empty list to satisfy the WeatherData structure
            }
          : null,
      );
    } catch (err) {
      setError('Error fetching weather for the selected date');
      setSpecificWeather(null);
    }
  };

  const handleDateChange = (event: any, date: Date | undefined) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weather Forecast</Text>

      {/* Search Input for City */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
          placeholderTextColor="#A9A9A9"
        />
      </View>

      {/* Date Picker Button */}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowPicker(true)}>
        <Text style={styles.buttonText}>
          {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Check Weather Button */}
      <TouchableOpacity style={styles.button} onPress={fetchWeatherByDate}>
        <Text style={styles.buttonText}>Check Weather</Text>
      </TouchableOpacity>

      {specificWeather && (
        <View style={styles.weatherContainer}>
          <Text
            style={
              styles.weatherTitle
            }>{`Weather on ${selectedDate?.toLocaleDateString()}`}</Text>
          <Image
            style={styles.weatherIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${specificWeather.weather[0].icon}@2x.png`,
            }}
          />
          <Text
            style={styles.temperature}>{`${specificWeather.main.temp}°C`}</Text>
          <Text style={styles.description}>
            {specificWeather.weather[0].description}
          </Text>
          <Text
            style={
              styles.humidity
            }>{`Humidity: ${specificWeather.main.humidity}%`}</Text>
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  searchContainer: {
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  datePickerButton: {
    height: 50,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weatherContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: 'center',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  humidity: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ByDate;
