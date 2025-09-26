# Fansite v2 Database Integration

This document describes the changes made to integrate the fansite frontend with the new Berry Worker API v2.

## Changes Made

### 1. API Configuration (`config.js`)
- New configuration file for API settings
- Request helper functions with error handling and retry logic
- Loading state management
- Error display utilities

### 2. Frontend Updates (`tool.js`)

#### Column Definitions Updated
- **Streamlist**: Changed `id` → `streamID`, `category` → `categories`
- **Setlist**: Changed `song` → `songName`, `singer` → `artist`, `date` → `time`
- **Songlist**: New column definition for song management

#### API Integration
- Data source URLs now point to Worker API endpoints
- Response format handling for `{ data: [...] }` structure
- Loading indicators and error handling
- Support for both old JSON format and new API format

#### Field Mapping
- Backwards compatibility for existing data
- Dynamic field resolution (`id || streamID`, `category || categories`)

### 3. New Features
- Real-time loading indicators
- Better error messages
- Retry logic for failed requests
- Support for all CRUD operations

## Configuration

### Development Setup
```javascript
// config.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8787', // Local development
  // BASE_URL: 'https://berry-worker.your-domain.workers.dev', // Production
}
```

### Production Setup
Update the `BASE_URL` in `config.js` to point to your deployed Worker API.

## Migration Process

### Phase 1: API Development ✅
- [x] Worker API implementation
- [x] Database schema design
- [x] CRUD endpoints
- [x] Data migration scripts

### Phase 2: Frontend Integration ✅
- [x] API configuration setup
- [x] Frontend code updates
- [x] Column definition updates
- [x] Error handling implementation

### Phase 3: Testing & Deployment
- [ ] Local testing with Worker API
- [ ] Data migration from JSON to database
- [ ] Production deployment
- [ ] DNS/URL updates

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/songlist` | GET | Get all songs |
| `/songlist` | POST | Create new song |
| `/songlist/:songID` | PUT | Update song |
| `/songlist/:songID` | DELETE | Delete song |
| `/streamlist` | GET | Get all streams |
| `/streamlist` | POST | Create new stream |
| `/streamlist/:streamID` | PUT | Update stream |
| `/streamlist/:streamID` | DELETE | Delete stream |
| `/streamlist/bulk-categories` | PATCH | Update categories for multiple streams |
| `/setlist` | GET | Get all setlist entries |
| `/setlist` | POST | Create new setlist entry |
| `/setlist/:streamID/:trackNo/:segmentNo` | PUT | Update setlist entry |
| `/setlist/:streamID/:trackNo/:segmentNo` | DELETE | Delete setlist entry |

## Data Format Changes

### Streamlist
```javascript
// Old format
{
  "id": "VIDEO_ID",
  "title": "Stream Title",
  "time": "2023-01-01T12:00:00.000Z",
  "category": ["Singing", "Chatting"],
  "note": "Some note"
}

// New API format
{
  "streamID": "VIDEO_ID",
  "title": "Stream Title",
  "time": "2023-01-01T12:00:00.000Z",
  "categories": ["Singing", "Chatting"],
  "note": "Some note"
}
```

### Setlist
```javascript
// Old format
{
  "date": "2023-01-01T12:00:00.000Z",
  "track": "1-1",
  "song": "Song Name",
  "singer": "Artist Name",
  "note": "Some note",
  "YTLink": "https://youtu.be/VIDEO_ID"
}

// New API format
{
  "streamID": "VIDEO_ID",
  "time": "2023-01-01T12:00:00.000Z",
  "track": "1-1",
  "songName": "Song Name",
  "artist": "Artist Name",
  "note": "Some note",
  "YTLink": "https://youtu.be/VIDEO_ID",
  "songID": 123
}
```

### Songlist
```javascript
// New API format
{
  "songID": 123,
  "songName": "Song Name",
  "artist": "Artist Name",
  "genre": "Pop",
  "tieup": "Anime Name",
  "songNote": "Some note",
  "created_at": "2023-01-01T12:00:00.000Z",
  "updated_at": "2023-01-01T12:00:00.000Z"
}
```

## Error Handling

The new implementation includes comprehensive error handling:
- Network timeouts (10 seconds)
- Retry logic (3 attempts with exponential backoff)
- User-friendly error messages
- Loading state indicators

## Backward Compatibility

The frontend code maintains backward compatibility:
- Supports both old JSON files and new API responses
- Field mapping for changed column names
- Graceful fallback for missing data

## Testing

### Local Development
1. Start the Worker API: `cd berry_hyperdrive && npm run dev`
2. Serve the fansite: Use Live Server or similar
3. Test all CRUD operations

### Production Testing
1. Deploy Worker API: `cd berry_hyperdrive && npm run deploy`
2. Update `config.js` with production URL
3. Deploy fansite to hosting platform

## Troubleshooting

### Common Issues
1. **CORS errors**: Check Worker CORS configuration
2. **API timeouts**: Verify Hyperdrive connection
3. **Data format errors**: Check API response structure
4. **Loading issues**: Verify endpoint URLs in config

### Debug Mode
Enable console logging by adding:
```javascript
console.log('API Request:', method, endpoint, data)
console.log('API Response:', result)
```