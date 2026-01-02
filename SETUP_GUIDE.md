# TruckStop Integration - Complete Setup Guide

This guide will help you set up and run the complete TruckStop load search application, including both the API backend and the Next.js frontend.

## Project Overview

This project consists of two main components:
1. **API Backend** (C# .NET) - Handles communication with TruckStop SOAP API
2. **Frontend** (Next.js + TypeScript + Material-UI) - Provides a user interface for searching loads

## Prerequisites

- **Docker & Docker Compose** (Recommended)
  - OR -
- **.NET SDK 8.0+** (for API)
- **Node.js 20+** (for frontend)

## Quick Start (Docker - Recommended)

### 1. Build and Start All Services

From the project root directory:

```bash
docker-compose up --build
```

This will:
- Build and start the API backend on `http://localhost:5244`
- Build and start the frontend on `http://localhost:3000`

### 2. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Configure API Credentials

On first launch, you'll be prompted to enter your TruckStop API credentials:
- **Integration ID**: Your TruckStop integration ID (number)
- **User Name**: Your TruckStop username
- **Password**: Your TruckStop password

Example credentials:
```
Integration ID: YOUR_INTEGRATION_ID
User Name: YOUR_USERNAME
Password: YOUR_PASSWORD
```

> **Note**: Replace these with your actual TruckStop API credentials.

### 4. Search for Loads

1. Fill in your search criteria (origin, destination, equipment type, etc.)
2. Click "Search Loads"
3. View results in the table below

## Manual Setup (Without Docker)

### Backend Setup

1. Navigate to the API directory:
```bash
cd api
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the API:
```bash
dotnet run
```

The API will be available at `http://localhost:5244`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Features

### Configuration Management
- Store API credentials securely in browser localStorage
- Access via settings icon (top-right corner)
- Credentials persist across sessions

### Search Criteria
- **Origin/Destination**: City, state, country, and radius
- **Equipment Type**: Flatbed, Van, Reefer, and more
- **Load Type**: Full, Partial, or All
- **Sorting**: Sort by age, rate, company, etc.
- **Pagination**: Page size and page number controls

### Auto-Refresh
- Enable automatic search refresh
- Minimum interval: 2 seconds
- Critical for time-sensitive load opportunities

### Results Table
Real-time display with 11 columns:
1. **Time Elapsed** - Live updates every second
2. **Pickup Date**
3. **Equipment Type**
4. **Load Type (Mode)**
5. **Company Name**
6. **Origin** (City, State)
7. **Destination** (City, State)
8. **Length** (feet)
9. **Weight** (lbs)
10. **Rate** (USD)
11. **Contact** (name and phone)

## Architecture

```
TruckStop_integration/
├── api/                    # .NET API Backend
│   ├── Controllers/        # API endpoints
│   ├── Models/            # Data models
│   ├── Services/          # SOAP client
│   └── Dockerfile         # API Docker config
├── frontend/              # Next.js Frontend
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── services/     # API client
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Helper functions
│   └── Dockerfile        # Frontend Docker config
└── docker-compose.yml    # Orchestration
```

## API Endpoints

### Load Search
**POST** `/api/truckstop/load-search`

**Request Body:**
```json
{
  "integrationId": "YOUR_INTEGRATION_ID",
  "userName": "YOUR_USERNAME",
  "password": "YOUR_PASSWORD",
  "criteria": {
    "originCity": "Los Angeles",
    "originState": "CA",
    "originCountry": "usa",
    "originRange": 300,
    "destinationCity": "Garden City",
    "destinationState": "GA",
    "destinationCountry": "usa",
    "destinationRange": 500,
    "equipmentType": "F",
    "loadType": "All",
    "hoursOld": 0,
    "pageNumber": 1,
    "pageSize": 50,
    "sortBy": "Age",
    "sortDescending": false
  }
}
```

**Response:**
```json
{
  "loads": [...],
  "errorMessage": null,
  "hasError": false,
  "totalResults": 50
}
```

## Troubleshooting

### Frontend Can't Connect to API

1. Verify API is running:
```bash
curl http://localhost:5244/api/truckstop/load-search
```

2. Check environment variables in `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5244
```

### Docker Issues

1. Stop all containers:
```bash
docker-compose down
```

2. Rebuild from scratch:
```bash
docker-compose up --build --force-recreate
```

### CORS Errors

The API should have CORS configured for localhost:3000. If you encounter CORS errors, check the API's CORS configuration in `Program.cs` or `Startup.cs`.

## Development Tips

### Hot Reload
- Frontend: Changes auto-reload in development mode
- API: Use `dotnet watch run` for hot reload

### Debugging
- Frontend: Use browser DevTools (F12)
- API: Attach debugger in Visual Studio or VS Code

### Testing API Directly

Use curl or Postman to test the API:

```bash
curl -X POST http://localhost:5244/api/truckstop/load-search \
  -H "Content-Type: application/json" \
  -d '{
    "integrationId": "YOUR_INTEGRATION_ID",
    "userName": "YOUR_USERNAME",
    "password": "YOUR_PASSWORD",
    "criteria": {
      "originCity": "Los Angeles",
      "originState": "CA",
      "equipmentType": "F"
    }
  }'
```

## Production Deployment

### Using Docker

1. Build production images:
```bash
docker-compose build
```

2. Deploy to your container orchestration platform (Kubernetes, ECS, etc.)

### Environment Variables

Set these in production:
- `NEXT_PUBLIC_API_URL`: Your production API URL
- `ASPNETCORE_ENVIRONMENT`: Set to "Production" for API

## Support

For issues or questions:
1. Check the API logs: `docker logs truckstop-api`
2. Check the frontend logs: `docker logs truckstop-frontend`
3. Review the TruckStop API documentation: https://developer.truckstop.com/

## License

[Your License Here]
