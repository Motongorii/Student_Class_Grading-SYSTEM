import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import AdminReportsClient from '../../../components/AdminReportsClient';
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
      assessments: true
    }
  });

  const initialData = {
    generatedAt: new Date().toISOString(),
    totalFaculties: 0,
    faculties: [],
    summary: {
      totalStudents,
      totalCourses,
      totalInstructors,
    }
  };

  const reportDetails = {
    totalStudents,
    totalCourses,
    totalEnrollments,
    totalGradeEntries,
    totalInstructors,
  };

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
        <AdminReportsClient initialData={initialData} />
      </main>
    </div>
  );
}
