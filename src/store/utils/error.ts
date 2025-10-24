import type { ApiError } from '@/services/api.service';
import { isApiError } from '@/services/api.service';

const MESSAGE_KEYS = ['message', 'error', 'detail', 'title'] as const;

type MaybeMessage = { [K in (typeof MESSAGE_KEYS)[number]]?: unknown } & {
  data?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readMessage = (candidate: unknown): string | undefined => {
  if (!candidate) {
    return undefined;
  }

  if (typeof candidate === 'string') {
    return candidate.trim() || undefined;
  }

  if (isRecord(candidate)) {
    for (const key of MESSAGE_KEYS) {
      const value = candidate[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }

    if ('data' in candidate) {
      return readMessage((candidate as MaybeMessage).data);
    }
  }

  return undefined;
};

export interface ResolvedError {
  message: string;
  status?: ApiError['status'];
}

export interface RejectedActionLike {
  payload?: unknown;
  error?: { message?: string } | null;
}

export const resolveRejectedActionError = (
  action: RejectedActionLike,
  fallback: string
): ResolvedError => {
  const payloadMessage = readMessage(action.payload);

  if (payloadMessage) {
    const status = isApiError(action.payload) ? action.payload.status : undefined;
    return { message: payloadMessage, status };
  }

  const errorMessage = action?.error?.message;
  if (typeof errorMessage === 'string' && errorMessage.trim().length > 0) {
    return { message: errorMessage.trim() };
  }

  return { message: fallback };
};

export const redactEmail = (email: string | null | undefined): string | null => {
  if (!email) {
    return email ?? null;
  }

  const [name, domain] = email.split('@');
  if (!domain) {
    return email;
  }

  const safeName = name.length <= 2 ? `${name[0] ?? ''}*` : `${name.slice(0, 2)}***`;
  return `${safeName}@${domain}`;
};
