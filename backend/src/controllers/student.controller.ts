import { Request, Response, NextFunction } from 'express';
import { studentService } from '../services/student.service';

export class StudentController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const students = await studentService.getAllStudents();
      res.status(200).json({
        success: true,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const student = await studentService.getStudentById(id);

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json({
        success: true,
        data: student,
        message: 'Student created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const student = await studentService.updateStudent(id, req.body);
      res.status(200).json({
        success: true,
        data: student,
        message: 'Student updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await studentService.deleteStudent(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const studentController = new StudentController();