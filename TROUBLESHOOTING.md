# Troubleshooting Guide

## Common Issues and Solutions

### Docker & WSL Issues

#### ❌ "docker: command not found" in WSL2
**Cause**: Docker Desktop WSL 2 integration not enabled

**Solution**:
1. Open Docker Desktop
2. Go to Settings → Resources → WSL Integration
3. Enable integration for your WSL distro
4. Restart WSL: `wsl --shutdown`
5. Try again

```bash
# Test if working
docker ps
```

---

#### ❌ Port 3000/4000/3306 already in use

**Windows (PowerShell)**:
```bash
# Find process using port
netstat -ano | findstr :4000

# Kill the process (PID is the number)
taskkill /PID 12345 /F
```

**Linux/Mac**:
```bash
# Find process
lsof -i :4000

# Kill process
kill -9 <PID>
```

**Docker Alternative**:
```bash
# Change port in docker-compose.yaml
services:
  backend:
    ports:
      - "4001:4000"  # Use 4001 instead of 4000
```

---

#### ❌ "Cannot connect to Docker daemon"

**Solution**:
1. Start Docker Desktop application
2. Wait 30 seconds for initialization
3. Try again

```bash
docker ps  # Should show no errors
```

---

#### ❌ Volume permissions denied

**Solution**:
```bash
# Remove old volumes
docker volume prune

# Rebuild with fresh volumes
docker compose down -v
docker compose up --build
```

---

### Database Issues

#### ❌ "Connection refused: localhost:3306"

**Cause**: MySQL container not running

**Solution**:
```bash
# Check if MySQL is running
docker compose ps

# If not, restart
docker compose restart mysql

# Or remove and recreate
docker compose down
docker compose up --build
```

---

#### ❌ "Access denied for user 'libraryuser'@'localhost'"

**Cause**: Wrong credentials or database not initialized

**Solution**:
```bash
# Check credentials in compose.yaml
# They should match:
# MYSQL_USER: libraryuser
# MYSQL_PASSWORD: librarypass

# Verify database exists
docker exec library-mysql mysql -u root -prootpassword -e "SHOW DATABASES;"

# If database missing, restart with fresh volume
docker volume rm devops_project_db_data
docker compose up
```

---

#### ❌ "Table doesn't exist" errors

**Cause**: db-init.sql not executed

**Solution**:
```bash
# Check if tables exist
docker exec library-mysql mysql -u libraryuser -plibrarypass librarydb -e "SHOW TABLES;"

# If empty, manually run script
docker exec -i library-mysql mysql -u libraryuser -plibrarypass librarydb < db-init.sql

# Or delete volume and restart
docker volume rm devops_project_db_data
docker compose up
```

---

### Backend Issues

#### ❌ "Failed to bind to port 4000"

**Solution**:
```bash
# Find what's using the port
netstat -ano | findstr :4000

# Kill it or change port
# In application.properties or docker-compose.yaml:
server.port=4001
```

---

#### ❌ "ClassNotFoundException" or "No suitable driver"

**Cause**: MySQL driver not found

**Solution**:
```bash
# Rebuild container
docker compose build --no-cache backend
docker compose up backend
```

---

#### ❌ "Error creating bean" on startup

**Cause**: Configuration issue

**Solution**:
1. Check `application.properties` values match docker-compose.yaml
2. Check all required environment variables are set
3. View full logs:
```bash
docker logs -f backend
```

---

#### ❌ "JWT token invalid" when logged in

**Cause**: Token expired or JWT secret mismatch

**Solution**:
```bash
# Token expires after 24 hours (86400000 ms)
# To refresh: login again

# Or check JWT secret in application.properties:
jwt.secret=mySecretKey123456789012345678901234567890
```

---

### Frontend Issues

#### ❌ "Cannot find module 'react-router-dom'"

**Solution**:
```bash
cd frontend/frontend
npm install
npm start
```

---

#### ❌ "Blank white page" after login

**Cause**: Component error or API connection failed

**Solution**:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Verify backend is running: `http://localhost:4000`

---

#### ❌ "Failed to fetch: net::ERR_NAME_NOT_RESOLVED"

**Cause**: Backend not running or wrong URL

**Solution**:
```bash
# Verify backend is running
curl http://localhost:4000

# Check proxy in package.json
# Should be: "proxy": "http://localhost:4000"

# Check API_BASE_URL in src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
```

---

#### ❌ "CORS error" in console

**Cause**: Backend CORS configuration issue

**Solution**:
```bash
# Check CorsFilter.java or application.properties has correct settings:
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=*
spring.web.cors.allowed-headers=*

# Or rebuild backend container
docker compose build --no-cache backend
```

---

