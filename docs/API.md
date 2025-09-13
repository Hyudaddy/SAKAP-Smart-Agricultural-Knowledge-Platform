# API Documentation

## Overview

The SAKAP Agricultural Assistance Platform API provides RESTful endpoints for managing users, content, and chatbot interactions.

## Base URL

- Development: `http://localhost:5000/api`
- Production: `https://your-production-domain.com/api`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "public",
  "farmerId": "F12345",
  "location": "Sample Location",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "public"
    }
  }
}
```

#### POST /auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "public"
    },
    "token": "jwt-token-here"
  }
}
```

### Users

#### GET /users
Get all users (Admin only).

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "1",
        "name": "Admin User",
        "email": "admin@sakap.com",
        "role": "admin",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### GET /users/:id
Get user by ID.

#### PUT /users/:id
Update user information.

#### DELETE /users/:id
Delete user (Admin only).

### Content

#### GET /content/news
Get all news articles.

**Response:**
```json
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "1",
        "title": "New Agricultural Technology Breakthrough",
        "content": "Latest innovations in sustainable farming practices...",
        "author": "Dr. Agricultural Expert",
        "publishedAt": "2023-01-01T00:00:00.000Z",
        "category": "technology"
      }
    ]
  }
}
```

#### GET /content/activities
Get all activities.

#### GET /content/library
Get library content.

#### POST /content/news
Create news article (Admin/AEW only).

#### POST /content/activities
Create activity (Admin/AEW only).

### Chatbot

#### POST /chatbot/message
Send message to chatbot.

**Request Body:**
```json
{
  "message": "How to prevent crop diseases?",
  "userId": "user-id",
  "mode": "online"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Regular monitoring and proper crop rotation are key preventive measures...",
    "timestamp": "2023-01-01T00:00:00.000Z",
    "mode": "online",
    "messageId": "message-id"
  }
}
```

#### GET /chatbot/history/:userId
Get chat history for user.

#### DELETE /chatbot/history/:userId
Clear chat history for user.

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error