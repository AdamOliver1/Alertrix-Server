export interface WeatherData {
  temperature: number;
  temperatureApparent: number;
  temperatureMin?: number;
  temperatureMax?: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitationProbability: number;
  precipitationType: number;
  rainIntensity: number;
  snowIntensity: number;
  cloudCover: number;
  visibility: number;
  pressureSurfaceLevel: number;
  uvIndex: number;
  weatherCode: number;
  location: {
    lat: number;
    lon: number;
    name?: string;
  };
  units: 'metric' | 'imperial';
}

export interface Location {
  lat: number;
  lon: number;
  name?: string;
}

export type WeatherParameter = keyof Omit<WeatherData, 'location' | 'units'>;

export type ThresholdOperator = '>' | '<' | '>=' | '<=' | '=' | '!=';

export interface ThresholdCondition {
  parameter: WeatherParameter;
  operator: ThresholdOperator;
  value: number;
}

export interface TomorrowApiResponse {
  data: {
    time: string;
    values: Record<string, number | string>;
  };
  location: {
    lat: number;
    lon: number;
    name?: string;
  };
} 