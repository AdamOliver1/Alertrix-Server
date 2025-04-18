import { WeatherData, Location } from '../../types/weather';

export interface IWeatherService {
  getCurrentWeather(location: Location | string, units?: 'metric' | 'imperial'): Promise<WeatherData>;
} 