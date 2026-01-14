export const REDIS_PREFIX = process.env.NODE_ENV === 'Production' ? 'prod:cat' : 'dev:cat';
export const REDIS_TOKEN = 'REDIS_CLIENT';
