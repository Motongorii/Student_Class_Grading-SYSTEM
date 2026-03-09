
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LogoutButton from '../../../components/LogoutButton';

export default async function InstructorGradesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'INSTRUCTOR') redirect('/login');
  // TODO: Fetch courses, students, assessments for this instructor
  // TODO: Render UI for entering grades (modal or inline)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 px-2 py-0">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 border-t-4 border-purple-400 mt-8">
        <div className="w-full flex justify-between items-center mb-2">
          <h1 className="text-3xl font-extrabold text-purple-700 tracking-tight">Enter Grades</h1>
          <div className="flex items-center gap-2">
            <a href="/instructor" className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg shadow hover:bg-purple-200 transition-all text-sm">
              ← Back to Dashboard
            </a>
            <LogoutButton />
          </div>
        </div>
        <div className="w-full">
          {/* Grade entry UI and modal */}
          <Suspense fallback={<div>Loading grade entry UI...</div>}>
            {/** Dynamically import the client component for grade entry */}
            {/* dynamic returns a component which we render */}
            {
              (() => {
                const GradeEntryClient = dynamic(
                  () => import('../../../components/InstructorGradeEntryClient'),
                  { ssr: false }
                );
                return <GradeEntryClient />;
              })()
            }
          </Suspense>
        </div>
      </div>
    </div>
  );
}
