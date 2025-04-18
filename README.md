# Weather Alert System Backend

This is the backend service for the Weather Alert System, a full-stack application that allows users to monitor real-time weather conditions and create alerts based on specific weather parameters.

## Features

- Integration with Tomorrow.io API for real-time weather data
- REST API for creating and managing weather alerts
- Scheduled job to evaluate alerts every 5 minutes
- MongoDB for data persistence

## Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB (using Mongoose)
- Zod for schema validation
- TSyringe for dependency injection

## Project Structure

- `src/config`: Configuration and environment variables
- `src/controllers`: Request handlers
- `src/di`: Dependency injection container
- `src/models`: MongoDB models
- `src/repositories`: Data access layer
- `src/routes`: API routes
- `src/schemas`: Data validation schemas
- `src/services`: Business logic
- `src/types`: TypeScript interfaces and types
- `src/utils`: Utility functions

## Setup and Running

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or Atlas URI)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/weather-alert-system
TOMORROW_API_KEY=your_api_key
TOMORROW_API_URL=https://api.tomorrow.io/v4
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