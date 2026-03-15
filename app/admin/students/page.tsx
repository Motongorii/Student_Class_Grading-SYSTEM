import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/login');
  const students = await prisma.student.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Students</h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2">Admission No</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Program</th>
            <th className="px-4 py-2">Year</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} className="border-t">
              <td className="px-4 py-2">{student.admissionNo}</td>
              <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2">{student.courseProgram}</td>
              <td className="px-4 py-2">{student.yearOfStudy}</td>
              <td className="px-4 py-2">{student.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
