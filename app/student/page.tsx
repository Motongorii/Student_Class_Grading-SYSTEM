

import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function StudentPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'STUDENT') {
    redirect('/login?role=STUDENT');
  }

  // Get student details with enrollments
  const student = await prisma.student.findUnique({
    where: { email: session.user.email },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              faculty: true,
              instructors: { include: { instructor: true } },
              assessments: true
            }
          }
        }
      },
      gradeEntries: {
        include: {
          assessment: { include: { course: true } }
        }
      }
    }
  });

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-8 rounded shadow text-red-700">
          <h2 className="font-bold text-xl mb-2">Error</h2>
          <p>Student record not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 px-2 py-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 border-t-4 border-blue-400 mb-6">
          <div className="w-full flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Student Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome, {student?.firstName} {student?.lastName}</p>
            </div>
            <a href="/" className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-200 transition-all text-sm">
              ← Home
            </a>
          </div>
          
          {/* Student Info */}
          <div className="w-full bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-xl p-6 shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Admission Number</p>
                <p className="font-bold text-gray-900">{student?.admissionNo}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Course Program</p>
                <p className="font-bold text-gray-900">{student?.courseProgram}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Year of Study</p>
                <p className="font-bold text-gray-900">Year {student?.yearOfStudy}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href="/student/transcript"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition-all text-sm"
              >
                📄 View Transcript
              </a>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Enrolled Courses ({student?.enrollments.length || 0})</h2>
          {student?.enrollments && student.enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {student.enrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-bold text-gray-900 text-sm">{enrollment.course.code} - {enrollment.course.title}</h3>
                  <p className="text-xs text-gray-600 mt-2">Faculty: {enrollment.course.faculty.name}</p>
                  <p className="text-xs text-gray-600">Instructor: {enrollment.course.instructors?.[0]?.instructor?.name || 'Unassigned'}</p>
                  <p className="text-xs text-gray-600">Credits: {enrollment.course.credits}</p>
                  <p className="text-xs text-gray-600">Assessments: {enrollment.course.assessments.length}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No courses found. Please contact your registrar.</p>
          )}
        </div>

        {/* Grades */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading grades...</div>}>
            {
              (() => {
                const StudentGradesClient = dynamic(
                  () => import('../../components/StudentGradesClient'),
                  { ssr: false }
                );
                return <StudentGradesClient />;
              })()
            }
          </Suspense>
        </div>
      </div>
    </div>
  );
}