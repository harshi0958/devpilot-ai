import { Student, CreateStudentDTO, UpdateStudentDTO, ApiResponse } from '@/types/student';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const studentApi = {
  async getStudents(): Promise<Student[]> {
    const res = await fetch(`${API_BASE_URL}/students`, {
      credentials: 'include',
    });
    const json: ApiResponse<Student[]> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.message || 'Failed to fetch students');
    }
    return json.data;
  },

  async createStudent(dto: CreateStudentDTO): Promise<Student> {
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
      credentials: 'include',
    });
    const json: ApiResponse<Student> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.message || 'Failed to create student');
    }
    return json.data;
  },

  async updateStudent(id: string, dto: UpdateStudentDTO): Promise<Student> {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
      credentials: 'include',
    });
    const json: ApiResponse<Student> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.message || 'Failed to update student');
    }
    return json.data;
  },

  async deleteStudent(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || 'Failed to delete student');
    }
  },
};