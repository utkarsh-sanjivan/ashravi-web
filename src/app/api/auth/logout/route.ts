import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  console.log('🔵 Logout API route called');
  
  try {
    const cookieStore = await cookies();
    
    // Delete session cookie
    cookieStore.delete('session');

    console.log('✅ Session cookie deleted successfully');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('🔴 Logout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to logout' },
      { status: 500 }
    );
  }
}
