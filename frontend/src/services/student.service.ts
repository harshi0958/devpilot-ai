import { Student, CreateStudentDTO } from '../types/student';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(`${API_URL}/students`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }

  return response.json();
}

export async function createStudent(data: CreateStudentDTO): Promise<Student> {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to create student');
  }

  return response.json();
}
