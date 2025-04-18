# Weather Alert System Backend

A robust and scalable backend service for the Weather Alert System application that provides real-time weather monitoring and customizable alerts based on specific weather parameters.

## Features

- Real-time weather data integration with Tomorrow.io API
- RESTful API endpoints for weather alerts management
- Automated alert evaluation every 5 minutes
- Email notifications for triggered alerts
- Mock weather service for development and testing
- AI-powered weather analysis using OpenAI and Hugging Face

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express
- **Database**: MongoDB with Mongoose
- **Validation**: Zod for schema validation
- **Dependency Injection**: TSyringe
- **Scheduling**: node-cron
- **Notifications**: Nodemailer
- **Logging**: Winston
- **AI Integration**: OpenAI and Hugging Face APIs

## Project Structure

```
src/
├── api/              # API-related functionality
├── app-registry/     # Application registry setup
├── config/           # Configuration settings
├── controllers/      # Request handlers
├── data-access-layer/# Database access logic
├── ErrorHandling/    # Error handling utilities
├── middleware/       # Express middleware
├── notifications/    # Email notification system
├── routes/           # API route definitions
├── schedule-tasks/   # Scheduled jobs
├── services/         # Business logic
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── validations/      # Input validation schemas
├── app.ts            # Express application setup
└── index.ts          # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or Atlas URI)
- Tomorrow.io API key

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/weather-alert-system
MONGO_USERNAME=your_mongodb_username
MONGO_PASSWORD=your_mongodb_password

# Weather API
TOMORROW_API_KEY=your_api_key
TOMORROW_API_URL=https://api.tomorrow.io/v4
USE_MOCK_WEATHER=false

# Email Configuration
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# AI Services (Optional)
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o
HUGGINGFACE_SPACE_URL=your_huggingface_url
USE_FREE_MODEL=false
```

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start

# For development with auto-reload
npm run dev
```

## API Endpoints

### Weather

- `GET /api/weather?city=[CITY_NAME]` - Get current weather for a city
- `GET /api/weather?lat=[LATITUDE]&lon=[LONGITUDE]` - Get current weather for coordinates

### Alerts

- `POST /api/alerts` - Create a new alert
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/status` - Get current status of all alerts
- `GET /api/alerts/:id` - Get a specific alert
- `PUT /api/alerts/:id` - Update an alert
- `DELETE /api/alerts/:id` - Delete an alert 

## Mock Weather Service

For development and testing, you can enable the mock weather service:

1. Set `USE_MOCK_WEATHER=true` in your .env file
2. The mock service provides randomized but realistic weather data
3. Helpful logs will indicate when mock data is being used

## Logging

The application uses Winston for structured logging. Logs are stored in the `logs/` directory:

- `combined.log` - Contains all log levels
- `error.log` - Contains only error logs
