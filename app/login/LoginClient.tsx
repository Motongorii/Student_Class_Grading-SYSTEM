"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LoginForm from '../../components/LoginForm';

export default function LoginClient() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || '';
  const router = useRouter();
  const { data: session, status } = useSession();

  // automatically redirect an already-authenticated user away from /login
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      const dest =
        session.user.role === 'ADMIN' ? '/admin' :
        session.user.role === 'INSTRUCTOR' ? '/instructor' :
        session.user.role === 'REGISTRAR' ? '/registrar' :
        session.user.role === 'STUDENT' ? '/student' : '/';
      router.push(dest);
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500">Checking authentication…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in to SGMS</h1>
        <LoginForm roleHint={role} />
      </div>
    </div>
  );
}