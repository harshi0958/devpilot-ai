'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Student, CreateStudentDTO, UpdateStudentDTO } from '@/types/student';
import { studentApi } from '@/services/student.api';
import { StudentTable } from '@/components/students/student-table';
import { StudentFormDialog } from '@/components/students/student-form-dialog';
import { StudentDeleteDialog } from '@/components/students/student-delete-dialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getStudents();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleCreateOrUpdate = async (dto: CreateStudentDTO | UpdateStudentDTO) => {
    if (selectedStudent) {
      const updated = await studentApi.updateStudent(selectedStudent.id, dto);
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } else {
      const created = await studentApi.createStudent(dto as CreateStudentDTO);
      setStudents((prev) => [created, ...prev]);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    await studentApi.deleteStudent(studentToDelete.id);
    setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground mt-1">Manage registered students, courses, and accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={fetchStudents} aria-label="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={() => {
              setSelectedStudent(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Student
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchStudents}>
            Retry
          </Button>
        </div>
      )}

      {loading && students.length === 0 ? (
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded-lg animate-pulse" />
          <div className="h-16 bg-muted rounded-lg animate-pulse" />
          <div className="h-16 bg-muted rounded-lg animate-pulse" />
        </div>
      ) : (
        <StudentTable
          students={students}
          onEdit={(student) => {
            setSelectedStudent(student);
            setIsFormOpen(true);
          }}
          onDelete={(student) => {
            setStudentToDelete(student);
            setIsDeleteOpen(true);
          }}
        />
      )}

      <StudentFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
        student={selectedStudent}
      />

      <StudentDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        student={studentToDelete}
      />
    </div>
  );
}