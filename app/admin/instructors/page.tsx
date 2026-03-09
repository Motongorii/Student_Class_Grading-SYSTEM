import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

export default async function InstructorsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/login');

  const instructors = await prisma.user.findMany({
    where: { role: 'INSTRUCTOR' },
    include: {
      courseInstructor: {
        include: { course: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-800 text-white min-h-screen p-6">
        <h2 className="text-xl font-bold mb-8">SGMS Admin</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block hover:underline">Dashboard</Link>
          <Link href="/admin/students" className="block hover:underline">Students</Link>
          <Link href="/admin/courses" className="block hover:underline">Courses</Link>
          <Link href="/admin/instructors" className="block hover:underline text-yellow-300 font-semibold">Instructors</Link>
          <Link href="/admin/audit-logs" className="block hover:underline">Audit Logs</Link>
          <Link href="/admin/reports" className="block hover:underline">Reports</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Management</h1>
          <p className="text-gray-600">View and manage instructors across all faculties.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Instructors ({instructors.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses Assigned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {instructors.map((instructor) => (
                  <tr key={instructor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{instructor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{instructor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.courseInstructor.length} courses</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {instructors.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No instructors found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
