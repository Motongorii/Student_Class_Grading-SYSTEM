
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';


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
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any)?.role !== 'REGISTRAR')) redirect('/login');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 px-2 py-0">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 border-t-4 border-pink-400 mt-8">
          <div className="w-full flex justify-between items-center mb-2">
            <h1 className="text-3xl font-extrabold text-pink-700 tracking-tight">Registrar Dashboard</h1>
            <a href="/" className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-700 font-semibold rounded-lg shadow hover:bg-pink-200 transition-all text-sm">
              ← Home
            </a>
          </div>
          <pre className="mb-2 bg-gray-100 p-2 rounded text-xs text-gray-600 w-full hidden">Session: {JSON.stringify(session, null, 2)}</pre>
          <div className="w-full bg-gradient-to-r from-pink-100 via-indigo-100 to-blue-100 rounded-xl p-6 shadow flex flex-col items-start mb-4">
            <h2 className="font-bold text-lg text-pink-800 mb-1">Subject: GOVE 101 - Government</h2>
            <p className="text-gray-700">You can manage student records and generate reports for this subject.</p>
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