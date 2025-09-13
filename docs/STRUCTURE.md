# Project Structure

## Overview

This document outlines the complete project structure after the frontend-backend separation reorganization.

## Root Directory Structure

```
sakap-agri-assist/
├── frontend/                    # React/Vite frontend application
├── backend/                     # Node.js/Express backend API
├── shared/                      # Shared types and constants
├── docs/                        # Documentation
├── scripts/                     # Development and deployment scripts
├── package.json                 # Root workspace configuration
├── docker-compose.yml          # Container orchestration
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## Frontend Structure (`/frontend`)

```
frontend/
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── dashboards/         # Role-specific dashboards
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AEWDashboard.tsx
│   │   │   └── PublicDashboard.tsx
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── [50+ UI components]
│   │   ├── FloatingChatbot.tsx # Floating chatbot component
│   │   └── Navigation.tsx      # Main navigation
│   ├── pages/                  # Page components
│   │   ├── Activities.tsx
│   │   ├── Chatbot.tsx
│   │   ├── ChatbotQA.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ELibrary.tsx
│   │   ├── Index.tsx
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── News.tsx
│   │   ├── NotFound.tsx
│   │   └── UserManagement.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                    # Utility functions
│   │   └── utils.ts
│   ├── App.tsx                 # Main App component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
│   ├── robots.txt
│   └── [images/icons]
├── .env                       # Environment variables
├── Dockerfile                 # Frontend container config
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
└── [other config files]
```

## Backend Structure (`/backend`)

```
backend/
├── src/                       # Source code
│   ├── controllers/           # Request handlers
│   │   ├── AuthController.ts
│   │   ├── ChatbotController.ts
│   │   ├── ContentController.ts
│   │   └── UserController.ts
│   ├── routes/               # API route definitions
│   │   ├── auth.ts
│   │   ├── chatbot.ts
│   │   ├── content.ts
│   │   └── users.ts
│   ├── middleware/           # Express middleware
│   │   ├── errorHandler.ts
│   │   └── notFound.ts
│   ├── models/              # Data models (to be implemented)
│   ├── services/            # Business logic (to be implemented)
│   ├── utils/               # Helper functions (to be implemented)
│   └── index.ts             # Server entry point
├── tests/                   # Test files
├── .env                     # Environment variables
├── Dockerfile              # Backend container config
├── package.json            # Backend dependencies
└── tsconfig.json           # TypeScript configuration
```

## Shared Structure (`/shared`)

```
shared/
├── types/                   # TypeScript type definitions
│   └── index.ts            # All shared types and interfaces
└── constants/              # Shared constants and enums
    └── index.ts            # API endpoints, error messages, etc.
```

## Documentation (`/docs`)

```
docs/
├── API.md                  # API documentation
├── DEVELOPMENT.md          # Development guide
└── STRUCTURE.md           # This file
```

## Scripts (`/scripts`)

```
scripts/
├── setup-dev.sh           # Linux/Mac setup script
└── setup-dev.bat          # Windows setup script
```

## Key Features of the New Structure

### ✅ Benefits

1. **Clear Separation**: Frontend and backend are completely separated
2. **Shared Resources**: Common types and constants are shared between frontend and backend
3. **Independent Development**: Teams can work on frontend and backend independently
4. **Scalable**: Easy to add new services or frontend applications
5. **Docker Ready**: Full container support for development and production
6. **Workspace Management**: Root package.json manages both projects

### 🔧 Development Workflow

1. **Full Stack Development**:
   ```bash
   npm run dev  # Starts both frontend and backend
   ```

2. **Frontend Only**:
   ```bash
   npm run dev:frontend
   ```

3. **Backend Only**:
   ```bash
   npm run dev:backend
   ```

### 🚀 Deployment Options

1. **Traditional Deployment**: Deploy frontend and backend separately
2. **Container Deployment**: Use Docker Compose for full stack deployment
3. **Cloud Deployment**: Deploy to cloud services independently

### 📱 Port Configuration

- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:5000
- **API**: http://localhost:5000/api

### 🔄 API Communication

- Frontend communicates with backend via REST API
- Proxy configuration in Vite for seamless development
- CORS configured for cross-origin requests

## Migration Notes

### What Was Moved

1. **All React code** → `frontend/src/`
2. **Frontend config files** → `frontend/`
3. **Environment variables** → Updated for API communication
4. **Vite configuration** → Added backend proxy and shared types alias

### What Was Created

1. **Complete backend structure** with Express.js
2. **Shared types and constants** for type safety
3. **Docker configuration** for containerized development
4. **Documentation** for API and development
5. **Setup scripts** for easy onboarding

### Breaking Changes

- **Import paths**: Shared types now imported from `@shared/types`
- **API calls**: Frontend now calls backend API endpoints
- **Environment variables**: Updated for new structure

## Team Navigation

### Frontend Team
- Work primarily in `frontend/` directory
- Use shared types from `shared/types/`
- API integration via `frontend/src/lib/api.ts` (to be created)

### Backend Team  
- Work primarily in `backend/` directory
- Use shared types and constants
- Implement controllers, models, and services

### Full Stack Developers
- Can work across all directories
- Use root workspace commands for development
- Understand the complete architecture