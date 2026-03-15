import { NextRequest, NextResponse } from 'next/server';

export function requireRole(roles: string[]) {
  return async (req: NextRequest, next: () => Promise<NextResponse>) => {
    const session = req.cookies.get('next-auth.session-token');
    // You should replace this with actual session/user lookup
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Example: get user from session (pseudo)
    // const user = await getUserFromSession(session);
    // if (!user || !roles.includes(user.role)) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }
    // return next();
    // For now, allow all for scaffolding
    return next();
  };
}

export function requireSelfOrRole(userId: string, roles: string[], reqUser: { id: string, role: string }) {
  if (reqUser.id === userId) return true;
  return roles.includes(reqUser.role);
}
