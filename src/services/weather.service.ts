import { injectable, inject } from 'tsyringe';
import { IWeatherService } from './interfaces/weather-service.interface';
import { WeatherData, Location } from '../types/weather';
import { ITomorrowApiClient } from '../api/interfaces/api-clients.interface';
import { Tokens } from '../app-registry/tokens';

@injectable()
export class WeatherService implements IWeatherService {
  constructor(
    @inject(Tokens.TomorrowApiClient) private tomorrowApiClient: ITomorrowApiClient
  ) {}

  async getCurrentWeather(location: Location | string, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherData> {
    // API client now handles all errors through the error handler system
    return this.tomorrowApiClient.getCurrentWeather(location, units);
  }
} 