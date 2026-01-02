# TruckStop Load Search Frontend

A Next.js application for searching and managing TruckStop load data with real-time updates.

## Features

- **Configuration Management**: Securely store API credentials (Integration ID, username, password)
- **Advanced Search**: Filter loads by origin, destination, equipment type, load type, and more
- **Real-Time Updates**: Elapsed time updates every second
- **Auto-Refresh**: Configurable auto-refresh with minimum 2-second intervals
- **Collapsible UI**: Minimize search criteria to maximize results view
- **Material Design**: Clean, modern UI with floating labels

## Quick Start

### Development Mode

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Mode

The frontend is included in the docker-compose setup. From the project root:

```bash
docker-compose up --build
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

## Configuration

### Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```
NEXT_PUBLIC_API_URL=http://localhost:5244
```

### API Credentials

On first launch, you'll be prompted to enter:
- Integration ID (number)
- User Name (string)
- Password (string)

These credentials are stored in browser localStorage and sent with every API request.

## Usage

1. **Configure Credentials**: Click the settings icon (top-right) to enter your TruckStop API credentials
2. **Set Search Criteria**: Expand the search panel and fill in origin, destination, and filter options
3. **Search**: Click "Search Loads" to fetch results
4. **Enable Auto-Refresh**: Check "Enable Auto-Refresh" and set interval (minimum 2 seconds)
5. **View Results**: See loads in a sortable table with real-time elapsed time

## Results Table Columns

1. Time Elapsed - Real-time calculation from `entered` field
2. Pickup Date
3. Equipment Type
4. Load Type (Mode)
5. Company Name
6. Origin (City, State)
7. Destination (City, State)
8. Length (feet)
9. Weight (lbs)
10. Rate (USD)
11. Contact (name and phone)

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Material-UI (MUI) v5
- **Language**: TypeScript
- **Styling**: Material Design with Emotion
- **State Management**: React hooks

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── services/         # API service layer
│   ├── theme/           # MUI theme configuration
│   ├── types/           # TypeScript types and enums
│   └── utils/           # Utility functions
├── public/              # Static assets
├── Dockerfile           # Docker configuration
└── package.json         # Dependencies
```

## API Integration

The frontend communicates with the TruckStop API backend at:
- Default: `http://localhost:5244/api/truckstop/load-search`
- Configurable via `NEXT_PUBLIC_API_URL` environment variable

## Building for Production

```bash
npm run build
npm start
```

Or use the Docker setup for production deployment.
