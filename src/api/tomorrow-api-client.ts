import { injectable } from 'tsyringe';
import axios from 'axios';
import { WeatherData, TomorrowApiResponse, Location } from '../types/weather';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError } from '../ErrorHandling/AppError';
import { handleWeatherApiError } from '../ErrorHandling/errorHandlers';
import { ITomorrowApiClient } from './interfaces/api-clients.interface';

/**
 * Client for interacting with the Tomorrow.io API
 * Centralizes all Tomorrow.io API calls in the application
 */
@injectable()
export class TomorrowApiClient implements ITomorrowApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.tomorrowApi.key;
    this.baseUrl = config.tomorrowApi.url;
  }

  /**
   * Gets current weather data for a specific location
   * @param location The location to get weather data for
   * @param units The units to use (metric or imperial)
   * @returns Weather data object
   * @throws AppError if there's any issue with the API call
   */
  public async getCurrentWeather(
    location: Location | string, 
    units: 'metric' | 'imperial' = 'metric'
  ): Promise<WeatherData> {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        throw new Error('Weather API key not configured');
      }

      let locationParam: string;
      if (typeof location === 'string') {
        // Assume it's a city name
        locationParam = encodeURIComponent(location);
      } else {
        // Use lat,lon format
        locationParam = `${location.lat},${location.lon}`;
      }

      const url = `${this.baseUrl}/weather/realtime`;
      
      const response = await axios.get<TomorrowApiResponse>(url, {
        params: {
          apikey: this.apiKey,
          location: locationParam,
          units
        }
      });

      return this.transformWeatherData(response.data, units);
    } catch (error) {
      // Use specialized weather API error handler
      throw handleWeatherApiError(error, location, { units });
    }
  }

  /**
   * Transforms the API response into a WeatherData object
   */
  private transformWeatherData(apiResponse: TomorrowApiResponse, units: 'metric' | 'imperial'): WeatherData {
    const { values } = apiResponse.data;
    const { location } = apiResponse;

    return {
      temperature: Number(values.temperature),
      temperatureApparent: Number(values.temperatureApparent),
      windSpeed: Number(values.windSpeed),
      windDirection: Number(values.windDirection),
      humidity: Number(values.humidity),
      precipitationProbability: Number(values.precipitationProbability),
      precipitationType: Number(values.precipitationType),
      rainIntensity: Number(values.rainIntensity),
      snowIntensity: Number(values.snowIntensity),
      cloudCover: Number(values.cloudCover),
      visibility: Number(values.visibility),
      pressureSurfaceLevel: Number(values.pressureSurfaceLevel),
      uvIndex: Number(values.uvIndex),
      weatherCode: Number(values.weatherCode),
      location: {
        lat: location.lat,
        lon: location.lon,
        name: location.name,
      },
      units,
    };
  }
} 