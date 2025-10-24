interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_API_BASE: string;
  NEXT_PUBLIC_SITE_URL: string;
  API_RATE_LIMIT_MAX: number;
  API_RATE_LIMIT_WINDOW_MS: number;
  CSRF_COOKIE_NAME: string;
  AUTH_SESSION_COOKIE_NAME: string;
  REDUX_DEVTOOLS_ENABLED: boolean;
}

type EnvSchema = {
  [K in keyof EnvConfig]: {
    default: EnvConfig[K];
    validate: (value: unknown) => value is EnvConfig[K];
    errorMessage: string;
  };
};

const schema: EnvSchema = {
  NODE_ENV: {
    default: 'development',
    validate: (value: unknown): value is EnvConfig['NODE_ENV'] =>
      value === 'development' || value === 'production' || value === 'test',
    errorMessage: 'NODE_ENV must be one of development, production, or test.',
  },
  NEXT_PUBLIC_API_BASE: {
    default: 'http://localhost:8000/api/v1',
    validate: (value: unknown): value is string => typeof value === 'string' && value.length > 0,
    errorMessage: 'NEXT_PUBLIC_API_BASE must be a non-empty string.',
  },
  NEXT_PUBLIC_SITE_URL: {
    default: 'http://localhost:3000',
    validate: (value: unknown): value is string => typeof value === 'string' && value.length > 0,
    errorMessage: 'NEXT_PUBLIC_SITE_URL must be a non-empty string URL.',
  },
  API_RATE_LIMIT_MAX: {
    default: 100,
    validate: (value: unknown): value is number =>
      typeof value === 'number' && Number.isInteger(value) && value > 0,
    errorMessage: 'API_RATE_LIMIT_MAX must be a positive integer.',
  },
  API_RATE_LIMIT_WINDOW_MS: {
    default: 60_000,
    validate: (value: unknown): value is number =>
      typeof value === 'number' && Number.isInteger(value) && value > 0,
    errorMessage: 'API_RATE_LIMIT_WINDOW_MS must be a positive integer.',
  },
  CSRF_COOKIE_NAME: {
    default: 'csrfToken',
    validate: (value: unknown): value is string => typeof value === 'string' && value.length > 0,
    errorMessage: 'CSRF_COOKIE_NAME must be a non-empty string.',
  },
  AUTH_SESSION_COOKIE_NAME: {
    default: 'auth_session',
    validate: (value: unknown): value is string => typeof value === 'string' && value.length > 0,
    errorMessage: 'AUTH_SESSION_COOKIE_NAME must be a non-empty string.',
  },
  REDUX_DEVTOOLS_ENABLED: {
    default: false,
    validate: (value: unknown): value is boolean => typeof value === 'boolean',
    errorMessage: 'REDUX_DEVTOOLS_ENABLED must be a boolean value.',
  },
};

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  API_RATE_LIMIT_MAX: process.env.API_RATE_LIMIT_MAX
    ? Number(process.env.API_RATE_LIMIT_MAX)
    : undefined,
  API_RATE_LIMIT_WINDOW_MS: process.env.API_RATE_LIMIT_WINDOW_MS
    ? Number(process.env.API_RATE_LIMIT_WINDOW_MS)
    : undefined,
  CSRF_COOKIE_NAME: process.env.CSRF_COOKIE_NAME,
  AUTH_SESSION_COOKIE_NAME: process.env.AUTH_SESSION_COOKIE_NAME,
  REDUX_DEVTOOLS_ENABLED: process.env.REDUX_DEVTOOLS_ENABLED
    ? process.env.REDUX_DEVTOOLS_ENABLED === 'true'
    : undefined,
};

function validateEnv(): EnvConfig {
  const output: Partial<EnvConfig> = {};
  const errors: string[] = [];

  (Object.keys(schema) as Array<keyof EnvSchema>).forEach((key) => {
    const definition = schema[key];
    const value = rawEnv[key as keyof typeof rawEnv];
    const finalValue = value ?? definition.default;

    if (definition.validate(finalValue)) {
      (output as any)[key] = finalValue;
    } else {
      errors.push(definition.errorMessage);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n- ${errors.join('\n- ')}`);
  }

  return output as EnvConfig;
}

export const env = validateEnv();
