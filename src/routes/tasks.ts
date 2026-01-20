import { Router } from 'express';
import * as taskController from '../controllers/taskController';

const router = Router();

// Define routes and connect them to controller functions
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
