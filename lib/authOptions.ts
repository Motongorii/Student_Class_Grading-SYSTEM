import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error('Missing credentials');
        // Accept role from credentials (sent as extra field)
        const role = (credentials as any).role;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) throw new Error('User not found');
        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) throw new Error('Invalid password');
        // Only allow login if role matches (commented out for development flexibility)
        // if (role && user.role !== role) {
        //   throw new Error('Role not allowed');
        // }
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // user may be AdapterUser, so cast to any
        (token as any).role = (user as any).role;
        (token as any).id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // session.user is default type, so cast to any
        (session.user as any).id = (token as any).id;
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
