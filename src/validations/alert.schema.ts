import { z } from 'zod';
import { WeatherParameter } from '../types/weather';

// Location schema
export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  name: z.string().optional(),
});

// Validate weather parameter
const weatherParameterSchema = z.enum([
  'temperature',
  'temperatureApparent',
  'temperatureMin',
  'temperatureMax',
  'windSpeed',
  'windDirection',
  'humidity',
  'precipitationProbability',
  'precipitationType',
  'rainIntensity',
  'snowIntensity',
  'cloudCover',
  'visibility',
  'pressureSurfaceLevel',
  'uvIndex',
  'weatherCode',
] as const);

// Threshold condition schema
export const thresholdConditionSchema = z.object({
  parameter: weatherParameterSchema,
  operator: z.enum(['>', '<', '>=', '<=', '=', '!=']),
  value: z.number(),
});

// Alert creation schema
export const createAlertSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  emails: z.array(z.string().email('Invalid email address'))
    .max(5, 'Maximum of 5 email addresses allowed'),
  location: locationSchema,
  condition: thresholdConditionSchema,
});

// Schema for query parameters when getting weather
export const getWeatherQuerySchema = z.object({
  city: z.string().optional(),
  lat: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  lon: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  units: z.enum(['metric', 'imperial']).default('metric'),
}).refine(
  data => (data.city !== undefined) || (data.lat !== undefined && data.lon !== undefined),
  {
    message: 'Either city or both lat and lon must be provided',
  }
); 