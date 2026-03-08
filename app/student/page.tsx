

import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

export default async function StudentPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'STUDENT') redirect('/login');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 px-2 py-0">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 border-t-4 border-blue-400 mt-8">
        <div className="w-full flex justify-between items-center mb-2">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Student Dashboard</h1>
          <a href="/" className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-200 transition-all text-sm">
            ← Home
          </a>
        </div>
        <div className="w-full bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-xl p-6 shadow flex flex-col items-start mb-4">
          <h2 className="font-bold text-lg text-blue-800 mb-1">Subject: GOVE 101 - Government</h2>
          <p className="text-gray-700">You are enrolled in this subject. Use the options below to view your results and transcript.</p>
          <div className="mt-4 flex gap-3">
            <a
              href="/student/transcript"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition-all text-sm"
            >
              📄 View Transcript
            </a>
          </div>
        </div>
        {/* Grades Table */}
        <Suspense fallback={<div>Loading grades...</div>}>
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
        {/* Future: Transcript and Courses */}
      </div>
    </div>
  );
}