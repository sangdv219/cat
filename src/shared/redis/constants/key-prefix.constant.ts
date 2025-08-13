export const REDIS_PREFIX = process.env.NODE_ENV === 'production'
  ? 'prod:cat'
  : 'dev:cat';