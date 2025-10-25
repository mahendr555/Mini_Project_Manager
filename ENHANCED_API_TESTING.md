# Enhanced Mini Project Manager - API Testing Guide

## 🚀 New Smart Scheduler API Endpoints

### 1. Generate Smart Schedule with Dependencies
```bash
POST /api/v1/projects/{projectId}/schedule
```

**Example Request:**
```bash
curl -X POST http://localhost:5002/api/v1/projects/1/schedule \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tasks": [
      {
        "title": "Design API",
        "estimatedHours": 5,
        "dueDate": "2025-10-25",
        "dependencies": []
      },
      {
        "title": "Implement Backend",
        "estimatedHours": 12,
        "dueDate": "2025-10-28",
        "dependencies": ["Design API"]
      },
      {
        "title": "Build Frontend",
        "estimatedHours": 10,
        "dueDate": "2025-10-30",
        "dependencies": ["Design API"]
      },
      {
        "title": "End-to-End Test",
        "estimatedHours": 8,
        "dueDate": "2025-10-31",
        "dependencies": ["Implement Backend", "Build Frontend"]
      }
    ],
    "workHoursPerDay": 8
  }'
```

**Example Response:**
```json
{
  "recommendedOrder": [
    "Design API",
    "Implement Backend", 
    "Build Frontend",
    "End-to-End Test"
  ],
  "timeline": [
    {
      "title": "Design API",
      "startDate": "2025-10-25T00:00:00",
      "endDate": "2025-10-25T00:00:00",
      "estimatedHours": 5,
      "dependencies": [],
      "status": "Scheduled"
    },
    {
      "title": "Implement Backend",
      "startDate": "2025-10-26T00:00:00",
      "endDate": "2025-10-27T00:00:00",
      "estimatedHours": 12,
      "dependencies": ["Design API"],
      "status": "Scheduled"
    }
  ],
  "message": "Successfully scheduled 4 tasks"
}
```

### 2. Get Quick Recommendations for Existing Tasks
```bash
GET /api/v1/projects/{projectId}/schedule/recommendations
```

**Example Request:**
```bash
curl -X GET http://localhost:5002/api/v1/projects/1/schedule/recommendations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Testing the Smart Scheduler Features

### Step 1: Register and Login
```bash
# Register
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "scheduler_user",
    "email": "scheduler@test.com",
    "password": "password123"
  }'

# Login (save the token)
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "scheduler_user",
    "password": "password123"
  }'
```

### Step 2: Create a Project
```bash
curl -X POST http://localhost:5002/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Smart Scheduler Test Project",
    "description": "Testing the enhanced scheduler features"
  }'
```

### Step 3: Test Smart Scheduling
Use the schedule endpoint with complex dependencies to see the topological sorting in action.

## 🎯 Key Features Tested

### ✅ Dependency Resolution
- **Topological Sort**: Tasks are automatically ordered based on dependencies
- **Circular Dependency Detection**: Returns error if circular dependencies exist
- **Invalid Dependencies**: Gracefully handles references to non-existent tasks

### ✅ Timeline Generation
- **Work Hours Calculation**: Estimates start/end dates based on hours per day
- **Due Date Optimization**: Prioritizes tasks with earlier due dates
- **Status Indicators**: Marks tasks as "Urgent" if timeline conflicts with due dates

### ✅ Advanced Scheduling Logic
- **Multi-level Dependencies**: Handles complex dependency chains
- **Resource Allocation**: Considers available work hours per day
- **Conflict Resolution**: Adjusts schedules when due dates are tight

## 🔧 Error Scenarios to Test

### 1. Circular Dependencies
```json
{
  "tasks": [
    {"title": "Task A", "estimatedHours": 4, "dependencies": ["Task B"]},
    {"title": "Task B", "estimatedHours": 4, "dependencies": ["Task A"]}
  ]
}
```
**Expected**: Error message about circular dependency

### 2. Invalid Dependencies
```json
{
  "tasks": [
    {"title": "Task A", "estimatedHours": 4, "dependencies": ["Non-existent Task"]}
  ]
}
```
**Expected**: Graceful handling, dependency ignored

### 3. Empty Task List
```json
{
  "tasks": []
}
```
**Expected**: "No tasks provided for scheduling"

## 📊 Frontend Integration

The enhanced frontend now includes:

1. **Smart Scheduler Modal**: Full-featured task planning interface
2. **Dependency Management**: Visual dependency input and validation
3. **Timeline Visualization**: Gantt-like display of scheduled tasks
4. **Quick Recommendations**: One-click scheduling for existing tasks
5. **Status Indicators**: Visual feedback for urgent/scheduled tasks

## 🚀 Deployment Ready

Both backend and frontend are ready for deployment with:
- Enhanced error handling
- Input validation
- Mobile-responsive design
- Production-ready API endpoints
