import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth-cookies';

export async function POST() {
  try {
    await clearAuthCookies();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to logout' },
      { status: 500 }
    );
  }
}
