import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '', department, status } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { enrollmentId: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (department) {
      whereClause.department = department;
    }

    if (status) {
      whereClause.status = status;
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where: whereClause }),
    ]);

    return res.status(200).json({
      success: true,
      data: students,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { enrollmentId, firstName, lastName, email, department, status } = req.body;

    if (!enrollmentId || !firstName || !lastName || !email || !department) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingStudent = await prisma.student.findFirst({
      where: { OR: [{ email }, { enrollmentId }] },
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or enrollment ID already exists',
      });
    }

    const student = await prisma.student.create({
      data: {
        enrollmentId,
        firstName,
        lastName,
        email,
        department,
        status: status || 'ACTIVE',
      },
    });

    return res.status(201).json({ success: true, data: student });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, department, status } = req.body;

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        department,
        status,
      },
    });

    return res.status(200).json({ success: true, data: updatedStudent });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await prisma.student.delete({ where: { id } });

    return res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};