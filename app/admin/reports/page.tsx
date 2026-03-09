import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/login');

  const totalStudents = await prisma.student.count();
  const totalCourses = await prisma.course.count();
  const totalEnrollments = await prisma.enrollment.count();
  const totalGradeEntries = await prisma.gradeEntry.count();
  const totalInstructors = await prisma.user.count({ where: { role: 'INSTRUCTOR' } });

  const courseStats = await prisma.course.findMany({
    include: {
      enrollments: true,
      assessments: true,
      gradeEntrys: true
    }
  });

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-800 text-white min-h-screen p-6">
        <h2 className="text-xl font-bold mb-8">SGMS Admin</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block hover:underline">Dashboard</Link>
          <Link href="/admin/students" className="block hover:underline">Students</Link>
          <Link href="/admin/courses" className="block hover:underline">Courses</Link>
          <Link href="/admin/instructors" className="block hover:underline">Instructors</Link>
          <Link href="/admin/audit-logs" className="block hover:underline">Audit Logs</Link>
          <Link href="/admin/reports" className="block hover:underline text-yellow-300 font-semibold">Reports</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Reports</h1>
          <p className="text-gray-600">View comprehensive system statistics and analytics.</p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Students</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalStudents}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Courses</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalCourses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Instructors</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalInstructors}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Enrollments</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalEnrollments}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Grade Entries</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalGradeEntries}</p>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Course Statistics</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Entries</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courseStats.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.enrollments.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.assessments.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.gradeEntrys.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courseStats.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No courses found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
