# Form API - Dynamic Form Submission Backend

A Node.js Express API that accepts dynamic form submissions and validates them against JSON schemas.

## Features

- **Dynamic Validation**: Validates form data against provided JSON schema
- **Multiple Field Types**: Supports text, email, number, select, and checkbox fields
- **Comprehensive Error Handling**: Returns detailed validation errors
- **In-Memory Storage**: Stores submissions (can be extended to MongoDB)
- **CORS Enabled**: Allows cross-origin requests from frontend
- **REST API**: Clean API endpoints with proper HTTP status codes

## API Endpoints

### POST /submit-form

Accepts form data and schema for validation and storage.

**Request Body:**

```json
{
  "schema": [
    {
      "label": "Name",
      "type": "text",
      "name": "name",
      "required": true,
      "minLength": 3
    },
    {
      "label": "Email",
      "type": "email",
      "name": "email",
      "required": true
    }
  ],
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Form submitted successfully",
  "submissionId": 1
}
```

**Validation Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": ["Name must be at least 3 characters long"],
    "email": ["Email must be a valid email address"]
  }
}
```

### GET /submissions (Bonus)

Returns all stored form submissions.

**Response:**

```json
{
  "success": true,
  "submissions": [
    {
      "id": 1,
      "timestamp": "2025-06-30T10:30:00.000Z",
      "data": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "OK",
  "message": "Form API is running"
}
```

## Validation Rules

### Field Types and Constraints

- **text**: String validation with optional minLength/maxLength
- **email**: Email format validation with optional length constraints
- **number**: Numeric validation with optional min/max values
- **select**: Value must be one of the provided options
- **checkbox**: Boolean value validation

### Schema Properties

- `name`: Field identifier (required)
- `label`: Display label (required)
- `type`: Field type (required)
- `required`: Boolean indicating if field is mandatory
- `minLength`/`maxLength`: Length constraints for text/email
- `min`/`max`: Range constraints for numbers
- `options`: Valid options array for select fields

## Setup Instructions

### Prerequisites

- Node.js (version 14+)
- npm or yarn

### Installation

1. Navigate to the project root directory:

```bash
cd implementation
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run main
```

4. The server will start on `http://localhost:3000`

## Project Structure

```
implementation/
├── server.js          # Main server file with API routes
├── package.json       # Dependencies and scripts
└── README.md         # This file
```

## Sample Request/Response

### Valid Submission

**Request:**

```bash
curl -X POST http://localhost:3000/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "schema": [
      {
        "label": "Name",
        "type": "text",
        "name": "name",
        "required": true,
        "minLength": 3
      }
    ],
    "data": {
      "name": "John Doe"
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Form submitted successfully",
  "submissionId": 1
}
```

### Invalid Submission

**Request:**

```bash
curl -X POST http://localhost:3000/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "schema": [
      {
        "label": "Name",
        "type": "text",
        "name": "name",
        "required": true,
        "minLength": 3
      }
    ],
    "data": {
      "name": "Jo"
    }
  }'
```

**Response:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": ["Name must be at least 3 characters long"]
  }
}
```

## How Validation is Handled

1. **Schema Validation**: Ensures the schema is a valid array
2. **Data Validation**: Ensures data is a valid object
3. **Field-by-Field Validation**: Each field is validated against its schema:

   - Required field checks
   - Type-specific validation (email format, number range, etc.)
   - Constraint validation (min/max length, min/max value)
   - Select option validation

4. **Error Aggregation**: All validation errors are collected and returned
5. **Storage**: Valid submissions are stored with timestamp and unique ID

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing middleware
- **ES6 Modules**: Modern JavaScript module system

## Development

### Available Scripts

- `npm start`: Start the production server
- `npm run main`: Start development server with nodemon (auto-restart)
- `npm test`: Run tests (placeholder)

### Extending the API

To add MongoDB support:

1. Install mongoose: `npm install mongoose`
2. Replace the in-memory `submissions` array with MongoDB operations
3. Add connection string and database models

### Error Handling

The API includes comprehensive error handling:

- Input validation errors (400)
- Server errors (500)
- Detailed error messages for debugging
- Proper HTTP status codes

## Testing

You can test the API using:

- The included React frontend
- Postman or similar API testing tools
- cURL commands (examples provided above)
- Browser developer tools

## Environment

The server runs on port 3000 by default. To change the port, modify the `app.listen()` call in `server.js` or use environment variables.
