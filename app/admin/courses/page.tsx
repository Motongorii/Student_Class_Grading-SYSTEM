import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/login');

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      instructors: {
        include: { instructor: true }
      },
      assessments: true,
      enrollments: {
        include: { student: true }
      }
    }
  });

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-800 text-white min-h-screen p-6">
        <h2 className="text-xl font-bold mb-8">SGMS Admin</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block hover:underline">Dashboard</Link>
          <Link href="/admin/students" className="block hover:underline">Students</Link>
          <Link href="/admin/courses" className="block hover:underline text-yellow-300 font-semibold">Courses</Link>
          <Link href="/admin/instructors" className="block hover:underline">Instructors</Link>
          <Link href="/admin/audit-logs" className="block hover:underline">Audit Logs</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Manage courses, instructors, and assessments across all faculties.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Courses ({courses.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessments</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.credits}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.title.includes('Education') ? 'School of Education' :
                       course.title.includes('Engineering') ? 'School of Engineering' :
                       course.title.includes('Agriculture') ? 'School of Agriculture' :
                       course.title.includes('Computing') ? 'School of Computing' : 'General'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.instructors.map(ci => ci.instructor.name).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.enrollments.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.assessments.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{course.code} - {course.title}</h3>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Faculty: </span>
                  <span className="text-sm text-gray-900">
                    {course.title.includes('Education') ? 'School of Education' :
                     course.title.includes('Engineering') ? 'School of Engineering' :
                     course.title.includes('Agriculture') ? 'School of Agriculture' :
                     course.title.includes('Computing') ? 'School of Computing' : 'General'}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Instructors: </span>
                  <span className="text-sm text-gray-900">
                    {course.instructors.length > 0
                      ? course.instructors.map(ci => ci.instructor.name).join(', ')
                      : 'Not assigned'
                    }
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Enrolled Students: </span>
                  <span className="text-sm text-gray-900">{course.enrollments.length}</span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Assessments: </span>
                  <span className="text-sm text-gray-900">{course.assessments.length}</span>
                  {course.assessments.length > 0 && (
                    <ul className="mt-2 ml-4 list-disc list-inside text-xs text-gray-600">
                      {course.assessments.map((assessment) => (
                        <li key={assessment.id}>
                          {assessment.name} ({assessment.weight}% - Max: {assessment.maxMarks})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}