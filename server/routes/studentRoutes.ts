import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController';
// Assuming verifyJWT is available in existing middleware structure
// import { verifyJWT } from '../middleware/authMiddleware';

const router = Router();

// router.use(verifyJWT);

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;