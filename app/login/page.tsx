import { unstable_noStore as noStore } from 'next/cache';
import LoginClient from './LoginClient';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// This will prevent static generation
export async function generateStaticParams() {
  return [];
}

export default function LoginPage() {
  // Prevent static generation
  noStore();

  return <LoginClient />;
}
