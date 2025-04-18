import { injectable, inject } from 'tsyringe';
import { IWeatherService } from './interfaces/weather-service.interface';
import { WeatherData, Location } from '../types/weather';
import { TomorrowApiClient } from '../api';
import { Tokens } from '../app-registry/tokens';

@injectable()
export class WeatherService implements IWeatherService {
  constructor(
    @inject(Tokens.TomorrowApiClient) private tomorrowApiClient: TomorrowApiClient
  ) {}

  async getCurrentWeather(location: Location | string, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherData> {
    // API client now handles all errors through the error handler system
    return this.tomorrowApiClient.getCurrentWeather(location, units);
  }
} 