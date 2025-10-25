# Mini Project Manager

A full-stack project management application built with .NET 8 Web API backend and React + TypeScript frontend. Features include user authentication, project management, task tracking, and smart scheduling.

![My Photo](https://github.com/mahendr555/Mini_Project_Manager/blob/main/Screenshot%20(21).png)
![My Photo](https://github.com/mahendr555/Mini_Project_Manager/blob/main/Screenshot%20(24).png)
![My Photo](https://github.com/mahendr555/Mini_Project_Manager/blob/main/Screenshot%20(22).png)
![My Photo](https://github.com/mahendr555/Mini_Project_Manager/blob/main/Screenshot%20(23).png)

## Project Structure
```
MiniProjectManager/
├── backend/                 # .NET 8 Web API
│   ├── Controllers/         # API endpoints
│   │   ├── AuthController.cs
│   │   ├── ProjectsController.cs
│   │   └── SchedulerController.cs
│   ├── Models/             # Database entities
│   │   ├── Project.cs
│   │   ├── ProjectTask.cs
│   │   └── User.cs
│   ├── DTOs/              # Data Transfer Objects
│   │   ├── AuthDTOs.cs
│   │   ├── ProjectDTOs.cs
│   │   └── SchedulerDTOs.cs
│   ├── Services/          # Business logic
│   │   ├── AuthService.cs
│   │   ├── ProjectService.cs
│   │   └── SmartSchedulerService.cs
│   └── Program.cs
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── services/     # API integration
│   │   └── types/        # TypeScript definitions
│   └── package.json
└── README.md
```

## Prerequisites

- .NET 8 SDK
- Node.js (v16 or later)
- npm or yarn
- Visual Studio Code (recommended)
- SQL Server (LocalDB or full installation)

## Backend Setup

1. **Database Setup**
   ```bash
   # Navigate to backend folder
   cd backend

   # Update database connection string in appsettings.json if needed
   # Default uses SQL Server LocalDB

   # Apply database migrations
   dotnet ef database update
   ```

2. **Install Dependencies**
   ```bash
   # Restore .NET packages
   dotnet restore
   ```

3. **Configure Settings**
   - Update `appsettings.json` with your settings
   - Configure JWT secret key in `appsettings.json`
   - Adjust CORS settings if needed

4. **Run the API**
   ```bash
   dotnet run
   # Or use Visual Studio Code's debug launch configuration
   ```
   API will be available at: `https://localhost:7001`

## Frontend Setup

1. **Install Dependencies**
   ```bash
   # Navigate to frontend folder
   cd frontend

   # Install packages
   npm install
   # or
   yarn install
   ```

2. **Configure Environment**
   ```bash
   # Create .env file
   cp .env.example .env

   # Update API URL if needed
   VITE_API_URL=https://localhost:7001
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Frontend will be available at: `http://localhost:5173`

## Features

### Authentication
- User registration with email verification
- Secure login with JWT tokens
- Password reset functionality

### Project Management
- Create, edit, and delete projects
- Assign team members to projects
- Track project progress and deadlines

### Task Management
- Create tasks within projects
- Set task priorities and deadlines
- Mark tasks as complete
- Add comments and attachments

### Smart Scheduler
- Automatic task scheduling based on priorities
- Resource allocation optimization
- Deadline conflict detection
- Work distribution balancing

### User Interface
- Responsive design with Tailwind CSS
- Dark/Light theme support
- Interactive dashboards
- Real-time updates

## Development Guidelines

### Backend
- Follow C# coding conventions
- Use async/await for database operations
- Implement proper error handling
- Write unit tests for services
- Document API endpoints

### Frontend
- Use TypeScript for type safety
- Follow React best practices
- Implement proper form validation
- Use proper state management
- Write component tests

## Deployment

### Backend
1. Publish API:
   ```bash
   dotnet publish -c Release
   ```
2. Deploy to your hosting environment
3. Update database connection strings
4. Configure SSL certificates

### Frontend
1. Build production version:
   ```bash
   npm run build
   # or
   yarn build
   ```
2. Deploy static files to web server
3. Configure environment variables
4. Set up CDN if needed

## Testing

### Backend Tests
```bash
cd backend
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm test
# or
yarn test
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details
