"use client";
import { useSearchParams } from 'next/navigation';
import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || '';
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in to SGMS</h1>
        <LoginForm roleHint={role} />
      </div>
    </div>
  );
}
