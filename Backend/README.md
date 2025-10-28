# Personal Library Management System - Backend

A Spring Boot backend application for managing personal book collections with user authentication, image upload, and CRUD operations.

## ✨ Features

- **User Authentication**: JWT-based registration and login with BCrypt password encryption
- **Book Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Image Upload**: Upload and serve book cover images with validation
- **User-specific Libraries**: Each user manages their own book collection with data isolation
- **RESTful API**: Comprehensive REST API with proper HTTP status codes and error handling
- **Data Validation**: Input validation and authentication checks
- **CORS Support**: Configured for frontend communication

## 🛠 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Spring Boot | 3.1.12 |
| Language | Java | 17 |
| Database | MySQL | 8.0 |
| Authentication | JWT | Latest |
| Password Hashing | BCrypt | Spring Security |
| Build Tool | Maven | 3.6+ |
| ORM | JPA/Hibernate | Spring Data JPA |

## 📋 Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Docker (optional, for containerized setup)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# From project root directory
docker compose up --build

# Backend will be available at http://localhost:4000
```

### Option 2: Local Setup

1. **Clone and navigate to project:**
```bash
cd Backend
```

2. **Create MySQL database:**
```sql
CREATE DATABASE librarydb;
CREATE USER 'libraryuser'@'localhost' IDENTIFIED BY 'librarypass';
GRANT ALL PRIVILEGES ON librarydb.* TO 'libraryuser'@'localhost';
FLUSH PRIVILEGES;
```

3. **Run initialization script:**
```bash
mysql -u root -p librarydb < ../db-init.sql
# Or use the one in project root
```

4. **Build the project:**
```bash
mvn clean install
```

5. **Run the application:**
```bash
mvn spring-boot:run

# Or run the JAR directly
java -jar target/DevOps_Project-0.0.1-SNAPSHOT.jar
```

Backend will start on `http://localhost:4000`

---

## 📚 API Documentation

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "message": "Registration successful"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "message": "Login successful",
  "userId": 1
}
```

### Book Management Endpoints

> **All book endpoints require Bearer token authentication**
> Header: `Authorization: Bearer {token}`

#### Get All User's Books
```http
GET /api/books
Authorization: Bearer {token}

Response: [
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel",
    "imagePath": "uploads/images/book1.jpg",
    "userId": 1,
    "createdAt": "2025-10-17T10:00:00",
    "updatedAt": "2025-10-17T10:00:00"
  }
]
```

#### Add New Book
```http
POST /api/books
Authorization: Bearer {token}
Content-Type: multipart/form-data

Parameters:
- title: "Book Title" (required)
- author: "Author Name" (required)
- description: "Book Description" (optional)
- image: file (optional, max 10MB)

Response: 
{
  "id": 2,
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book Description",
  "imagePath": "uploads/images/[unique-id].jpg",
  "userId": 1,
  "createdAt": "2025-10-17T10:05:00"
}
```

#### Update Book
```http
PUT /api/books/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data

Parameters: (Same as POST, all optional)
- title: "Updated Title"
- author: "Updated Author"
- description: "Updated Description"
- image: file (optional)

Response: Updated book object
```

#### Delete Book
```http
DELETE /api/books/{id}
Authorization: Bearer {token}

Response:
{
  "message": "Book deleted successfully"
}
```

### Image Endpoints

#### Get Book Cover Image
```http
GET /api/image/{filename}

Response: Image file (JPEG/PNG)
```

---

## 🔐 Configuration

Edit `src/main/resources/application.properties`:

```properties
# Server Configuration
spring.application.name=DevOps_Project
server.port=4000

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/librarydb
spring.datasource.username=libraryuser
spring.datasource.password=librarypass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

# JWT Configuration
jwt.secret=mySecretKey123456789012345678901234567890
jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=uploads/images

