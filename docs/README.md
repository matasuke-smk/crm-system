# CRM System API Documentation

## Overview

This CRM System provides a RESTful API for managing customers with user authentication. The API follows REST conventions and returns JSON responses.

**Base URL:** `http://localhost:5000` (development) or your deployed URL  
**API Version:** v1

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the bearer token in the Authorization header for protected endpoints.

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Logout User
```
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

### Customer Endpoints

All customer endpoints require authentication.

#### Get All Customers
```
GET /api/customers
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email

**Example:**
```
GET /api/customers?page=1&limit=10&search=john
```

**Response (200):**
```json
{
  "message": "Customers retrieved successfully",
  "customers": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john.smith@example.com",
      "phone": "+1-555-0123",
      "company": "Acme Corp",
      "notes": "VIP customer",
      "user_id": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### Get Single Customer
```
GET /api/customers/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Customer retrieved successfully",
  "customer": {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1-555-0123",
    "company": "Acme Corp",
    "notes": "VIP customer",
    "user_id": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Create Customer
```
POST /api/customers
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-555-0124",
  "company": "Tech Solutions Inc",
  "notes": "Interested in premium package"
}
```

**Response (201):**
```json
{
  "message": "Customer created successfully",
  "customer": {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1-555-0124",
    "company": "Tech Solutions Inc",
    "notes": "Interested in premium package",
    "user_id": 1,
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

#### Update Customer
```
PUT /api/customers/:id
Authorization: Bearer <token>
```

**Request Body:** (all fields optional for partial updates)
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1-555-0125",
  "company": "Tech Solutions Inc",
  "notes": "Upgraded to premium package"
}
```

**Response (200):**
```json
{
  "message": "Customer updated successfully",
  "customer": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-0125",
    "company": "Tech Solutions Inc",
    "notes": "Upgraded to premium package",
    "user_id": 1,
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  }
}
```

#### Delete Customer
```
DELETE /api/customers/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Customer deleted successfully",
  "customer": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-0125",
    "company": "Tech Solutions Inc",
    "notes": "Upgraded to premium package",
    "user_id": 1,
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": "Error type",
  "message": "Human readable error message"
}
```

### Common HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Invalid or missing authentication token
- **403 Forbidden** - Valid token but insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists (e.g., duplicate email)
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error

### Validation Errors

When validation fails, the response includes detailed field errors:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "name",
      "message": "Name must be between 2 and 100 characters"
    }
  ]
}
```

## Rate Limiting

- **General API endpoints:** 100 requests per 15 minutes per IP
- **Authentication endpoints:** 5 requests per 15 minutes per IP

When rate limit is exceeded:
```json
{
  "error": "Too many requests from this IP, please try again later"
}
```

## Data Validation Rules

### User Registration
- **name**: Required, 2-100 characters
- **email**: Required, valid email format, unique
- **password**: Required, minimum 6 characters, must contain uppercase, lowercase, and number

### Customer Data
- **name**: Required, 2-100 characters
- **email**: Required, valid email format, unique per user
- **phone**: Optional, max 50 characters
- **company**: Optional, max 100 characters
- **notes**: Optional, max 1000 characters

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Signed with secret, configurable expiration
- **Input Sanitization**: XSS protection on all inputs
- **SQL Injection Protection**: Parameterized queries
- **CORS**: Configurable allowed origins
- **Rate Limiting**: Prevents abuse
- **Helmet**: Security headers

## Example API Usage

### JavaScript/Fetch Example

```javascript
// Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});

const { token } = await loginResponse.json();

// Get customers
const customersResponse = await fetch('http://localhost:5000/api/customers?page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});

const { customers } = await customersResponse.json();
```

### cURL Examples

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'

# Get customers (replace TOKEN with actual JWT)
curl -X GET http://localhost:5000/api/customers \
  -H "Authorization: Bearer TOKEN"

# Create customer
curl -X POST http://localhost:5000/api/customers \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","phone":"+1-555-0124"}'
```

## Health Check

```
GET /health
```

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T12:00:00Z",
  "service": "CRM API",
  "version": "1.0.0"
}
```

## Support

For API issues or questions:
1. Check this documentation
2. Verify your request format and authentication
3. Check the server logs for detailed error information
4. Ensure your environment variables are properly configured