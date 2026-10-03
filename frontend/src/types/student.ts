export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDTO {
  name: string;
  email: string;
  course: string;
}

export interface UpdateStudentDTO {
  name?: string;
  email?: string;
  course?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}