# CORS Configuration
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=*
spring.web.cors.allowed-headers=*
```

---

## 📁 Project Structure

```
Backend/
├── src/
│   ├── main/
│   │   ├── java/com/Personal_Libarary_Management_System/DevOps_Project/
│   │   │   ├── DevOpsProjectApplication.java      # Main Spring Boot class
│   │   │   ├── BookController.java                # Book API endpoints
│   │   │   ├── LoginController.java               # Auth endpoints
│   │   │   ├── ImageController.java               # Image serving
│   │   │   ├── Book.java                          # Book entity
│   │   │   ├── User.java                          # User entity
│   │   │   ├── BookRepository.java                # Book database queries
│   │   │   ├── UserRepository.java                # User database queries
│   │   │   ├── JwtUtil.java                       # JWT token handling
│   │   │   ├── UserService.java                   # User business logic
│   │   │   ├── CorsFilter.java                    # CORS configuration
│   │   │   ├── LoginRequest.java                  # Login DTO
│   │   │   ├── LoginResponse.java                 # Login response DTO
│   │   │   ├── RegisterRequest.java               # Register DTO
│   │   │   ├── ApiResponse.java                   # Generic API response
│   │   │   └── UserProfile.java                   # User profile
│   │   └── resources/
│   │       └── application.properties             # Configuration
│   └── test/
│       └── java/com/Personal_Libarary_Management_System/DevOps_Project/
│           └── (Unit tests)
├── pom.xml                                        # Maven dependencies
├── Dockerfile                                     # Docker configuration
└── README.md                                      # This file
```

---

## 🧪 Testing

### Run Unit Tests
```bash
mvn test
```

### Run Specific Test
```bash
mvn test -Dtest=BookControllerTest
```

### Test Coverage
```bash
mvn jacoco:report
```

---

## 🐳 Docker

### Build Docker Image
```bash
docker build -t library-backend .
```

### Run Container
```bash
docker run -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/librarydb \
           -e SPRING_DATASOURCE_USERNAME=libraryuser \
           -e SPRING_DATASOURCE_PASSWORD=librarypass \
           -p 4000:4000 \
           library-backend
```

### Docker Compose
```bash
# Build and run entire stack
docker compose up --build

# View logs
docker compose logs -f backend

# Stop services
docker compose down
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Books Table
```sql
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(500),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔒 Security Features

- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Password Hashing**: BCrypt for secure password storage
- **CORS Configuration**: Restricted cross-origin requests
- **Input Validation**: Spring Validation for input safety
- **SQL Prevention**: JPA parameterized queries prevent SQL injection
- **File Validation**: Image file type and size validation
- **Authorization**: User can only access their own books

---

## 🐛 Troubleshooting

### "Connection refused" MySQL
```bash
# Ensure MySQL is running
mysql -u root -p -e "SELECT 1"

# Or use Docker
docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8.0
```

### "Port 4000 already in use"
```bash
# Change port in application.properties
server.port=4001

# Or kill existing process
lsof -i :4000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### JWT Token Issues
```bash
# Token expires after 24 hours
# Update jwt.expiration in application.properties (milliseconds)

# Generate new token by logging in again
```

### File Upload Issues
```bash
# Ensure uploads directory exists and is writable
mkdir -p uploads/images
chmod 755 uploads/images

# Increase max file size in application.properties
spring.servlet.multipart.max-file-size=20MB
```

---

## 📝 Sample Credentials

After database initialization:
- **Username**: `admin`
- **Password**: `admin123`

Or register a new user through `/api/auth/register`

---

## 🔄 Development

### Hot Reload
```bash
mvn clean install
# or use Spring Boot DevTools for automatic reload
```

### Debugging
```bash
# Run with debug mode
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"

# Or set in IDE: Add VM option -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005
```

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [JWT Authentication](https://jwt.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Support

For issues:
1. Check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
2. Check [SETUP_GUIDE.md](../SETUP_GUIDE.md)
3. Review application logs: `docker logs backend`

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
spring.datasource.password=librarypass
```

5. **Build and run:**
```bash
mvn clean install
mvn spring-boot:run
```

The application will start on `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/profile` - Get user profile

### Books
- `POST /api/books` - Add new book (with image upload)
- `GET /api/books` - Get user's books
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book
- `GET /api/books/search` - Search books

### Images
- `GET /api/images/{filename}` - Serve book images

## Project Structure

```
src/main/java/com/Personal_Libarary_Management_System/DevOps_Project/
├── entities/
│   ├── User.java
│   └── Book.java
├── repositories/
│   ├── UserRepository.java
│   └── BookRepository.java
├── controllers/
│   ├── LoginController.java
│   ├── BookController.java
│   └── ImageController.java
├── services/
│   └── UserService.java
├── utils/
│   └── JwtUtil.java
├── dto/
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   ├── RegisterRequest.java
│   ├── UserProfile.java
│   └── ApiResponse.java
└── DevOpsProjectApplication.java
```

## Configuration

### Database Configuration
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/librarydb
spring.datasource.username=libraryuser
spring.datasource.password=librarypass
```

### File Upload Configuration
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=uploads/images
```

### JWT Configuration
```properties
jwt.secret=mySecretKey123456789012345678901234567890
jwt.expiration=86400000
```

## Testing

Use the provided API documentation (`API_DOCUMENTATION.md`) for testing endpoints with tools like Postman or curl.

## Docker Support

The project includes a Dockerfile for containerization. Build and run with:

```bash
docker build -t personal-library .
docker run -p 4000:4000 personal-library
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request