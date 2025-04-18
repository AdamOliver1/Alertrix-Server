import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IWeatherService } from '../services/interfaces/weather-service.interface';
import { getWeatherQuerySchema } from '../validations/alert.schema';
import { Location } from '../types/weather';
import { AppError } from '../ErrorHandling/AppError';
import { Tokens } from '../app-registry/tokens';

@injectable()
export class WeatherController {
  constructor(@inject('IWeatherService') private weatherService: IWeatherService) {}

  getCurrentWeather = async (req: Request, res: Response): Promise<void> => {
    // Validate query parameters
    const queryResult = getWeatherQuerySchema.safeParse(req.query);
    
    if (!queryResult.success) {
      throw new AppError('Invalid weather query parameters', 400, 'Please check your query parameters and try again.');
    }
    
    const { city, lat, lon, units } = queryResult.data;
    
    let location: Location | string;
    
    if (city) {
      location = city;
    } else if (lat && lon) {
      location = { lat, lon };
    } else {
      throw new AppError('Missing location parameters', 400, 'Please provide either city or lat/lon coordinates.');
    }
    
    const weatherData = await this.weatherService.getCurrentWeather(location, units);
    res.json(weatherData);
  };
} 