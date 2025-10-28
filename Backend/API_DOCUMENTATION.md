# Personal Library Management System - API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### 1. User Registration
**POST** `/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com"
}
```

**Response (Success - 200):**
```json
{
  "message": "Registration successful"
}
```

**Response (Error - 400):**
```json
{
  "message": "Username already exists"
}
```

### 2. User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "username": "john_doe"
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid username or password"
}
```

### 3. Get User Profile
**GET** `/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success - 200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

---

## Book Management Endpoints

### 4. Add New Book
**POST** `/books`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (required): Book title
- `author` (required): Book author
- `description` (optional): Book description
- `image` (optional): Book cover image file

**Response (Success - 200):**
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel",
  "imagePath": "uuid_book_cover.jpg",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

### 5. Get User's Books
**GET** `/books`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success - 200):**
```json
[
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel",
    "imagePath": "uuid_book_cover.jpg",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### 6. Update Book
**PUT** `/books/{id}`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (required): Updated book title
- `author` (required): Updated book author
- `description` (optional): Updated book description
- `image` (optional): New book cover image file

**Response (Success - 200):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "author": "Updated Author",
  "description": "Updated description",
  "imagePath": "new_uuid_book_cover.jpg",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T11:45:00"
}
```

### 7. Delete Book
**DELETE** `/books/{id}`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success - 200):**
```json
{
  "message": "Book deleted successfully"
}
```

### 8. Search Books
**GET** `/books/search?title={title}&author={author}`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `title` (optional): Search by book title
- `author` (optional): Search by author name

**Response (Success - 200):**
```json
[
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel",
    "imagePath": "uuid_book_cover.jpg",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

---

## Image Endpoints

### 9. Get Book Image
**GET** `/images/{filename}`

**Response:** Returns the image file

**Example:**
```
GET /api/images/uuid_book_cover.jpg
```

---

## Error Responses

### Common Error Codes:
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Invalid or missing JWT token
- **403 Forbidden**: Access denied (trying to access other user's resources)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format:
```json
{
  "message": "Error description"
}
```

---

## Usage Examples

### Complete Flow Example:

1. **Register a new user:**
```bash
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123","email":"john@example.com"}'
```

2. **Login to get JWT token:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

3. **Add a book with image:**
```bash
curl -X POST http://localhost:4000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=The Great Gatsby" \
  -F "author=F. Scott Fitzgerald" \
  -F "description=A classic American novel" \
  -F "image=@/path/to/book_cover.jpg"
```

4. **Get all user's books:**
```bash
curl -X GET http://localhost:4000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

5. **Update a book:**
```bash
curl -X PUT http://localhost:4000/api/books/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Updated Title" \
  -F "author=Updated Author" \
  -F "description=Updated description"
```

6. **Delete a book:**
```bash
curl -X DELETE http://localhost:4000/api/books/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Notes:
- All timestamps are in ISO 8601 format
- Image files are stored locally and served via `/api/images/{filename}`
- JWT tokens expire after 24 hours (configurable)
- Maximum file upload size is 10MB
- Supported image formats: JPG, JPEG, PNG, GIF