# Mini Project Manager - Setup Instructions

## Prerequisites

- .NET 8 SDK
- Node.js (v18 or higher)
- npm or yarn

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Restore NuGet packages:**
   ```bash
   dotnet restore
   ```

3. **Build the project:**
   ```bash
   dotnet build
   ```

4. **Run the API:**
   ```bash
   dotnet run
   ```

   The API will be available at: `https://localhost:7001`

5. **View API documentation:**
   Open `https://localhost:7001/swagger` in your browser

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:5173`

## How It Works

### Authentication Flow
1. **JWT Authentication**: Users register/login to get a JWT token
2. **Token Storage**: Frontend stores token in localStorage
3. **API Requests**: Token is sent in Authorization header for protected routes

### Database
- **SQLite**: Used for simplicity (file: `miniprojectmanager.db`)
- **Entity Framework**: Handles database operations
- **Auto-creation**: Database is created automatically on first run

### Project Structure

**Backend (.NET 8 Web API):**
- `Models/`: Database entities (User, Project, ProjectTask)
- `DTOs/`: Data transfer objects for API requests/responses
- `Services/`: Business logic (AuthService, ProjectService, TaskService)
- `Controllers/`: API endpoints (AuthController, ProjectsController)
- `Data/`: Database context (AppDbContext)

**Frontend (React + TypeScript):**
- `types/`: TypeScript interfaces
- `services/`: API client functions
- `pages/`: React components for different pages
- `components/`: Reusable UI components

### Key Features

1. **User Authentication**
   - Register new users
   - Login with username/password
   - JWT token-based authentication

2. **Project Management**
   - Create projects with title and description
   - View all user projects
   - Delete projects

3. **Task Management**
   - Add tasks to projects
   - Set due dates
   - Mark tasks as completed
   - Edit and delete tasks

4. **Smart Scheduler**
   - Auto-schedule tasks based on priority and due dates
   - Provides suggested start/end dates
   - Shows reasoning for scheduling decisions

## Testing the Application

1. **Start both backend and frontend**
2. **Open browser to** `http://localhost:5173`
3. **Register a new account**
4. **Create a project**
5. **Add some tasks**
6. **Try the auto-scheduler feature**

## Deployment Suggestions

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `dotnet publish -c Release -o out`
4. Set start command: `dotnet out/MiniProjectManager.dll`
5. Add environment variables for production JWT settings

### Frontend (Vercel)
1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set framework preset to "Vite"
4. Update API base URL in `src/services/api.ts` to your backend URL
5. Deploy

## Environment Variables

### Backend (appsettings.json)
```json
{
  "Jwt": {
    "Key": "YourProductionSecretKey",
    "Issuer": "MiniProjectManager",
    "Audience": "MiniProjectManagerUsers"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=miniprojectmanager.db"
  }
}
```

### Frontend
Update `API_BASE_URL` in `src/services/api.ts` for production:
```typescript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure backend CORS is configured for your frontend URL
2. **JWT Errors**: Check that JWT key is at least 32 characters long
3. **Database Errors**: Ensure SQLite file permissions are correct
4. **Port Conflicts**: Change ports in configuration if needed

### Development Tips

1. **Hot Reload**: Both backend and frontend support hot reload during development
2. **API Testing**: Use Swagger UI at `https://localhost:7001/swagger`
3. **Browser DevTools**: Check Network tab for API request/response details
4. **Console Logs**: Check browser console for frontend errors
