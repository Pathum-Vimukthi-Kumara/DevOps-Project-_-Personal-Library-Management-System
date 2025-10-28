# 📚 Personal Library Management System - Complete Setup Guide

## Project Overview
This is a full-stack application for managing personal book libraries with user authentication, CRUD operations, and image uploads.

**Stack:**
- **Backend**: Spring Boot 3.1.12 (Java 17)
- **Frontend**: React 19 with Tailwind CSS
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

---

## ✅ Project Fixes & Improvements Made

### 1. **Database Script Consolidated** ✓
- **Issue**: `db-init.sql` and `library_schema.sql` had conflicting table definitions (user vs users)
- **Fix**: Unified comprehensive database script in `db-init.sql` with:
  - Proper table structures (users, books)
  - Foreign keys with cascade delete
  - Indexes for performance
  - Sample data with correct BCrypt passwords

### 2. **Frontend API Integration** ✓
- Created `src/services/api.js` - centralized API client with:
  - Authentication endpoints (login, register)
  - Book management endpoints (CRUD operations)
  - Token management
- Updated `Dashboard.js` with:
  - Real API integration
  - Book CRUD functionality (Add, Edit, Delete)
  - Modal for form management
  - Proper error handling & loading states
- Updated `Login.js` and `Register.js` to use API service

### 3. **Configuration Fixed** ✓
- Fixed `package.json` proxy: Changed from `http://localhost:8089` to `http://localhost:4000`
- All frontend components now properly communicate with backend

---

## 🚀 How to Run the Project

### **Option 1: Using Docker Compose (Recommended)**

#### Prerequisites:
- Docker Desktop installed with WSL 2 integration enabled
- On Windows: Configure Docker Desktop to use WSL 2 backend

#### Steps:
```bash
cd c:\Users\hp\Desktop\5th\ sem\ academic\DevOps_Project

# Start all services
docker compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:4000
# - MySQL: localhost:3306
```

#### To stop:
```bash
docker compose down
```

---

### **Option 2: Manual Setup (Local Development)**

#### 1. Start MySQL Database
```bash
# Install MySQL or use Docker for just the database
docker run --name library-mysql -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=librarydb -e MYSQL_USER=libraryuser -e MYSQL_PASSWORD=librarypass -p 3306:3306 -d mysql:8.0

# Import the database script
mysql -u root -p < db-init.sql
```

#### 2. Start Backend (Spring Boot)
```bash
cd Backend

# Build
mvn clean install

# Run
mvn spring-boot:run

# Or directly run the jar
java -jar target/DevOps_Project-0.0.1-SNAPSHOT.jar
```

Backend will run on `http://localhost:4000`

#### 3. Start Frontend (React)
```bash
cd frontend/frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will open at `http://localhost:3000`

---

## 🔐 Default Login Credentials

After database initialization, use:
- **Username**: `admin` or `testuser`
- **Password**: `admin123`

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Books (Requires Bearer Token)
- `GET /api/books` - Get all user's books
- `POST /api/books` - Add new book (multipart/form-data with image)
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book

### Images
- `GET /api/image/{filename}` - Get book cover image

---

## 📁 Project Structure

```
DevOps_Project/
├── Backend/
│   ├── src/main/java/com/Personal_Libarary_Management_System/DevOps_Project/
│   │   ├── BookController.java
│   │   ├── LoginController.java
│   │   ├── UserService.java
│   │   ├── JwtUtil.java
│   │   └── ... (other Java classes)
│   ├── pom.xml
│   ├── Dockerfile
│   └── application.properties
├── frontend/frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/Dashboard.js
│   │   │   ├── Login/Login.js
│   │   │   ├── Register/Register.js
│   │   │   └── Landing/Landing.js
│   │   ├── services/
│   │   │   └── api.js (NEW - API client)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── db-init.sql (UPDATED - Comprehensive DB script)
├── compose.yaml (Docker Compose configuration)
└── README.md (This file)
```

---

## 🔧 Backend Configuration

**Key files**: `Backend/src/main/resources/application.properties`

```properties
spring.application.name=DevOps_Project
spring.datasource.url=jdbc:mysql://mysql:3306/librarydb
spring.datasource.username=libraryuser
spring.datasource.password=librarypass
server.port=4000

# JWT Configuration
jwt.secret=mySecretKey123456789012345678901234567890
jwt.expiration=86400000 (24 hours)

# File upload settings
spring.servlet.multipart.max-file-size=10MB
file.upload-dir=uploads/images
```

---

## 🎨 Frontend Features

✓ User authentication (Login/Register)
✓ Responsive dashboard with Tailwind CSS
✓ Add books with title, author, description, and cover image
✓ Edit existing books
✓ Delete books with confirmation
✓ Real-time book list updates
✓ Error handling and loading states
✓ Logout functionality

---

## 🐛 Troubleshooting

### Docker issues on WSL 2:
```bash
# Enable WSL 2 integration in Docker Desktop Settings:
# Settings → Resources → WSL Integration → Enable for your distro
```

### Port already in use:
```bash
# Find process using port
netstat -ano | findstr :4000  # Windows PowerShell

# Kill the process (change 1234 to actual PID)
taskkill /PID 1234 /F
```

### Database connection error:
- Ensure MySQL is running on port 3306
- Check credentials in `application.properties`
- Verify `db-init.sql` was imported correctly

### Frontend can't connect to backend:
- Check that backend is running on port 4000
- Verify `package.json` proxy is set to `http://localhost:4000`
- Check browser console for CORS errors

---

## 📦 Technologies Used

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Spring Boot | 3.1.12 |
| Java | JDK | 17 |
| Frontend | React | 19.1.1 |
| Styling | Tailwind CSS | 3.3.3 |
| Database | MySQL | 8.0 |
| Container | Docker | Latest |
| Build (Backend) | Maven | 3.9+ |
| Build (Frontend) | npm | 10+ |

---

## 🔒 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration
- Role-based authorization
- SQL injection prevention via JPA/Hibernate
- File upload validation

---

## 📝 Development Tips

### To modify backend:
1. Edit Java files in `Backend/src/main/`
2. Run `mvn clean install`
3. Restart the backend service

### To modify frontend:
1. Edit React components in `frontend/frontend/src/`
2. Changes auto-reload in development mode
3. No rebuild needed for simple JS/CSS changes

### To modify database schema:
1. Update `db-init.sql`
2. Delete the old database volume: `docker volume rm devops_project_db_data`
3. Restart Docker Compose

---

## ✨ Next Steps & Enhancements

- [ ] Add book search and filtering
- [ ] Implement book ratings and reviews
- [ ] Add user profile management
- [ ] Implement pagination
- [ ] Add export to PDF functionality
- [ ] Add mobile responsive improvements
- [ ] Add automated tests
- [ ] Deploy to cloud (Azure, AWS, etc.)

---

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs (frontend and backend)
3. Verify all services are running: `docker compose ps`
4. Check database connection: `mysql -u libraryuser -p librarydb`

---

## 📄 License

This project is for educational purposes.

---

**Happy Reading! 📚📖**
