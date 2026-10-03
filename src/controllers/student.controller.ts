import { Request, Response } from 'express';
import prisma from '../../backend/src/config/prisma';

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: students });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { enrollmentId, firstName, lastName, email, department, status } = req.body;
    
    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Student with this email already exists' });
    }

    const student = await prisma.student.create({
      data: { enrollmentId, firstName, lastName, email, department, status: status || 'ACTIVE' },
    });

    return res.status(201).json({ success: true, data: student });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to create student' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, department, status } = req.body;

    const student = await prisma.student.update({
      where: { id },
      data: { firstName, lastName, email, department, status },
    });

    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    return res.status(404).json({ success: false, error: 'Student not found or update failed' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { id } });

    return res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    return res.status(404).json({ success: false, error: 'Student not found' });
  }
};