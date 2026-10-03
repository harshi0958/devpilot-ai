const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Student {
  id: string;
  enrollmentId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED';
  createdAt: string;
  updatedAt: string;
}

export interface GetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: string;
}

export interface StudentsResponse {
  success: boolean;
  data: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const studentService = {
  async getStudents(params: GetStudentsParams = {}): Promise<StudentsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.department) query.append('department', params.department);
    if (params.status) query.append('status', params.status);

    const res = await fetch(`${API_URL}/api/students?${query.toString()}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async getStudentById(id: string): Promise<{ success: boolean; data: Student }> {
    const res = await fetch(`${API_URL}/api/students/${id}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch student details');
    return res.json();
  },

  async createStudent(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: Student }> {
    const res = await fetch(`${API_URL}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create student');
    }
    return res.json();
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<{ success: boolean; data: Student }> {
    const res = await fetch(`${API_URL}/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update student');
    }
    return res.json();
  },

  async deleteStudent(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_URL}/api/students/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete student');
    return res.json();
  },
};