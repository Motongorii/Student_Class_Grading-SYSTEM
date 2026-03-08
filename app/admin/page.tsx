
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { redirect } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/login');
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">Student Management</h2>
            <a href="/admin/students" className="text-blue-600 hover:underline">Add/View Students</a>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">Course Management</h2>
            <a href="/admin/courses" className="text-blue-600 hover:underline">Create/View Courses</a>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">Audit Logs</h2>
            <a href="/admin/audit-logs" className="text-blue-600 hover:underline">View Audit Logs</a>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">Reports</h2>
            <a href="/admin/reports" className="text-blue-600 hover:underline">View Reports</a>
          </div>
        </div>
      </main>
    </div>
  );
}