#### ❌ "Cannot read property 'imagePath' of undefined"

**Cause**: Books data structure mismatch

**Solution**:
1. Check API response in Network tab
2. Verify books table structure matches Java entity
3. Use optional chaining in JSX:
```javascript
{book?.imagePath && <img src={...} />}
```

---

### Authentication Issues

#### ❌ "Login always fails" with valid credentials

**Cause**: Database users not created or password hash mismatch

**Solution**:
```bash
# Check if admin user exists
docker exec library-mysql mysql -u libraryuser -plibrarypass librarydb \
  -e "SELECT username, email FROM users;"

# If not, create new user:
# Temporarily modify db-init.sql to INSERT user with correct BCrypt hash
# For "admin123" use: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFe5ldjoiKDpjIsIQaQMQZ2

# Restart database
docker volume rm devops_project_db_data
docker compose up
```

---

#### ❌ "Token not persisting" after login

**Cause**: localStorage not working or token not saved

**Solution**:
1. Open DevTools → Application → Local Storage
2. Verify authToken is stored
3. Check Login.js uses `setAuthToken(data.token)`
4. Clear storage and login again:
```javascript
localStorage.clear();
```

---

### Performance Issues

#### ❌ "App very slow" or "freezing"

**Solution**:
```bash
# Check container resources
docker stats

# If memory high, increase Docker resources
# Docker Desktop Settings → Resources → Memory

# Or optimize queries:
# Check slow query log
docker exec library-mysql mysql -u root -prootpassword \
  -e "SET GLOBAL slow_query_log='ON'; SET GLOBAL long_query_time=2;"
```

---

#### ❌ "Images not loading" after upload

**Cause**: Image path or upload directory issue

**Solution**:
```bash
# Check upload directory exists
docker exec backend ls -la /app/uploads/images

# Check image path in database
docker exec library-mysql mysql -u libraryuser -plibrarypass librarydb \
  -e "SELECT id, title, image_path FROM books;"

# Verify frontend uses correct image URL:
# {book?.imagePath && <img src={`${API_BASE_URL}/${book.imagePath}`} />}
```

---

### File Upload Issues

#### ❌ "File upload fails" silently

**Cause**: File too large or wrong format

**Solution**:
```bash
# Check configuration in application.properties:
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Check upload directory permissions:
docker exec backend chmod -R 755 /app/uploads

# Try uploading smaller image (< 5MB)
```

---

### Build Issues

#### ❌ "Build fails" with Maven error

**Solution**:
```bash
# Clean cache and rebuild
cd Backend
mvn clean install -DskipTests

# If still fails, check:
# 1. Java version (should be 17)
java -version

# 2. Maven version
mvn -version

# 3. Dependencies downloaded
mvn dependency:resolve
```

---

#### ❌ "npm install" takes too long or fails

**Solution**:
```bash
cd frontend/frontend

# Clear npm cache
npm cache clean --force

# Try again
npm install

# If still fails, delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install
```

---

### Logging & Debugging

#### Enable Verbose Logging

**Backend**:
```properties
# application.properties
logging.level.root=INFO
logging.level.com.Personal_Libarary_Management_System=DEBUG
spring.jpa.show-sql=true
```

**Frontend**:
```javascript
// In API calls
console.log('Request:', method, url);
console.log('Response:', data);
```

---

#### View Docker Logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs backend
docker compose logs mysql
docker compose logs frontend

# Follow logs
docker compose logs -f backend

# Last 50 lines
docker compose logs --tail=50 backend
```

---

### Reset Everything

**Clean slate restart**:
```bash
# Stop containers
docker compose down

# Remove volumes (deletes data!)
docker volume prune

# Remove images (optional)
docker image rm library-backend library-frontend mysql:8.0

# Start fresh
docker compose up --build
```

---

### Health Check

**Verify everything is working**:

```bash
# 1. Check containers running
docker compose ps
# All should show "Up"

# 2. Check database
curl -s http://localhost:3306 || echo "MySQL not responding"

# 3. Check backend health
curl http://localhost:4000/actuator/health

# 4. Check frontend
curl http://localhost:3000

# 5. Test login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## Still Not Working?

### Collect Diagnostic Information

```bash
# System info
docker --version
docker compose version
java -version
mysql --version

# Container status
docker compose ps -a
docker compose logs

# Network check
docker network ls
docker network inspect devops_project_default

# Volume check
docker volume ls
docker volume inspect devops_project_db_data
```

### Create Issue Report
Include:
- Docker version
- Error message (full stack trace)
- Steps to reproduce
- `docker compose logs` output (last 100 lines)
- Browser console errors (screenshot)
- What worked before (if applicable)

---

**Last Updated**: October 17, 2025
**Version**: 1.0
