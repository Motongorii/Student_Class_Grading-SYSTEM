'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

const roleLabels: Record<string, string> = {
  ADMIN: 'Admin',
  INSTRUCTOR: 'Instructor',
  REGISTRAR: 'Registrar',
  STUDENT: 'Student',
};



import { useRouter } from 'next/navigation';

export default function LoginForm({ roleHint = '' }: { roleHint?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSlow(false);
    const slowTimeout = setTimeout(() => setSlow(true), 2500);
    // Custom signIn to get error message
    const res = await signIn('credentials', {
      email,
      password,
      role: roleHint.toUpperCase(),
      redirect: false,
      callbackUrl:
        roleHint === 'ADMIN' ? '/admin'
        : roleHint === 'INSTRUCTOR' ? '/instructor'
        : roleHint === 'REGISTRAR' ? '/registrar'
        : roleHint === 'STUDENT' ? '/student'
        : '/',
    });
    clearTimeout(slowTimeout);
    setLoading(false);
    setSlow(false);
    if (res?.error) {
      if (res.error === 'CredentialsSignin') {
        setError('Invalid email or password, or your role is not allowed.');
      } else {
        setError(res.error);
      }
    } else if (res?.ok && res.url) {
      router.push(res.url);
    }
  };

  return (
    <>
      <button
        type="button"
        className="mb-4 text-blue-600 hover:underline text-sm font-semibold"
        onClick={() => router.push('/')}
      >
        ← Back to Homepage
      </button>
      {roleHint && (
        <div className="mb-4 text-center text-lg font-bold text-blue-700">
          {roleLabels[roleHint.toUpperCase()] || roleHint} Sign In
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto animate-fade-in"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
            Email Address
        </label>
        <input
          id="email"
          type="email"
          className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="Enter your email"
        />
      </div>
      <div className="mb-4 relative">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="Enter your password"
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-9 text-gray-500 hover:text-blue-600 focus:outline-none"
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.036 3.807 6.07 6.75 9.75 6.75 1.563 0 3.06-.362 4.396-1.01M6.228 6.228A10.45 10.45 0 0 1 12 5.25c3.68 0 7.714 2.943 9.75 6.75a10.48 10.48 0 0 1-4.293 4.892M6.228 6.228l11.544 11.544M6.228 6.228 3 3m15 15-3-3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
          )}
        </button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
          />
          <span className="ml-2 text-gray-700">Remember me</span>
        </label>
        <a href="#" className="text-blue-600 hover:underline text-sm">Forgot password?</a>
      </div>
      {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
      {slow && loading && (
        <div className="text-yellow-600 text-xs text-center mb-2">Still working... Please wait, this may take a few seconds.</div>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <div className="text-center mt-4 text-sm text-gray-600">
        Don&apos;t have an account? <a href="#" className="text-blue-600 hover:underline">Contact admin</a>
      </div>
    </form>
  </>
  );
}
