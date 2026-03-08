import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-blue-800 text-white min-h-screen p-6">
      <h2 className="text-xl font-bold mb-8">SGMS Admin</h2>
      <nav className="space-y-4">
        <Link href="/admin" className="block hover:underline">Dashboard</Link>
        <Link href="/admin/students" className="block hover:underline">Students</Link>
        <Link href="/admin/courses" className="block hover:underline">Courses</Link>
        <Link href="/admin/audit-logs" className="block hover:underline">Audit Logs</Link>
      </nav>
    </aside>
  );
}
