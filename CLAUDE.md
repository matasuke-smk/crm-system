# CRM System - Development Guide

## Overview
This is a full-stack Customer Management System (CRM) built with React.js frontend and Node.js/Express.js backend, using PostgreSQL as the database.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Local Development Setup

1. **Clone and setup project:**
   ```bash
   cd crm-system
   ```

2. **Environment Configuration:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Update the following variables in .env:
   DATABASE_URL=postgresql://username:password@localhost:5432/crm_db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. **Database Setup:**
   ```bash
   # Using Docker (recommended)
   docker-compose up postgres -d
   
   # Or manually create PostgreSQL database
   createdb crm_db
   psql crm_db < server/config/init.sql
   ```

4. **Install Dependencies:**
   ```bash
   # Backend dependencies
   cd server && npm install
   
   # Frontend dependencies
   cd ../client && npm install
   ```

5. **Start Development Servers:**
   ```bash
   # Terminal 1: Start backend server
   cd server && npm run dev
   
   # Terminal 2: Start frontend development server
   cd client && npm start
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

### Using Docker Compose (Alternative)

```bash
# Start all services (PostgreSQL, backend, frontend)
docker-compose up

# Start only database
docker-compose up postgres -d

# Stop all services
docker-compose down
```

## Available Scripts

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run tests

### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Development Workflow

### Making Changes
1. Create a new branch for your feature
2. Make your changes
3. Test locally using the development servers
4. Run linting: `npm run lint` in both client and server directories
5. Commit your changes

### Testing
- Backend: Run `npm test` in the server directory
- Frontend: Run `npm test` in the client directory
- Manual testing: Use the application at http://localhost:3000

### Database Changes
- Modify `server/config/init.sql` for schema changes
- Update models in `server/models/` accordingly
- Restart the database service to apply changes

## Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set environment variables:
   - `REACT_APP_API_URL=https://your-backend-url.com`
3. Deploy using Vercel's automatic deployment

### Backend (Render)
1. Connect your repository to Render
2. Set environment variables:
   - `DATABASE_URL` (provided by Render PostgreSQL)
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. Deploy using Render's automatic deployment

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRE` - Token expiration time (default: 7d)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS (default: http://localhost:3000)

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Ensure database exists and schema is initialized

2. **Frontend API errors:**
   - Verify backend server is running on port 5000
   - Check REACT_APP_API_URL environment variable
   - Verify CORS configuration in backend

3. **Authentication issues:**
   - Check JWT_SECRET is set and consistent
   - Verify token expiration settings
   - Clear browser localStorage if needed

4. **Build errors:**
   - Run `npm install` to ensure all dependencies are installed
   - Check for syntax errors with `npm run lint`
   - Verify Node.js version compatibility

### Logs and Debugging
- Backend logs: Check server console output
- Frontend logs: Check browser console
- Database logs: Check PostgreSQL logs
- Network requests: Use browser DevTools Network tab

## Project Structure
```
crm-system/
├── client/          # React frontend
├── server/          # Express backend
├── docs/            # Documentation
├── .env             # Environment variables
├── docker-compose.yml
└── CLAUDE.md        # This file
```

## Security Notes
- Never commit sensitive data to git
- Use environment variables for all secrets
- Keep dependencies updated
- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting for APIs

## Support
For issues or questions, check the README.md file in the docs/ directory for detailed API documentation and troubleshooting guides.