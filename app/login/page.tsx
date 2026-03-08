import { redirect } from 'next/navigation';
import LoginClient from './LoginClient';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  // This server component will force dynamic rendering
  return <LoginClient />;
}
