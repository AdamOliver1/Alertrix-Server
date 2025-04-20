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

export enum ThresholdOperator {
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',
  EQUAL = '=',
  NOT_EQUAL = '!='
}

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