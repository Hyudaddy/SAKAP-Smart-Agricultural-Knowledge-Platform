# SAKAP Agricultural Assistance Platform

A comprehensive web application providing agricultural assistance and resources to farmers, Agricultural Extension Workers (AEWs), and administrators.

## 🌾 Project Overview

SAKAP is a full-stack agricultural assistance platform that helps farmers access information, connect with experts, and manage their agricultural activities through an intuitive web interface.

### Key Features

- **Role-based Dashboards**: Tailored interfaces for Admin, AEW, and Public users
- **Intelligent Chatbot**: AI-powered assistant with offline fallback
- **E-Library**: Comprehensive collection of agricultural resources
- **News & Activities**: Latest updates and community events
- **User Management**: Complete user administration system

## 🏗️ Architecture

This project follows a **frontend-backend separation** architecture:

```
sakap-agri-assist/
├── frontend/           # React + TypeScript + Vite
├── backend/            # Node.js + Express + TypeScript
├── shared/            # Shared types and constants
├── docs/              # Documentation
├── scripts/           # Build and deployment scripts
└── docker-compose.yml # Container orchestration
```

### Technology Stack

**Frontend:**
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19
- Tailwind CSS 3.4.17
- shadcn/ui components
- React Query for state management

**Backend:**
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Google Gemini AI integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+
- MongoDB (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sakap-agri-assist
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Frontend (.env in frontend/ directory):**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```
   
   **Backend (.env in backend/ directory):**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sakap-agri-assist
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:8080
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:8080
   - Backend: http://localhost:5000

## 📁 Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── dashboards/    # Role-specific dashboard components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── FloatingChatbot.tsx
│   │   └── Navigation.tsx
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── public/                # Static assets
└── [config files]
```

### Backend Structure
```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── routes/           # API route definitions
│   ├── middleware/       # Express middleware
│   ├── models/           # Data models
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
├── tests/                # Test files
└── [config files]
```

### Shared Structure
```
shared/
├── types/                # TypeScript type definitions
└── constants/            # Shared constants and enums
```

## 🔧 Development

### Available Scripts

**Root Level:**
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run test` - Run all tests
- `npm run lint` - Lint all code

**Frontend:**
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production

**Backend:**
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production

### Development Workflow

1. **Frontend Development**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Backend Development**
   ```bash
   cd backend
   npm run dev
   ```

3. **Full Stack Development**
   ```bash
   npm run dev  # From root directory
   ```

## 🐳 Docker Development

### Using Docker Compose

1. **Build and start services**
   ```bash
   npm run docker:up
   ```

2. **View logs**
   ```bash
   npm run docker:logs
   ```

3. **Stop services**
   ```bash
   npm run docker:down
   ```

## 🔐 Authentication & Authorization

The application uses JWT-based authentication with role-based access control:

- **Admin**: Full system access, user management
- **AEW (Agricultural Extension Worker)**: Content management, user support
- **Public**: Basic access to resources and chatbot

## 🤖 Chatbot Integration

The platform features an intelligent chatbot with dual operation modes:

- **Online Mode**: Google Gemini AI integration
- **Offline Mode**: Rule-based responses for reliability

## 📱 Responsive Design

The application is fully responsive and works across:
- Desktop computers
- Tablets
- Mobile devices

## 🧪 Testing

### Running Tests

```bash
# All tests
npm run test

# Frontend tests only
npm run test:frontend

# Backend tests only
npm run test:backend
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Configuration

Ensure production environment variables are set:

**Frontend:**
- `VITE_API_BASE_URL`: Production API URL
- `VITE_GEMINI_API_KEY`: Production Gemini API key

**Backend:**
- `PORT`: Server port
- `MONGODB_URI`: Production database URI
- `JWT_SECRET`: Strong JWT secret
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React and the React community
- shadcn/ui for beautiful components
- Google Gemini AI for intelligent chatbot capabilities
- The agricultural community for inspiration and requirements

---

For more detailed documentation, see the [docs/](docs/) directory.