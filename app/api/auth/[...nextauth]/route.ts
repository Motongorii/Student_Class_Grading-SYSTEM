import NextAuth from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

// Force dynamic rendering for NextAuth API route
export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
