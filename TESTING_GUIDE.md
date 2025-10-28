# Testing Guide for Personal Library Management System

## Manual Testing Checklist

### Authentication Flow
- [ ] **Register New User**
  - Navigate to `http://localhost:3000/register`
  - Enter: username, email, password, confirm password
  - Expected: Redirect to dashboard or login page
  - Check: User created in database

- [ ] **Login with Existing User**
  - Navigate to `http://localhost:3000/login`
  - Use credentials: `admin` / `admin123`
  - Expected: Redirect to dashboard
  - Check: authToken stored in localStorage

- [ ] **Invalid Credentials**
  - Login with wrong password
  - Expected: Error message displayed
  - Check: Not logged in

- [ ] **Logout**
  - Click logout button on dashboard
  - Expected: Redirect to login page
  - Check: authToken removed from localStorage

### Dashboard Operations
- [ ] **View Books**
  - Books should load from API
  - Expected: All user's books displayed
  - Check: Network request to `/api/books`

- [ ] **Add New Book**
  - Click "+ Add Book" button
  - Fill in: title, author, description, optional image
  - Click "Add Book"
  - Expected: Modal closes, book appears in list
  - Check: POST request to `/api/books`

- [ ] **Edit Book**
  - Click "Edit" on any book
  - Change: title or author
  - Click "Update Book"
  - Expected: Book updated in list
  - Check: PUT request to `/api/books/{id}`

- [ ] **Delete Book**
  - Click "Delete" on any book
  - Confirm deletion
  - Expected: Book removed from list
  - Check: DELETE request to `/api/books/{id}`

### UI/UX Testing
- [ ] **Responsive Design**
  - Test on mobile (use browser DevTools)
  - Test on tablet
  - Test on desktop
  - Expected: Proper layout on all screens

- [ ] **Loading States**
  - Verify loading spinner shows while fetching
  - Expected: Smooth user experience

- [ ] **Error Handling**
  - Disconnect from network
  - Try to perform operations
  - Expected: Proper error messages

- [ ] **Navigation**
  - Test all navigation paths
  - Test back button
  - Expected: No broken links

---

## API Testing (Postman/cURL)

### 1. Register New User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response will contain**: `token`, `message`, `userId`

### 3. Get All Books (Requires Token)
```bash
curl -X GET http://localhost:4000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Add New Book
```bash
curl -X POST http://localhost:4000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=The Hobbit" \
  -F "author=J.R.R. Tolkien" \
  -F "description=A fantasy adventure" \
  -F "image=@/path/to/image.jpg"
```

### 5. Update Book
```bash
curl -X PUT http://localhost:4000/api/books/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=The Hobbit (Updated)" \
  -F "author=J.R.R. Tolkien" \
  -F "description=Updated description"
```

### 6. Delete Book
```bash
curl -X DELETE http://localhost:4000/api/books/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Database Testing

### Connect to MySQL
```bash
mysql -h localhost -u libraryuser -p librarydb
```

### Verify Tables
```sql
SHOW TABLES;
DESCRIBE users;
DESCRIBE books;
SELECT * FROM users;
SELECT * FROM books;
```

### Check Relationships
```sql
SELECT b.*, u.username 
FROM books b 
JOIN users u ON b.user_id = u.id;
```

---

## Performance Testing

### Test with Load
```bash
# Install Apache Bench (ab)
# macOS: brew install httpd
# Linux: sudo apt-get install apache2-utils
# Windows: Use WSL

# Test login endpoint (10 requests, 5 concurrent)
ab -n 10 -c 5 http://localhost:4000/api/auth/login

# Test books endpoint
ab -n 100 -c 10 http://localhost:4000/api/books
```

---

## Browser DevTools Testing

### Network Tab
- [ ] All requests return 200/201/204 status
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] Response times under 1 second
- [ ] Check Authorization headers present

### Console Tab
- [ ] No JavaScript errors
- [ ] No warnings
- [ ] Proper error messages logged

### Application Tab (Storage)
- [ ] localStorage contains `authToken`
- [ ] localStorage contains `username`
- [ ] Cookies (if any) properly set

### Performance Tab
- [ ] Page load time < 3 seconds
- [ ] No memory leaks
- [ ] Smooth animations

---

## Security Testing

- [ ] **Token Validation**
  - Try request without token → 401 error
  - Try request with invalid token → 401 error
  - Try request with expired token → 401 error

- [ ] **CORS Testing**
  - Request from wrong origin → denied
  - Request from localhost → allowed

- [ ] **File Upload Security**
  - Try uploading non-image file → rejected
  - Try uploading large file (>10MB) → rejected
  - Try uploading valid image → accepted

- [ ] **SQL Injection Prevention**
  - Try username: `' OR '1'='1`
  - Expected: No results or error
  - Check: Queries use parameterized statements

---

## Automated Testing

### Backend Unit Tests
```bash
cd Backend
mvn test
```

### Frontend Unit Tests
```bash
cd frontend/frontend
npm test
```

### Integration Tests
```bash
# Full stack test (Docker)
docker compose up -d
npm run test:integration
docker compose down
```

---

## Deployment Testing

### Docker Image Build
```bash
# Backend
docker build -t library-backend ./Backend

# Frontend
docker build -t library-frontend ./frontend/frontend
```

### Docker Compose Stack
```bash
docker compose build
docker compose up -d
docker compose logs -f

# Verify services
docker compose ps

# Health checks
curl http://localhost:4000/actuator/health
curl http://localhost:3000
```

---

## Bug Report Template

```
Title: [Component] Brief description

Severity: [Critical/High/Medium/Low]

Steps to Reproduce:
1. 
2. 
3. 

Expected Result:

Actual Result:

Environment:
- OS: 
- Browser: 
- Docker: 
- Backend running: yes/no
- Frontend running: yes/no

Screenshots/Logs:
```

---

## Success Criteria

✅ All manual tests pass
✅ All API endpoints respond correctly
✅ Database operations work as expected
✅ No console errors
✅ Responsive design works
✅ Performance is acceptable
✅ Security checks passed
✅ Error handling is proper

---

## Continuous Integration/Continuous Deployment

### GitHub Actions Workflow (Optional)
```yaml
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Backend
        run: cd Backend && mvn clean install
      - name: Build Frontend
        run: cd frontend/frontend && npm install && npm run build
      - name: Run Tests
        run: cd Backend && mvn test
```

---

**Last Updated**: October 17, 2025
**Next Review**: After next release
