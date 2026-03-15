import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-blue-800 text-white min-h-screen p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-8">SGMS Admin</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block hover:underline">Dashboard</Link>
          <Link href="/admin/students" className="block hover:underline">Students</Link>
          <Link href="/admin/courses" className="block hover:underline">Courses</Link>
          <Link href="/admin/audit-logs" className="block hover:underline">Audit Logs</Link>
        </nav>
      </div>
      <div className="mt-8">
        <LogoutButton className="block text-sm text-red-300 hover:underline" />
      </div>
    </aside>
  );
}
