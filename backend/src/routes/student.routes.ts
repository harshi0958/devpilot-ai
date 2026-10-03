import { Router } from 'express';
import { studentController } from '../controllers/student.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { createStudentSchema, updateStudentSchema } from '../validations/student.validation';

const router = Router();

router.get('/', studentController.getAll);
router.get('/:id', studentController.getById);
router.post('/', validateBody(createStudentSchema), studentController.create);
router.put('/:id', validateBody(updateStudentSchema), studentController.update);
router.delete('/:id', studentController.delete);

export default router;