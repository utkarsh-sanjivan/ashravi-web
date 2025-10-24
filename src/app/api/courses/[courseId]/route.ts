import { NextRequest, NextResponse } from 'next/server';

import { getAccessTokenFromCookies } from '@/lib/auth-cookies';

import { callCoursesApi, extractErrorMessage } from '@/app/api/courses/utils';

interface RouteParams {
  courseId: string;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const { courseId } = await context.params;

  if (!courseId) {
    return NextResponse.json({ error: 'Course identifier is required' }, { status: 400 });
  }

  try {
    const accessToken = await getAccessTokenFromCookies();
    const { response, data, rawBody } = await callCoursesApi(`/courses/${courseId}`, { method: 'GET' }, accessToken);

    if (!response.ok) {
      const message = extractErrorMessage(data ?? rawBody, 'Failed to fetch course details');
      return NextResponse.json({ error: message }, { status: response.status });
    }

    return NextResponse.json(data ?? {}, { status: response.status });
  } catch (error) {
    console.error(`[api/courses/${courseId || 'unknown'}] Failed to fetch course details`, error);
    return NextResponse.json({ error: 'Failed to fetch course details' }, { status: 500 });
  }
}
