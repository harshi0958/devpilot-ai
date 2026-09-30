import { Router } from 'express';
import { 
  getStudents, 
  createStudent, 
  updateStudent, 
  deleteStudent 
} from '../controllers/student.controller';
import { authenticateJWT } from '../middleware/auth.middleware'; // Reuse existing auth

const router = Router();

// Protect routes using existing DevPilot JWT auth middleware
router.get('/', authenticateJWT, getStudents);
router.post('/', authenticateJWT, createStudent);
router.put('/:id', authenticateJWT, updateStudent);
router.delete('/:id', authenticateJWT, deleteStudent);

export default router;