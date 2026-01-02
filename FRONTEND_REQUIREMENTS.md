# TruckStop Load Search Frontend - Requirements

## Project Overview
Create a Next.js frontend application for displaying and managing TruckStop load search data. The application enables users to search for available loads and contact companies to arrange transportation deals.

## Project Structure
- **Location**: `frontend/` folder
- **Framework**: Next.js
- **Design Pattern**: Material Design / Floating Label inputs
- **Docker Integration**: Must be added to docker-compose bundle alongside the API

## Required Configuration Files
- `.gitignore` - Standard Next.js/Node.js ignore patterns
- `.dockerignore` - Docker-specific ignore patterns

## API Integration
- **Endpoint**: `http://localhost:5244/api/truckstop/load-search`
- **Method**: POST
- **Content-Type**: application/json

## Core Features

### 1. Configuration Management
**Location**: Top-right corner button

**Fields** (stored securely only for this sessions):
- `integrationId` (number)
- `userName` (string)
- `password` (string)

**Behavior**: These credentials must be included in every API request.

### 2. Search Criteria Module
**UI Behavior**:
- Collapsible module
- When collapsed: Show criteria summary (read-only, small display)
- When expanded: Full edit mode with all input fields

**Origin Fields**:
- `originCountry` - Dropdown (Country enum)
- `originState` - Text input or dropdown (State enum)
- `originCity` - Text input
- `originRange` - Number input (radius in miles)

**Destination Fields**:
- `destinationCountry` - Dropdown (Country enum)
- `destinationState` - Text input or dropdown (State enum)
- `destinationCity` - Text input
- `destinationRange` - Number input (radius in miles)

**Additional Criteria**:
- `equipmentType` - Dropdown (Equipment Type enum)
- `loadType` - Dropdown (Load Type enum)
- `hoursOld` - Number input (default: 0)
- `pageNumber` - Number input (default: 1)
- `pageSize` - Number input (default: 50)
- `sortBy` - Dropdown (default: "Age")
- `sortDescending` - Boolean (default: false)

**Auto-Refresh Option**:
- User-selectable refresh interval (minimum: 2 seconds)
- Default: OFF
- Critical for time-sensitive load opportunities

### 3. TypeScript Enums
Create TypeScript enums matching the TruckStop API specification:
- **Reference**: https://developer.truckstop.com/reference/truck-searching-data-classes
- **Required Enums**:
  - Country codes
  - State/Province codes
  - Equipment types
  - Load types

### 4. Results Table
**Columns** (in order):
1. **Time Elapsed** - Calculated from `entered` field
   - Format: `01s`, `02s`, `04:02` (mm:ss)
   - After 1 hour: Show only minutes `62:00` (no seconds)
   - Real-time updates with auto-refresh
2. **Pickup Date** - From `pickupDate`
3. **Equipment** - From `equipment` or `equipmentTypes.description`
4. **Mode** - From `loadType`
5. **Company** - From `truckCompanyName`
6. **Origin City and State** - Combine `originCity`, `originState`
7. **Destination City and State** - Combine `destinationCity`, `destinationState`
8. **Length** - From `length`
9. **Weight** - From `weight`
10. **Rate** - From `paymentAmount`
11. **Contact** - From `pointOfContact` and `pointOfContactPhone`

