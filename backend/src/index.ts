import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import contentRoutes from './routes/content';
import chatbotRoutes from './routes/chatbot';

const app = express();
const PORT = process.env.PORT || 5030;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:8080', 'http://localhost:8081'] : ['http://localhost:8080', 'http://localhost:8081'],
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug logging for uploads directory
const uploadsPath = path.join(__dirname, '..', 'uploads');
console.log('Current working directory:', process.cwd());
console.log('__dirname in index.ts:', __dirname);
console.log('Uploads directory path:', uploadsPath);
console.log('Uploads directory exists:', require('fs').existsSync(uploadsPath));

// Serve static files from uploads directory (corrected path)
// The uploads directory is in the parent directory of src
app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'SAKAP Agricultural Assistance API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SAKAP Agricultural Assistance API server running on port ${PORT}`);
  console.log(`🌐 Health check available at http://localhost:${PORT}/health`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying ${Number(PORT) + 1}...`);
    const newPort = Number(PORT) + 1;
    app.listen(newPort, () => {
      console.log(`🚀 SAKAP Agricultural Assistance API server running on port ${newPort}`);
      console.log(`🌐 Health check available at http://localhost:${newPort}/health`);
    }).on('error', (err: any) => {
      console.error('Failed to start server on multiple ports:', err);
      process.exit(1);
    });
  } else {
    console.error(err);
  }
});

export default app;