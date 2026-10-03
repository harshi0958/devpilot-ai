import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Invalid email address format').toLowerCase(),
  course: z.string().min(2, 'Course must be at least 2 characters long').max(100, 'Course cannot exceed 100 characters'),
});

export const updateStudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100, 'Name cannot exceed 100 characters').optional(),
  email: z.string().email('Invalid email address format').toLowerCase().optional(),
  course: z.string().min(2, 'Course must be at least 2 characters long').max(100, 'Course cannot exceed 100 characters').optional(),
});