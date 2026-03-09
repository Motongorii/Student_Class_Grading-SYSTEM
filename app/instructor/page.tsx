import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';

export default async function InstructorPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 px-2 py-0">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 border-t-4 border-purple-400 mt-8">
        <div className="w-full flex justify-between items-center mb-2">
          <h1 className="text-3xl font-extrabold text-purple-700 tracking-tight">Instructor Dashboard</h1>
          <a href="/" className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg shadow hover:bg-purple-200 transition-all text-sm">
            ← Home
          </a>
        </div>
        <pre className="mb-2 bg-gray-100 p-2 rounded text-xs text-gray-600 w-full hidden">Session: {JSON.stringify(session, null, 2)}</pre>
        <div className="w-full bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 rounded-xl p-6 shadow flex flex-col items-start mb-4">
          <h2 className="font-bold text-lg text-purple-800 mb-1">Subject: GOVE 101 - Government</h2>
          <p className="text-gray-700">You are assigned to teach this subject. Use the options below to manage assessments and grades.</p>
        </div>
        <ul className="space-y-4 w-full">
          <li className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-purple-100">
            <span className="font-medium text-gray-800">Define Assessments</span>
            <a href="/instructor/grades?modal=assessment" className="text-purple-600 hover:underline font-semibold">Create</a>
          </li>
          <li className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-purple-100">
            <span className="font-medium text-gray-800">Enter/Approve Grades</span>
            <a href="/instructor/grades" className="text-purple-600 hover:underline font-semibold">Enter</a>
          </li>
          <li className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-purple-100">
            <span className="font-medium text-gray-800">View My Courses</span>
            <a href="/instructor/courses" className="text-purple-600 hover:underline font-semibold">View</a>
          </li>
          <li className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-purple-100">
            <span className="font-medium text-gray-800">Reports</span>
            <a href="/instructor/reports" className="text-purple-600 hover:underline font-semibold">View</a>
          </li>
        </ul>
      </div>
    </div>
  );
}