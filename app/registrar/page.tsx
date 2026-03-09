
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded shadow text-red-700">
        <h2 className="font-bold text-xl mb-2">Something went wrong</h2>
        <pre className="text-xs">{error.message}</pre>
      </div>
    </div>
  );
}

export default async function RegistrarPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'REGISTRAR') {
    redirect('/login?role=REGISTRAR');
  }
  
  try {
    const totalStudents = await prisma.student.count();
    const activeStudents = await prisma.student.count({ where: { status: 'ACTIVE' } });
    const totalCourses = await prisma.course.count();

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 px-2 py-0">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 border-t-4 border-pink-400 mt-8">
          <div className="w-full flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-extrabold text-pink-700 tracking-tight">Registrar Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {session?.user?.name}</p>
            </div>
            <a href="/" className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-700 font-semibold rounded-lg shadow hover:bg-pink-200 transition-all text-sm">
              ← Home
            </a>
          </div>

          {/* Stats Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-pink-100 to-pink-200 rounded-xl p-6 shadow text-center">
              <h3 className="text-2xl font-bold text-pink-800">{totalStudents}</h3>
              <p className="text-pink-700">Total Students</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl p-6 shadow text-center">
              <h3 className="text-2xl font-bold text-indigo-800">{activeStudents}</h3>
              <p className="text-indigo-700">Active Students</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-6 shadow text-center">
              <h3 className="text-2xl font-bold text-blue-800">{totalCourses}</h3>
              <p className="text-blue-700">Total Courses</p>
            </div>
          </div>

          <div className="w-full bg-gradient-to-r from-pink-100 via-indigo-100 to-blue-100 rounded-xl p-6 shadow flex flex-col items-start mb-4">
            <h2 className="font-bold text-lg text-pink-800 mb-1">Academic Records Management</h2>
            <p className="text-gray-700">Manage student records, generate transcripts, and view comprehensive reports for all courses and students.</p>
          </div>

          {/* Registrar interactive client-side menu */}
          {
            (() => {
              const RegistrarClient = dynamic(
                () => import('../../components/RegistrarClient'),
                { ssr: false }
              );
              return <RegistrarClient />;
            })()
          }
        </div>
      </div>
    );
  } catch (error: any) {
    return <ErrorBoundary error={error} />;
  }
}