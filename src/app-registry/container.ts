import 'reflect-metadata';
import { container } from 'tsyringe';

// Import interfaces
import { IWeatherService } from '../services/interfaces/weather-service.interface';
import { IAlertService } from '../services/interfaces/alert.service.interface';
import { IEmailService } from '../services/interfaces/email.service.interface';
import { IMessageCreator } from '../services/interfaces/message-creator.interface';
import { IAlertRepository } from '../data-access-layer/repositories/interfaces/alert.repository.interface';
import { ITomorrowApiClient, IOpenAIClient, IHuggingFaceClient } from '../api/interfaces/api-clients.interface';
import { IEmailNotificationHandler } from '../notifications/handlers/interfaces/notification-handler.interface';

// Import implementations
import { WeatherService } from '../services/weather.service';
import { MockWeatherService } from '../services/mock-weather.service';
import { AlertService } from '../services/alert.service';
import { EmailService } from '../services/email.service';
import { AlertRepository } from '../data-access-layer/repositories/alert.repository';
import { GPTMessageCreator } from '../services/message-creator/gpt-message-creator.service';
import { HuggingfaceMessageCreator } from '../services/message-creator/huggingface-message-creator.service';
import { EmailHandler } from '../notifications/handlers/EmailHandler';

// Import controllers
import { WeatherController } from '../controllers/weather.controller';
import { AlertController } from '../controllers/alert.controller';

// Import API clients
import { OpenAIClient } from '../api/openai-client';
import { HuggingFaceClient } from '../api/huggingface-client';
import { TomorrowApiClient } from '../api/tomorrow-api-client';

// Import configuration
import { config } from '../config';

// Import setup functions
import { setupNotifications } from './notifications';

// Import tokens
import { Tokens } from './tokens';

/**
 * Sets up the dependency injection container with all required services and controllers
 */
export function setupContainer() {
  // Determine which weather service to use
  const useMockWeatherService = config.useMockWeather;
  
  // Determine which message creator to use
  const useFreeModel = config.useFreeModel;

  // Register API clients as singletons
  container.registerSingleton<IOpenAIClient>(Tokens.OpenAIClient, OpenAIClient);
  container.registerSingleton<IHuggingFaceClient>(Tokens.HuggingFaceClient, HuggingFaceClient);
  container.registerSingleton<ITomorrowApiClient>(Tokens.TomorrowApiClient, TomorrowApiClient);

  // Register repositories
  container.register<IAlertRepository>(Tokens.AlertRepository, { useClass: AlertRepository });

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
  
  // Register notification handlers
  container.register<IEmailNotificationHandler>(Tokens.EmailNotificationHandler, { useClass: EmailHandler });

  // Setup notification services
  setupNotifications();

  // Register controllers
  container.register(Tokens.WeatherController, { useClass: WeatherController });
  container.register(Tokens.AlertController, { useClass: AlertController });
}

// Initialize the container
setupContainer();

export { container }; 