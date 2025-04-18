/**
 * Injection tokens for dependency injection
 * This file centralizes all string tokens used in @inject decorators
 */
export const Tokens = {
  // Repositories
  AlertRepository: 'IAlertRepository',
  
  // Services
  WeatherService: 'IWeatherService',
  AlertService: 'IAlertService',
  EmailService: 'EmailService',
  AlertNotificationService: 'AlertNotificationService',
  MessageCreator: 'IMessageCreator',
  
  // API Clients
  OpenAIClient: 'OpenAIClient',
  HuggingFaceClient: 'HuggingFaceClient',
  TomorrowApiClient: 'TomorrowApiClient',
  
  // Controllers
  WeatherController: 'WeatherController',
  AlertController: 'AlertController',
} as const; 