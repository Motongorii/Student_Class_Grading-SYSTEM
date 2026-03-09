import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

export default async function AuditLogsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/login');

  const auditLogs = await prisma.auditLog.findMany({
    include: { actorUser: true },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-800 text-white min-h-screen p-6">
        <h2 className="text-xl font-bold mb-8">SGMS Admin</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block hover:underline">Dashboard</Link>
          <Link href="/admin/students" className="block hover:underline">Students</Link>
          <Link href="/admin/courses" className="block hover:underline">Courses</Link>
          <Link href="/admin/instructors" className="block hover:underline">Instructors</Link>
          <Link href="/admin/audit-logs" className="block hover:underline text-yellow-300 font-semibold">Audit Logs</Link>
          <Link href="/admin/reports" className="block hover:underline">Reports</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Audit Logs</h1>
          <p className="text-gray-600">View all system activities and changes for compliance tracking.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities ({auditLogs.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.actorUser?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.entityType}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="truncate max-w-xs block">{log.afterJSON || log.beforeJSON || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {auditLogs.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No audit logs found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
