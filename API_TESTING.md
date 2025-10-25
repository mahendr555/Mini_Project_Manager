# API Testing Examples

## Authentication Endpoints

### Register User
```bash
curl -X POST https://localhost:7001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login User
```bash
curl -X POST https://localhost:7001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

## Project Endpoints (Requires JWT Token)

### Get All Projects
```bash
curl -X GET https://localhost:7001/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Project
```bash
curl -X POST https://localhost:7001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Project",
    "description": "This is a test project"
  }'
```

### Delete Project
```bash
curl -X DELETE https://localhost:7001/api/projects/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Task Endpoints

### Get Project Tasks
```bash
curl -X GET https://localhost:7001/api/projects/1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Task
```bash
curl -X POST https://localhost:7001/api/projects/1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete API documentation",
    "dueDate": "2024-12-31"
  }'
```

### Update Task
```bash
curl -X PUT https://localhost:7001/api/projects/1/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete API documentation - Updated",
    "dueDate": "2024-12-31",
    "isCompleted": true
  }'
```

### Delete Task
```bash
curl -X DELETE https://localhost:7001/api/projects/1/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Smart Scheduler Endpoint

### Schedule Tasks
```bash
curl -X POST https://localhost:7001/api/projects/1/schedule \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tasks": [
      {
        "taskId": 1,
        "title": "Task 1",
        "dueDate": "2024-12-31",
        "priority": 3
      },
      {
        "taskId": 2,
        "title": "Task 2",
        "priority": 1
      }
    ]
  }'
```

## Postman Collection

You can import these endpoints into Postman:

1. Create a new collection called "Mini Project Manager"
2. Add the above endpoints
3. Set up environment variables:
   - `baseUrl`: https://localhost:7001/api
   - `token`: (set after login)
4. Use `{{baseUrl}}` and `{{token}}` in your requests
