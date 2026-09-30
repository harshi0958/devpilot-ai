import { Router } from 'express';
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/student.controller';
// Assuming you have an authentication middleware protecting routes
// import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// router.use(authenticateJWT);

router.get('/', getStudents);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;