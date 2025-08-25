export const REDIS_PREFIX = process.env.NODE_ENV === 'Production'
  ? 'prod:cat'
  : 'dev:cat';