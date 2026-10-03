'use client';

import { useState, useEffect, useCallback } from 'react';
import { studentService, Student } from '../../../services/studentService';
import { StudentTable } from '../../../components/students/StudentTable';
import { StudentSearchFilter } from '../../../components/students/StudentSearchFilter';
import { StudentFormModal } from '../../../components/students/StudentFormModal';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await studentService.getStudents({
        page,
        limit: 10,
        search,
        department,
        status,
      });
      setStudents(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, department, status]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSave = async (data: any) => {
    try {
      if (selectedStudent) {
        await studentService.updateStudent(selectedStudent.id, data);
      } else {
        await studentService.createStudent(data);
      }
      setIsModalOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentService.deleteStudent(id);
      fetchStudents();
    } catch (err: any) {
      alert(err.message || 'Failed to delete student');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setIsModalOpen(true);
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm shadow hover:bg-primary/90"
        >
          Register Student
        </button>
      </div>

      <StudentSearchFilter
        search={search}
        setSearch={setSearch}
        department={department}
        setDepartment={setDepartment}
        status={status}
        setStatus={setStatus}
      />

      {loading ? (
        <div className="text-center py-20">Loading students...</div>
      ) : (
        <StudentTable
          students={students}
          onEdit={(student) => {
            setSelectedStudent(student);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        student={selectedStudent}
      />
    </div>
  );
}