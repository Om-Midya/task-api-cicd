/**
 * Task API Tests
 *
 * These tests verify our API endpoints work correctly.
 * We use 'supertest' to make HTTP requests to our Express app.
 *
 * Test Structure:
 * - describe(): Groups related tests together
 * - beforeEach(): Runs before each test (cleanup)
 * - it() or test(): Individual test cases
 * - expect(): Assertions (what we expect to happen)
 */

import request from 'supertest';
import app from '../src/app';
import { clearAllTasks } from '../src/services/taskService';

// Run before each test to ensure clean state
beforeEach(() => {
  clearAllTasks();
});

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.timestamp).toBeDefined();
  });
});

describe('Root Endpoint', () => {
  it('should return API information', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task Management API');
    expect(response.body.version).toBe('1.0.0');
  });
});

describe('Task API', () => {
  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all tasks', async () => {
      // First create a task
      await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task' });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Test Task');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'New Task',
          description: 'Task description',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe('New Task');
      expect(response.body.description).toBe('Task description');
      expect(response.body.completed).toBe(false);
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Title is required');
    });

    it('should create task with empty description if not provided', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Title Only' });

      expect(response.status).toBe(201);
      expect(response.body.description).toBe('');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by ID', async () => {
      // First create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Find Me' });
      const taskId = createResponse.body.id;

      const response = await request(app).get(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Find Me');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).get('/api/tasks/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      // First create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original' });
      const taskId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({
          title: 'Updated',
          completed: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated');
      expect(response.body.completed).toBe(true);
    });

    it('should return 404 when updating non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/nonexistent')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      // First create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Delete Me' });
      const taskId = createResponse.body.id;

      const response = await request(app).delete(`/api/tasks/${taskId}`);

      expect(response.status).toBe(204);

      // Verify task is deleted
      const getResponse = await request(app).get(`/api/tasks/${taskId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent task', async () => {
      const response = await request(app).delete('/api/tasks/nonexistent');

      expect(response.status).toBe(404);
    });
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Not found');
  });
});
