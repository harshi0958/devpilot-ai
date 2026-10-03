import prisma from '../config/prisma';
import { Student } from '@prisma/client';

export class StudentService {
  async getAllStudents(): Promise<Student[]> {
    return prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStudentById(id: string): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { id },
    });
  }

  async createStudent(data: { name: string; email: string; course: string }): Promise<Student> {
    try {
      return await prisma.student.create({
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const customError: any = new Error('A student with this email already exists.');
        customError.statusCode = 409;
        throw customError;
      }
      throw error;
    }
  }

  async updateStudent(id: string, data: { name?: string; email?: string; course?: string }): Promise<Student> {
    try {
      return await prisma.student.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        const customError: any = new Error('Student not found.');
        customError.statusCode = 404;
        throw customError;
      }
      if (error.code === 'P2002') {
        const customError: any = new Error('A student with this email already exists.');
        customError.statusCode = 409;
        throw customError;
      }
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      await prisma.student.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        const customError: any = new Error('Student not found.');
        customError.statusCode = 404;
        throw customError;
      }
      throw error;
    }
  }
}

export const studentService = new StudentService();