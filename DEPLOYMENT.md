# 🚀 Deployment Guide - Mini Project Manager

## Backend Deployment on Render

### 1. Prepare Backend for Production

Create production appsettings:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=miniprojectmanager.db"
  },
  "Jwt": {
    "Key": "${JWT_SECRET_KEY}",
    "Issuer": "MiniProjectManager",
    "Audience": "MiniProjectManagerUsers"
  }
}
```

### 2. Deploy to Render

1. **Create Web Service** on Render
2. **Connect Repository**: Link your GitHub repo
3. **Configure Build Settings**:
   - **Build Command**: `dotnet publish -c Release -o out`
   - **Start Command**: `dotnet out/MiniProjectManager.dll`
   - **Environment**: `Production`

4. **Environment Variables**:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   JWT_SECRET_KEY=YourSuperSecretProductionKeyAtLeast32Characters!
   ASPNETCORE_URLS=http://0.0.0.0:$PORT
   ```

5. **Deploy**: Click "Create Web Service"

**Backend URL**: `https://your-app-name.onrender.com`

## Frontend Deployment on Vercel

### 1. Update API Configuration

Update `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-app.onrender.com/api'
  : 'http://localhost:5002/api';
```

### 2. Deploy to Vercel

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Login**: `vercel login`
3. **Deploy**: 
   ```bash
   cd frontend
   vercel --prod
   ```

**Or via Vercel Dashboard:**
1. Import GitHub repository
2. Set framework preset: **Vite**
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

**Frontend URL**: `https://your-app.vercel.app`

## 📱 Mobile Testing Checklist

### ✅ Touch-Friendly Design
- [ ] Buttons minimum 44px height
- [ ] Form inputs prevent iOS zoom (16px font)
- [ ] Touch targets well-spaced
- [ ] Swipe gestures work

### ✅ Responsive Layout
- [ ] Mobile navigation works
- [ ] Cards stack properly
- [ ] Text remains readable
- [ ] Images scale correctly

### ✅ Performance
- [ ] Fast loading on 3G
- [ ] Smooth animations
- [ ] Efficient API calls
- [ ] Proper caching

## 🔧 Production Optimizations

### Backend Optimizations
```csharp
// Add to Program.cs for production
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
    app.UseHsts();
}

// Add response compression
builder.Services.AddResponseCompression();
app.UseResponseCompression();
```

### Frontend Optimizations
```typescript
// Lazy loading for better performance
const SmartScheduler = lazy(() => import('../components/SmartScheduler'));

// Error boundaries for production
class ErrorBoundary extends Component {
  // Error handling implementation
}
```

## 🌐 Custom Domain Setup

### Backend (Render)
1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS records as instructed

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add custom domain
3. Configure DNS records

## 📊 Monitoring & Analytics

### Backend Monitoring
- Use Render's built-in logs
- Add Application Insights for detailed metrics
- Set up health check endpoints

### Frontend Analytics
- Add Google Analytics
- Monitor Core Web Vitals
- Track user interactions

## 🔒 Security Checklist

### ✅ Production Security
- [ ] HTTPS enforced
- [ ] JWT secrets are secure
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] Rate limiting implemented
- [ ] Error messages don't leak info

## 🚀 Go Live Checklist

### Pre-Launch
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API endpoints working
- [ ] Authentication flow tested
- [ ] Mobile responsiveness verified
- [ ] Loading states working
- [ ] Error handling tested

### Post-Launch
- [ ] Monitor application logs
- [ ] Check performance metrics
- [ ] Test user registration flow
- [ ] Verify Smart Scheduler API
- [ ] Monitor error rates

**Your Mini Project Manager is now production-ready!** 🎉
