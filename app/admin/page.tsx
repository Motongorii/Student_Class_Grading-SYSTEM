
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import AdminSidebar from '../../components/AdminSidebar';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import LogoutButton from '../../components/LogoutButton';

// Force dynamic rendering since this page uses getServerSession
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function AdminPage() {
  try {
    // Session check is now handled by middleware
    const session = await getServerSession(authOptions);
    if (!session) {
      return <div className="text-red-600 p-8">Not authenticated</div>;
    }

    // Get system statistics
    const totalStudents = await prisma.student.count();
    const totalUsers = await prisma.user.count();
    const totalCourses = await prisma.course.count();
    const totalFaculties = await prisma.faculty.count();
    const totalInstructors = await prisma.user.count({ where: { role: 'INSTRUCTOR' } });
    const totalRegistrars = await prisma.user.count({ where: { role: 'REGISTRAR' } });
    const totalGradeEntries = await prisma.gradeEntry.count();
    const totalEnrollments = await prisma.enrollment.count();
    
    // Get detailed data by faculty
    const faculties = await prisma.faculty.findMany({
      include: {
        courses: {
          include: {
            instructors: { include: { instructor: true } },
            assessments: true,
            enrollments: true
          }
        },
        users: { where: { role: 'INSTRUCTOR' } }
      }
    });

    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session.user.name}. Here's an overview of your system.</p>
          </div>
          <LogoutButton className="text-sm text-red-600 hover:underline" />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{totalUsers}</h3>
                <p className="text-gray-600 text-sm">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🎓</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{totalStudents}</h3>
                <p className="text-gray-600 text-sm">Students</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📚</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{totalCourses}</h3>
                <p className="text-gray-600 text-sm">Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{totalGradeEntries}</h3>
                <p className="text-gray-600 text-sm">Grade Entries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href="/admin/students" className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium">
                Manage Students ({totalStudents})
              </a>
              <a href="/admin/courses" className="block w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-medium">
                Manage Courses ({totalCourses})
              </a>
              <a href="/admin/instructors" className="block w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center font-medium">
                Manage Instructors ({totalInstructors})
              </a>
              <a href="/admin/audit-logs" className="block w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors text-center font-medium">
                View Audit Logs
              </a>
              <a href="/admin/reports" className="block w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors text-center font-medium">
                System Reports
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentAuditLogs.length > 0 ? (
                recentAuditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-600">by {log.user?.name || 'Unknown'}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-600">{totalInstructors}</h3>
              <p className="text-gray-600">Active Instructors</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600">{totalRegistrars}</h3>
              <p className="text-gray-600">Registrars</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-600">{totalCourses}</h3>
              <p className="text-gray-600">Courses Offered</p>
            </div>
          </div>
        </div>

        {/* Faculty and Coursework Details */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Faculty & Coursework Overview</h2>
          <div className="grid grid-cols-1 gap-6">
            {faculties.map((faculty) => (
              <div key={faculty.id} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{faculty.name} ({faculty.code})</h3>
                  <p className="text-gray-600 text-sm">{faculty.description}</p>
                </div>
                
                {/* Faculty Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-2xl font-bold text-blue-600">{faculty.courses?.length || 0}</p>
                    <p className="text-gray-600 text-sm">Courses</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-2xl font-bold text-green-600">{faculty.users?.length || 0}</p>
                    <p className="text-gray-600 text-sm">Instructors</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded">
                    <p className="text-2xl font-bold text-purple-600">
                      {faculty.courses?.reduce((total, course) => total + (course.enrollments?.length || 0), 0) || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Enrolled Students</p>
                  </div>
                </div>

                {/* Courses in Faculty */}
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Courses:</h4>
                  <div className="space-y-2">
                    {faculty.courses && faculty.courses.length > 0 ? (
                      faculty.courses.map((course) => {
                        const instructor = course.instructors?.[0]?.instructor;
                        return (
                          <div key={course.id} className="bg-gray-50 p-3 rounded border-l-2 border-blue-400">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-900">{course.code} - {course.title}</p>
                                <p className="text-xs text-gray-600">Credits: {course.credits}</p>
                                {instructor && (
                                  <p className="text-xs text-gray-600">Instructor: {instructor.name}</p>
                                )}
                                <p className="text-xs text-gray-600">
                                  Assessments: {course.assessments?.length || 0} | Students: {course.enrollments?.length || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-sm">No courses offered</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
    );
  } catch (error: any) {
    console.error('Admin page error:', error);
    return (
      <div className="flex min-h-screen bg-red-50 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Admin Dashboard</h2>
          <p className="text-gray-600 mb-4">{error?.message || 'An unexpected error occurred'}</p>
          <p className="text-sm text-gray-500">Check server logs for more details</p>
        </div>
      </div>
    );
  }
}
