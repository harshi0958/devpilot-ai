import { Student } from '../../services/studentService';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentTable = ({ students, onEdit, onDelete }: StudentTableProps) => {
  if (students.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-background text-muted-foreground">
        No students found.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <table className="w-full text-left border-collapse">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="p-3 font-semibold text-sm">Enrollment ID</th>
            <th className="p-3 font-semibold text-sm">Name</th>
            <th className="p-3 font-semibold text-sm">Email</th>
            <th className="p-3 font-semibold text-sm">Department</th>
            <th className="p-3 font-semibold text-sm">Status</th>
            <th className="p-3 font-semibold text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b hover:bg-muted/30">
              <td className="p-3 text-sm font-mono">{student.enrollmentId}</td>
              <td className="p-3 text-sm font-medium">
                {student.firstName} {student.lastName}
              </td>
              <td className="p-3 text-sm text-muted-foreground">{student.email}</td>
              <td className="p-3 text-sm">{student.department}</td>
              <td className="p-3 text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    student.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : student.status === 'GRADUATED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {student.status}
                </span>
              </td>
              <td className="p-3 text-sm text-right space-x-2">
                <button
                  onClick={() => onEdit(student)}
                  className="text-primary hover:underline font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(student.id)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};