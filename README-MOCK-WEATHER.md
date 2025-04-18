# Mock Weather Service

This document explains how to use the mock weather service in the Weather Alert System backend.

## Overview

The mock weather service provides randomized weather data without making actual API calls to Tomorrow.io.
This is useful for:
- Development without consuming API quota
- Testing without internet connectivity
- Consistent behavior for automated tests

## How to Enable

You can enable the mock weather service in two ways:

### 1. Environment Variable

Set the `USE_MOCK_WEATHER` environment variable to `true`:

```bash
# In your terminal
export USE_MOCK_WEATHER=true
npm start
```

Or in your `.env` file:

```
USE_MOCK_WEATHER=true
```

### 2. Update config.js

Alternatively, you can directly modify the `useMockWeather` flag in the configuration.

## How It Works

When enabled, the DI container will register `MockWeatherService` instead of the real `WeatherService`.

The mock service:
- Simulates API delays (500ms)
- Generates realistic random weather data
- Considers hemispheres and seasons for temperature
- Logs when it's being used and what data it's generating
- Maintains the same interface as the real service

## Weather Data Generation

The mock service generates data in these ways:

- **Location**: Uses provided coordinates or generates random ones for city names
- **Temperature**: Based on hemisphere and current season
- **Weather Codes**: Randomly selects from valid Tomorrow.io weather codes
- **Other Metrics**: Generates appropriate random values for humidity, wind, etc.

## Logs

When using the mock service, you'll see these log messages:

- At startup: `📣 Using MockWeatherService - no external API calls will be made`
- For each weather request: `📊 Mock weather data generated for [location]`

## Switching Back

To use the real weather service again, set `USE_MOCK_WEATHER=false` or remove the environment variable. 