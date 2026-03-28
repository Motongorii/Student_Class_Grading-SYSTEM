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
  const [loginRole, setLoginRole] = useState(roleHint.toUpperCase() || 'STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
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
      role: loginRole,
      redirect: false,
      callbackUrl:
        loginRole === 'ADMIN' ? '/admin'
        : loginRole === 'INSTRUCTOR' ? '/instructor'
        : loginRole === 'REGISTRAR' ? '/registrar'
        : loginRole === 'STUDENT' ? '/student'
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
      <div className="mb-4 text-center text-lg font-bold text-blue-700">
        {roleLabels[loginRole] || loginRole} Sign In
      </div>
      <div className="mb-4 flex gap-2 justify-center">
        {Object.entries(roleLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`px-3 py-1 rounded-lg border ${loginRole === key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'} text-sm font-semibold`}
            onClick={() => setLoginRole(key)}
          >
            {label}
          </button>
        ))}
      </div>
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
        <button type="button" className="text-blue-600 hover:underline text-sm" onClick={() => setShowResetModal(true)}>Forgot password?</button>
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
        Don&apos;t have an account? <button type="button" className="text-blue-600 hover:underline" onClick={() => setShowContactModal(true)}>Contact admin</button>
      </div>
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowResetModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Password Recovery</h2>
            <form onSubmit={async e => {
              e.preventDefault();
              const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              setShowResetModal(false);
              alert('If this email exists, a reset link will be sent.');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Email Address</label>
                <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold shadow hover:bg-blue-700">Send Reset Link</button>
            </form>
          </div>
        </div>
      )}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowContactModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Contact Admin</h2>
            <form onSubmit={async e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const msg = (form.elements.namedItem('adminMessage') as HTMLTextAreaElement).value;
              const res = await fetch('/api/contact-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, message: msg })
              });
              setShowContactModal(false);
              alert('Your message has been sent to the admin.');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Your Email</label>
                <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Message</label>
                <textarea name="adminMessage" className="w-full border rounded px-3 py-2" rows={4} required></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold shadow hover:bg-blue-700">Send Message</button>
            </form>
          </div>
        </div>
      )}
    </form>
  </>
  );
}
