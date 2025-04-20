import dotenv from 'dotenv';
import { z } from 'zod';
import { handleConfigError } from '../ErrorHandling/errorHandlers';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  MONGODB_URI: z.string(),
  TOMORROW_API_KEY: z.string(),
  TOMORROW_API_URL: z.string().default('https://api.tomorrow.io/v4'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  USE_MOCK_WEATHER: z.enum(['true', 'false']).optional().default('false'),
  // Email configuration
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  // OpenAI configuration
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().optional().default('gpt-4o'),
  // HuggingFace configuration
  HUGGINGFACE_TOKEN: z.string().optional(),
  HUGGINGFACE_SPACE_URL: z.string().optional(),
  // Model selection
  USE_FREE_MODEL: z.enum(['true', 'false']).optional().default('false'),
});

// Parse and validate environment variables
const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('❌ Invalid environment variables:', envVars.error.format());
  // Create a list of missing variables from the error
  const missingVars = Object.keys(envVars.error.format())
    .filter(key => key !== '_errors');
  
  throw handleConfigError('Environment validation failed', missingVars);
}

// Export the validated config
export const config = {
  port: parseInt(envVars.data.PORT, 10),
  mongodbUri: envVars.data.MONGODB_URI,
  tomorrowApi: {
    key: envVars.data.TOMORROW_API_KEY,
    url: envVars.data.TOMORROW_API_URL,
  },
  email: {
    smtpUser: envVars.data.SMTP_USER,
    smtpPass: envVars.data.SMTP_PASS,
    fromAddress: envVars.data.EMAIL_FROM || 'alerts@yourdomain.com',
  },
  openai: {
    apiKey: envVars.data.OPENAI_API_KEY,
    model: envVars.data.OPENAI_MODEL,
  },
  huggingface: {
    token: envVars.data.HUGGINGFACE_TOKEN,
    spaceUrl: envVars.data.HUGGINGFACE_SPACE_URL,
  },
  isDevelopment: envVars.data.NODE_ENV === 'development',
  isProduction: envVars.data.NODE_ENV === 'production',
  isTest: envVars.data.NODE_ENV === 'test',
  useMockWeather: envVars.data.USE_MOCK_WEATHER === 'true',
  useFreeModel: envVars.data.USE_FREE_MODEL === 'true',
}; 