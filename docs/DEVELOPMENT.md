# Development Guide

## Getting Started with Development

This guide will help you set up the development environment and understand the codebase structure.

## Prerequisites

- Node.js 18+
- npm 8+
- Git
- MongoDB (for local development)
- Code editor (VS Code recommended)

## Initial Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd sakap-agri-assist
   npm run install:all
   ```

2. **Environment Setup**
   
   Copy `.env.example` files and configure:
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env
   
   # Backend
   cp backend/.env.example backend/.env
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## Project Architecture

### Frontend Architecture

**Component Structure:**
```
src/components/
├── dashboards/     # Role-specific dashboard components
├── ui/            # Reusable UI components (shadcn/ui)
├── FloatingChatbot.tsx
└── Navigation.tsx
```

**Key Patterns:**
- Component-based architecture
- Custom hooks for reusable logic
- TypeScript for type safety
- Tailwind CSS for styling

### Backend Architecture

**Layered Architecture:**
```
src/
├── controllers/   # Handle HTTP requests/responses
├── routes/       # Define API endpoints
├── middleware/   # Express middleware
├── models/       # Data models
├── services/     # Business logic
└── utils/        # Helper functions
```

## Development Workflow

### Frontend Development

1. **Component Development**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Adding New Components**
   - Use shadcn/ui components when possible
   - Follow existing naming conventions
   - Add TypeScript types
   - Include responsive design

3. **State Management**
   - Use React Query for server state
   - Use local state for UI state
   - Use sessionStorage for user persistence

### Backend Development

1. **API Development**
   ```bash
   cd backend
   npm run dev
   ```

2. **Adding New Endpoints**
   - Create controller methods
   - Define routes
   - Add middleware if needed
   - Update API documentation

3. **Database Integration**
   - Define models in `/models`
   - Use services for business logic
   - Handle errors appropriately

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use shared types from `/shared/types`

### React Components
```tsx
// Good component structure
interface ComponentProps {
  title: string;
  onAction: () => void;
}

export const Component: React.FC<ComponentProps> = ({ 
  title, 
  onAction 
}) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

### API Controllers
```typescript
// Good controller structure
export class Controller {
  static async methodName(req: Request, res: Response) {
    try {
      // Business logic
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error message',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
```

## Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
npm run test
```

## Debugging

### Frontend Debugging
- Use React Developer Tools
- Enable VITE_DEBUG_MODE in .env
- Use browser developer tools

### Backend Debugging
- Use Node.js debugger
- Add console.log statements
- Use Postman for API testing

## Common Tasks

### Adding a New Page
1. Create component in `/frontend/src/pages`
2. Add route in `App.tsx`
3. Update navigation if needed

### Adding a New API Endpoint
1. Create controller method
2. Add route definition
3. Update API documentation
4. Test with Postman

### Adding New Shared Types
1. Define in `/shared/types/index.ts`
2. Export from index
3. Import in frontend/backend as needed

## Performance Considerations

### Frontend
- Use React.memo for expensive components
- Optimize images and assets
- Use code splitting for large pages

### Backend
- Implement proper error handling
- Use database indexing
- Cache frequently accessed data

## Security Best Practices

### Frontend
- Validate all user inputs
- Sanitize data before display
- Use HTTPS in production

### Backend
- Validate request data
- Use JWT for authentication
- Implement rate limiting
- Sanitize database queries

## Deployment

### Development Deployment
```bash
npm run build
```

### Docker Deployment
```bash
npm run docker:up
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in configuration
2. **Module not found**: Run `npm install`
3. **Database connection**: Check MongoDB status
4. **CORS issues**: Verify CORS configuration

### Getting Help

- Check existing documentation
- Review error logs
- Test with minimal examples
- Ask team members

## Contributing

1. Follow existing code patterns
2. Write tests for new features
3. Update documentation
4. Submit pull requests with clear descriptions