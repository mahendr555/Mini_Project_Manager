# Mini Project Manager - Beginner's Guide

## What We Built

This is a complete **full-stack web application** that allows users to manage projects and tasks. Here's what each part does:

## Backend (Server-Side) - .NET 8 Web API

### What is it?
The backend is like the "brain" of our application. It:
- Stores data in a database
- Handles user authentication (login/register)
- Provides API endpoints that the frontend can call
- Implements business logic and security

### Key Components:

**1. Models (Database Tables)**
- `User.cs`: Represents users in our system
- `Project.cs`: Represents projects that users create
- `ProjectTask.cs`: Represents tasks within projects

**2. DTOs (Data Transfer Objects)**
- These are like "containers" for data that travels between frontend and backend
- `AuthDTOs.cs`: For login/register data
- `ProjectDTOs.cs`: For project-related data
- `TaskDTOs.cs`: For task-related data

**3. Services (Business Logic)**
- `AuthService.cs`: Handles user registration, login, and JWT token creation
- `ProjectService.cs`: Manages project operations (create, read, delete)
- `TaskService.cs`: Manages task operations and the smart scheduler

**4. Controllers (API Endpoints)**
- `AuthController.cs`: Provides `/api/auth/register` and `/api/auth/login` endpoints
- `ProjectsController.cs`: Provides all project and task management endpoints

**5. Database Context**
- `AppDbContext.cs`: Tells Entity Framework how to interact with our database

### How Authentication Works:
1. User registers/logs in with username and password
2. Backend creates a JWT (JSON Web Token) - like a digital ID card
3. Frontend stores this token and sends it with every request
4. Backend verifies the token to ensure the user is authenticated

## Frontend (Client-Side) - React + TypeScript

### What is it?
The frontend is what users see and interact with. It:
- Provides a user interface (forms, buttons, pages)
- Makes API calls to the backend
- Manages user state (logged in/out, current data)
- Handles navigation between pages

### Key Components:

**1. Pages**
- `Login.tsx`: Login form
- `Register.tsx`: Registration form  
- `Dashboard.tsx`: Shows all user projects
- `ProjectDetails.tsx`: Shows tasks within a specific project

**2. Components**
- `Navbar.tsx`: Navigation bar with logout functionality
- `LoadingSpinner.tsx`: Shows loading animation

**3. Services**
- `api.ts`: Contains all functions that make HTTP requests to the backend

**4. Types**
- `index.ts`: TypeScript interfaces that define the shape of our data

### How the Frontend Works:
1. User visits the website
2. React Router determines which page to show
3. Page components make API calls to get data
4. Data is displayed in the UI
5. User interactions trigger more API calls

## Data Flow Example

Let's trace what happens when a user creates a new project:

1. **User Action**: User fills out the "Create Project" form and clicks submit
2. **Frontend**: `Dashboard.tsx` calls `projectApi.createProject()`
3. **API Call**: HTTP POST request sent to `https://localhost:7001/api/projects`
4. **Backend**: `ProjectsController.CreateProject()` receives the request
5. **Service**: Controller calls `ProjectService.CreateProjectAsync()`
6. **Database**: Service creates new Project entity and saves to database
7. **Response**: Backend sends the new project data back to frontend
8. **UI Update**: Frontend adds the new project to the list and re-renders

## Smart Scheduler Feature

This is the "enhancement" requirement. Here's how it works:

1. **Input**: User clicks "Auto Task Scheduler" button
2. **Frontend**: Sends all project tasks with priorities to backend
3. **Backend**: `TaskService.ScheduleTasksAsync()` runs a simple algorithm:
   - Sort tasks by priority (high to low)
   - Sort by due date (earliest first)
   - Assign suggested start/end dates
4. **Output**: Returns a schedule with reasoning for each task
5. **Display**: Frontend shows the suggested schedule in a nice format

## Security Features

**1. Password Hashing**
- Passwords are never stored in plain text
- We use SHA256 hashing with a salt

**2. JWT Authentication**
- Stateless authentication (no server-side sessions)
- Tokens expire after 7 days
- Each request includes the token for verification

**3. Authorization**
- Users can only see/modify their own data
- All protected endpoints check user ownership

## Database Design

**Relationships:**
- One User can have many Projects
- One Project can have many Tasks
- Foreign keys ensure data integrity

**Indexes:**
- Username and Email are indexed for fast lookups
- Unique constraints prevent duplicate users

## Why This Architecture?

**Separation of Concerns:**
- Backend handles data and business logic
- Frontend handles user interface and experience
- Each can be developed and deployed independently

**Scalability:**
- Can add more frontend clients (mobile app, etc.)
- Can scale backend independently
- Database can be upgraded without changing code

**Security:**
- API-first design makes security boundaries clear
- JWT tokens are stateless and secure
- Input validation on both frontend and backend

## Technologies Used

**Backend:**
- **.NET 8**: Modern, fast web framework
- **Entity Framework Core**: Object-relational mapping (ORM)
- **SQLite**: Lightweight database for development
- **JWT**: Industry-standard authentication

**Frontend:**
- **React**: Popular UI library
- **TypeScript**: Adds type safety to JavaScript
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing

## Next Steps for Learning

1. **Add Features**: Try adding user profiles, project sharing, or file uploads
2. **Improve UI**: Add animations, better responsive design, or dark mode
3. **Add Tests**: Write unit tests for services and components
4. **Deploy**: Deploy to cloud platforms like Render and Vercel
5. **Database**: Switch from SQLite to PostgreSQL for production
6. **Real-time**: Add SignalR for real-time updates
7. **Mobile**: Create a React Native mobile app using the same API
