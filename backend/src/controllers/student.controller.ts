import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const students = await prisma.student.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(students);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch students' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, age, course, projectId } = req.body;

    if (!name || !email || !age || !course || !projectId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const student = await prisma.student.create({
      data: { name, email, age: Number(age), course, projectId },
    });

    return res.status(201).json(student);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Student with this email already exists' });
    }
    return res.status(500).json({ error: 'Failed to create student' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, age, course } = req.body;

    const student = await prisma.student.update({
      where: { id },
      data: { name, email, age: age ? Number(age) : undefined, course },
    });

    return res.json(student);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update student' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete student' });
  }
};