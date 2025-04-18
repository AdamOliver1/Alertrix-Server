import { injectable } from 'tsyringe';
import { IWeatherService } from './interfaces/weather-service.interface';
import { WeatherData, Location } from '../types/weather';

/**
 * A mock implementation of the weather service that returns randomized
 * weather data without making external API calls.
 */
@injectable()
export class MockWeatherService implements IWeatherService {
  constructor() {
    console.log('🌤️ Using MockWeatherService - no external API calls will be made');
  }

  async getCurrentWeather(location: Location | string, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherData> {
    // Extract location information
    let locationName: string;
    let lat: number;
    let lon: number;
    
    if (typeof location === 'string') {
      // City name
      locationName = location;
      // Generate random coordinates for the location
      lat = Math.random() * 180 - 90; // Between -90 and 90
      lon = Math.random() * 360 - 180; // Between -180 and 180
    } else {
      // Coordinates
      locationName = location.name || `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`;
      lat = location.lat;
      lon = location.lon;
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate random weather conditions based on location and units
    const isNorthernHemisphere = lat > 0;
    const currentMonth = new Date().getMonth(); // 0-11
    const isWinter = (isNorthernHemisphere && (currentMonth < 2 || currentMonth > 9)) || 
                  (!isNorthernHemisphere && (currentMonth >= 3 && currentMonth <= 8));
    
    // Temperature ranges
    let baseTemp: number;
    if (isWinter) {
      baseTemp = units === 'metric' ? 5 : 40; // Colder in winter
    } else {
      baseTemp = units === 'metric' ? 25 : 77; // Warmer in summer
    }
    
    // Add some randomness
    const temperature = baseTemp + (Math.random() * 10 - 5);
    const temperatureApparent = temperature + (Math.random() * 5 - 2);
    
    // Generate weather code (1000-8000 range)
    // 1000: clear, 1001: cloudy, 4000-4200: rain, 5000-5100: snow, 8000: thunderstorm
    const weatherCodes = [1000, 1100, 1101, 1102, 1001, 4000, 4001, 4200, 5000, 5001, 5100, 8000];
    const weatherCode = weatherCodes[Math.floor(Math.random() * weatherCodes.length)];
    
    // Precipitation based on weather code
    const isRainy = weatherCode >= 4000 && weatherCode < 5000;
    const isSnowy = weatherCode >= 5000 && weatherCode < 6000;
    const isStormy = weatherCode === 8000;
    
    const rainIntensity = isRainy || isStormy ? Math.random() * 30 : 0;
    const snowIntensity = isSnowy ? Math.random() * 5 : 0;
    
    // Generate other weather metrics
    const weatherData: WeatherData = {
      temperature: Number(temperature.toFixed(1)),
      temperatureApparent: Number(temperatureApparent.toFixed(1)),
      windSpeed: Number((Math.random() * 20).toFixed(1)),
      windDirection: Math.floor(Math.random() * 360),
      humidity: Math.floor(Math.random() * 100),
      precipitationProbability: isRainy || isSnowy || isStormy ? Math.floor(Math.random() * 100) : Math.floor(Math.random() * 30),
      precipitationType: isRainy ? 1 : isSnowy ? 2 : isStormy ? 3 : 0,
      rainIntensity,
      snowIntensity,
      cloudCover: Math.floor(Math.random() * 100),
      visibility: Number((Math.random() * 10).toFixed(1)),
      pressureSurfaceLevel: 1000 + Math.floor(Math.random() * 30),
      uvIndex: Math.floor(Math.random() * 11),
      weatherCode,
      location: {
        lat,
        lon,
        name: locationName
      },
      units
    };
    
    console.log(`📊 Mock weather data generated for ${locationName}:`, {
      temperature: weatherData.temperature,
      weatherCode: weatherData.weatherCode,
      units: weatherData.units
    });
    
    return weatherData;
  }
} 