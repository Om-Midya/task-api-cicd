
import { Task, CreateTaskInput, UpdateTaskInput } from '../models/task';

// In-memory task storage
let tasks: Task[] = [];

// Helper function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

//GET all tasks
export function getAllTasks(): Task[] {
  return tasks;
}

// Get a task by ID
export function getTaskById(id: string): Task | undefined {
  return tasks.find(task => task.id === id);
}

/**
 * Create a new task
 */
export function createTask(input: CreateTaskInput): Task {
  const now = new Date();
  const task: Task = {
    id: generateId(),
    title: input.title,
    description: input.description || '',
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  return task;
}

// Update an existing task
export function updateTask(id: string, input: UpdateTaskInput): Task | undefined {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return undefined;
  }

  const existingTask = tasks[taskIndex];
  const updatedTask: Task = {
    ...existingTask,
    title: input.title ?? existingTask.title,
    description: input.description ?? existingTask.description,
    completed: input.completed ?? existingTask.completed,
    updatedAt: new Date(),
  };

  tasks[taskIndex] = updatedTask;
  return updatedTask;
}

// Delete a task by ID
export function deleteTask(id: string): boolean {
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  return tasks.length < initialLength;
}

// Clear all tasks (for testing purposes)
export function clearAllTasks(): void {
  tasks = [];
}
