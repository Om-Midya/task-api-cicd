import express, { Application, Request, Response } from 'express';
import taskRoutes from './routes/tasks';

const app: Application = express();

app.use(express.json());

// Health check endpoint - for Docker and Kubernetes
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});


app.use('/api/tasks', taskRoutes);

// Root endpoint - simple welcome message
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Task Management API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      tasks: 'GET /api/tasks',
      task: 'GET /api/tasks/:id',
      create: 'POST /api/tasks',
      update: 'PUT /api/tasks/:id',
      delete: 'DELETE /api/tasks/:id',
    },
  });
});

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
