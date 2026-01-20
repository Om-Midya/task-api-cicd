import { Request, Response } from 'express';
import * as taskService from '../services/taskService';

// GET /api/tasks
export function getTasks(req: Request, res: Response): void {
  const tasks = taskService.getAllTasks();
  res.json(tasks);
}

// GET /api/tasks/:id
export function getTask(req: Request, res: Response): void {
  const { id } = req.params;
  const task = taskService.getTaskById(id);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json(task);
}

// POST /api/tasks
export function createTask(req: Request, res: Response): void {
  const { title, description } = req.body;

  // Validate input
  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'Title is required and must be a string' });
    return;
  }

  const task = taskService.createTask({ title, description });
  res.status(201).json(task);
}

// PUT /api/tasks/:id
export function updateTask(req: Request, res: Response): void {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const task = taskService.updateTask(id, { title, description, completed });

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json(task);
}

// DELETE /api/tasks/:id
export function deleteTask(req: Request, res: Response): void {
  const { id } = req.params;
  const deleted = taskService.deleteTask(id);

  if (!deleted) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.status(204).send();
}
