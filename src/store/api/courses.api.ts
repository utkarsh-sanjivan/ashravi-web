import { env } from '@/config/env';
import { transformCourse, transformCourses, transformFiltersToQuery } from '@/lib/courseAdapter';
import { apiService } from '@/services/api.service';
import { addToWishlist, removeFromWishlist, markWishlistPending, clearWishlistPending } from '@/store/wishlist.slice';
import { selectWishlistCourseIds } from '@/store/selectors/wishlist.selectors';
import type { RootState } from '@/store';
import type {
  CourseDetailResponse,
  CourseListRequest,
  CourseListResponse,
} from '@/types/api/courses';

const buildQueryString = (params: CourseListRequest): string => {
  const query = transformFiltersToQuery({
    ...params,
    level: params.level,
  });

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((entry) => searchParams.append(key, String(entry)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

const normalizeListResponse = (payload: any): CourseListResponse => {
  const rawCourses =
    payload?.data?.courses ??
    payload?.courses ??
    payload?.data ??
    payload ?? [];

  const paginationPayload = payload?.data?.pagination ?? payload?.pagination ?? {};

  const courses = transformCourses(rawCourses);

  return {
    data: courses,
    pagination: {
      currentPage: Number(paginationPayload.currentPage ?? paginationPayload.page ?? 1),
      totalPages: Number(paginationPayload.totalPages ?? paginationPayload.pages ?? 1),
      totalItems: Number(paginationPayload.totalItems ?? paginationPayload.total ?? courses.length ?? 0),
    },
  };
};

const normalizeDetailResponse = (payload: any): CourseDetailResponse => ({
  data: transformCourse(
    payload?.data?.course ?? payload?.data ?? payload
  ),
});

const resolveInternalApiUrl = (path: string) => {
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}${path}`;
  }

  return `${env.NEXT_PUBLIC_SITE_URL}${path}`;
};

export const coursesApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    list: builder.query<CourseListResponse, CourseListRequest | void>({
      query: (params) => {
        const queryString = buildQueryString(params ?? {});
        return {
          url: resolveInternalApiUrl(`/api/courses${queryString}`),
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((course) => ({ type: 'Course' as const, id: course.id })),
              { type: 'Courses' as const, id: 'LIST' },
            ]
          : [{ type: 'Courses' as const, id: 'LIST' }],
      transformResponse: normalizeListResponse,
    }),
    detail: builder.query<CourseDetailResponse, string>({
      query: (courseId) => ({
        url: resolveInternalApiUrl(`/api/courses/${courseId}`),
        method: 'GET',
      }),
      providesTags: (result, error, courseId) => [{ type: 'Course', id: courseId }],
      transformResponse: normalizeDetailResponse,
    }),
    toggleWishlist: builder.mutation<{ status: 'added' | 'removed' }, { courseId: string; action: 'add' | 'remove' }>({
      query: ({ courseId, action }) => ({
        url: resolveInternalApiUrl(`/api/courses/${courseId}/wishlist`),
        method: action === 'add' ? 'POST' : 'DELETE',
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: 'Course' as const, id: courseId },
        { type: 'Courses' as const, id: 'LIST' },
      ],
      async onQueryStarted({ courseId, action }, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const courseIds = selectWishlistCourseIds(state);
        const wasWishlisted = courseIds.includes(courseId);

        dispatch(
          markWishlistPending({
            courseId,
            direction: action === 'add' ? 'adding' : 'removing',
          })
        );

        if (action === 'add' && !wasWishlisted) {
          dispatch(addToWishlist(courseId));
        }

        if (action === 'remove' && wasWishlisted) {
          dispatch(removeFromWishlist(courseId));
        }

        try {
          await queryFulfilled;
        } catch (error) {
          if (action === 'add') {
            dispatch(removeFromWishlist(courseId));
          } else if (wasWishlisted) {
            dispatch(addToWishlist(courseId));
          }
          throw error;
        } finally {
          dispatch(clearWishlistPending(courseId));
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useListQuery: useCoursesListQuery,
  useLazyListQuery: useLazyCoursesListQuery,
  useDetailQuery: useCourseDetailQuery,
  useToggleWishlistMutation,
} = coursesApi;