## Example Request
```javascript
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "integrationId": "YOUR_INTEGRATION_ID",
  "password": "YOUR_PASSWORD",
  "userName": "YOUR_USERNAME",
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
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:5244/api/truckstop/load-search", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

## Example Response Structure
```json
{
    "loads": [
        {
            "id": "7212234",
            "age": "3",
            "bond": 0,
            "bondTypeID": "9999",
            "credit": "",
            "dotNumber": "",
            "deletedId": 0,
            "deliveryDate": "12/21/25",
            "deliveryTime": "00:00",
            "destinationCity": "La Fayette",
            "destinationCountry": "USA",
            "destinationDistance": 298,
            "destinationState": "GA",
            "destinationZip": "",
            "distance": 0,
            "entered": "2025-12-15T18:15:59",
            "equipment": "F",
            "equipmentOptions": [],
            "equipmentTypes": {
                "category": "F",
                "categoryId": 1,
                "code": "F",
                "description": "Flatbed",
                "fullLoad": null,
                "id": 12,
                "isCategorizable": true,
                "isCombo": false,
                "isTruckPost": true,
                "mapToId": 12,
                "requiredOption": "",
                "webserviceOnly": false
            },
            "experienceFactor": "",
            "fuelCost": null,
            "handleName": "ParadeAuthTest1",
            "hasBonding": false,
            "isDeleted": false,
            "isFriend": false,
            "length": null,
            "loadType": "Full",
            "mcNumber": "",
            "mileage": 0,
            "originCity": "Bellflower",
            "originCountry": "USA",
            "originDistance": 16,
            "originState": "CA",
            "originZip": "",
            "paymentAmount": 25.0,
            "pickupDate": "12/19/25",
            "pickupTime": "00:00",
            "pointOfContact": "Pereet",
            "pointOfContactPhone": "333-444-5556",
            "pricePerGallon": 0,
            "quantity": 1,
            "specInfo": "",
            "stops": 0,
            "tmcNumber": "",
            "truckCompanyCity": "San Francisco",
            "truckCompanyEmail": "",
            "truckCompanyFax": "",
            "truckCompanyId": 424676,
            "truckCompanyName": "Parade - TMS",
            "truckCompanyPhone": "415-965-6237",
            "truckCompanyState": "CA",
            "weight": 150,
            "width": 0.00
        },
        {
            "id": "1580398675",
            "age": "9+",
            "bond": 75,
            "bondTypeID": "1003",
            "credit": "",
            "dotNumber": "2953269",
            "deletedId": 0,
            "deliveryDate": "",
            "deliveryTime": "",
            "destinationCity": "tampa",
            "destinationCountry": "USA",
            "destinationDistance": 296,
            "destinationState": "fl",
            "destinationZip": "",
            "distance": 0,
            "entered": "2018-07-26T13:19:38.21",
            "equipment": "F",
            "equipmentOptions": [],
            "equipmentTypes": {
                "category": "F",
                "categoryId": 1,
                "code": "F",
                "description": "Flatbed",
                "fullLoad": null,
                "id": 12,
                "isCategorizable": true,
                "isCombo": false,
                "isTruckPost": true,
                "mapToId": 12,
                "requiredOption": "",
                "webserviceOnly": false
            },
            "experienceFactor": "",
            "fuelCost": null,
            "handleName": "Greg",
            "hasBonding": true,
            "isDeleted": false,
            "isFriend": false,
            "length": 48,
            "loadType": "Full",
            "mcNumber": "555609",
            "mileage": 2719,
            "originCity": "huron",
            "originCountry": "USA",
            "originDistance": 179,
            "originState": "ca",
            "originZip": "",
            "paymentAmount": 5100,
            "pickupDate": "7/30/18",
            "pickupTime": "",
            "pointOfContact": "Greg Suttich",
            "pointOfContactPhone": "253-722-4428",
            "pricePerGallon": 0,
            "quantity": 1,
            "specInfo": "",
            "stops": 0,
            "tmcNumber": "679228",
            "truckCompanyCity": "KENNEWICK",
            "truckCompanyEmail": "gsuttich@armstrongtransport.com",
            "truckCompanyFax": "",
            "truckCompanyId": 319725,
            "truckCompanyName": "ARMSTRONG TRANSPORT GROUP / ARMSTRONG TRANSPORT",
            "truckCompanyPhone": "253-722-4428",
            "truckCompanyState": "WA",
            "weight": 46000,
            "width": 0.00
        }
    ],
    "errorMessage": null,
    "hasError": false,
    "totalResults": 50
}
```

## Key Requirements Summary
1. **Time-Critical**: The first few minutes are crucial for load opportunities
2. **Auto-Refresh**: Minimum 2-second intervals when enabled
3. **Persistent Config**: Credentials stored securely across sessions
4. **Responsive Design**: Material Design with floating labels
5. **Collapsible Search**: Minimize screen space when viewing results
6. **Real-Time Calculations**: Time elapsed updates continuously
7. **Docker Ready**: Full integration with existing docker-compose setup

## Technical Considerations
- Secure credential storage (localStorage with encryption or httpOnly cookies)
- Efficient re-rendering with auto-refresh
- Error handling for API failures
- Loading states during data fetch
- Responsive table design for large datasets
- TypeScript strict mode for type safety
