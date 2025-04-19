# Weather Alert System Backend

A robust and scalable backend service for the Weather Alert System application.

## Quick Start

### Deployed Application
API is available through [https://alertrix-client.vercel.app/](https://alertrix-client.vercel.app/)

### Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-alert-system.git
   cd Alertrix-Server/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
  

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Verify the server**
   Open http://localhost:3000/health - should return `{"status":"ok"}`

## Project Details

### Source
- **Repository**: [https://github.com/yourusername/weather-alert-system](https://github.com/yourusername/weather-alert-system)

### Features
- Real-time weather data integration with Tomorrow.io API
- RESTful API endpoints for weather alerts management
- Automated alert evaluation every 5 minutes
- Email notifications for triggered alerts
- Mock weather service for development and testing

### Tech Stack
- Node.js with TypeScript, Express, MongoDB/Mongoose
- Zod for validation, TSyringe for dependency injection
- node-cron for scheduling, Nodemailer for email
- Winston for logging

### API Endpoints

- `GET /api/weather?city=[CITY_NAME]` - Get weather for a city
- `GET /api/weather?lat=[LATITUDE]&lon=[LONGITUDE]` - Get weather for coordinates
- `POST /api/alerts` - Create alert
- `GET /api/alerts/status` - Get alerts status
- `GET /api/alerts/:id` - Get specific alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

Full documentation available in the [project repository](https://github.com/yourusername/weather-alert-system).
