import 'reflect-metadata';
import { container } from 'tsyringe';

// Import interfaces
import { IWeatherService } from '../services/interfaces/weather-service.interface';
import { IAlertService } from '../services/interfaces/alert.service.interface';

// Import implementations
import { WeatherService } from '../services/weather.service';
import { MockWeatherService } from '../services/mock-weather.service';
import { AlertService } from '../services/alert.service';

// Import controllers
import { WeatherController } from '../controllers/weather.controller';
import { AlertController } from '../controllers/alert.controller';

// Import configuration
import { config } from '../config';

// Import setup functions
import { setupNotifications } from './notifications';

// Import tokens
import { Tokens } from './tokens';
import { IEmailService } from '../services/interfaces/email.service.interface';
import { EmailService } from '../services/email.service';
import { AlertDataLayer } from '../data-access-layer/repositories/interfaces/AlertDataLayer';
import { AlertRepository } from '../data-access-layer/repositories/alert.repository';
import { IMessageCreator } from '../services/interfaces/message-creator.interface';
import { GPTMessageCreator } from '../services/message-creator/gpt-message-creator.service';
import { HuggingfaceMessageCreator } from '../services/message-creator/huggingface-message-creator.service';

// Import API clients
import { OpenAIClient } from '../api/openai-client';
import { HuggingFaceClient } from '../api/huggingface-client';
import { TomorrowApiClient } from '../api/tomorrow-api-client';

/**
 * Sets up the dependency injection container with all required services and controllers
 */
export function setupContainer() {
  // Determine which weather service to use
  const useMockWeatherService = config.useMockWeather;
  
  // Determine which message creator to use
  const useFreeModel = config.useFreeModel;

  // Register API clients as singletons
  container.registerSingleton(Tokens.OpenAIClient, OpenAIClient);
  container.registerSingleton(Tokens.HuggingFaceClient, HuggingFaceClient);
  container.registerSingleton(Tokens.TomorrowApiClient, TomorrowApiClient);

  // Register repositories
  container.register<AlertDataLayer>(Tokens.AlertRepository, { useClass: AlertRepository });

  // Register services
  if (useMockWeatherService) {
    console.log('📣 Using MockWeatherService - no external API calls will be made');
    container.register<IWeatherService>(Tokens.WeatherService, { useClass: MockWeatherService });
  } else {
    console.log('📣 Using real WeatherService - API calls will be made to Tomorrow.io');
    container.register<IWeatherService>(Tokens.WeatherService, { useClass: WeatherService });
  }
  container.register<IMessageCreator>(Tokens.MessageCreator, { useClass:useFreeModel ? HuggingfaceMessageCreator  : GPTMessageCreator});
  container.register<IAlertService>(Tokens.AlertService, { useClass: AlertService });
  container.register<IEmailService>(Tokens.EmailService, { useClass: EmailService });

  // Setup notification services
  setupNotifications();

  // Register controllers
  container.register(Tokens.WeatherController, { useClass: WeatherController });
  container.register(Tokens.AlertController, { useClass: AlertController });
}

// Initialize the container
setupContainer();

export { container }; 