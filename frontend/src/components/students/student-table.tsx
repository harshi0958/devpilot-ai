'use client';

import React from 'react';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({ students, onEdit, onDelete }) => {
  if (students.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card">
        <p className="text-muted-foreground">No students found. Add your first student to get started.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="p-4 font-medium text-muted-foreground">Name</th>
            <th className="p-4 font-medium text-muted-foreground">Email</th>
            <th className="p-4 font-medium text-muted-foreground">Course</th>
            <th className="p-4 font-medium text-muted-foreground">Enrolled</th>
            <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-muted/30 transition-colors">
              <td className="p-4 font-medium text-foreground">{student.name}</td>
              <td className="p-4 text-muted-foreground">{student.email}</td>
              <td className="p-4 text-muted-foreground">{student.course}</td>
              <td className="p-4 text-muted-foreground">
                {new Date(student.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(student)}
                  aria-label="Edit student"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(student)}
                  aria-label="Delete student"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};