import { Router } from 'express';
import { container } from '../app-registry/container';
import { WeatherController } from '../controllers/weather.controller';
import { asyncHandler } from '../utils/asyncHandler';

const weatherRouter = Router();
const weatherController = container.resolve(WeatherController);

// GET /api/weather - Get current weather for a location
weatherRouter.get('/', asyncHandler(weatherController.getCurrentWeather));

export default weatherRouter; 