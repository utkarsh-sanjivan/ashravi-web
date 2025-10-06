import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  console.log('🔵 Login API route called');
  
  try {
    const body = await request.json();
    console.log('🔵 Login request body:', body);

    const { userId, name, email } = body;

    if (!userId || !name || !email) {
      console.log('🔴 Missing required fields:', { userId, name, email });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user session
    const user = {
      id: userId,
      name: name,
      email: email,
    };

    console.log('🔵 Creating session for user:', user);

    const cookieStore = await cookies();
    
    // Set session cookie
    cookieStore.set('session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('✅ Session cookie set successfully');

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error('🔴 Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to login' },
      { status: 500 }
    );
  }
}
