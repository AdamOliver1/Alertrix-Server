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
  
   // Notification Handlers
  EmailNotificationHandler: 'IEmailNotificationHandler',
  
  // API Clients
  OpenAIClient: 'IOpenAIClient',
  HuggingFaceClient: 'IHuggingFaceClient',
  TomorrowApiClient: 'ITomorrowApiClient',
  
  // Controllers
  WeatherController: 'WeatherController',
  AlertController: 'AlertController',
} as const; 