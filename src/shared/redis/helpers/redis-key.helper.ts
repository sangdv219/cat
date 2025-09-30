import { REDIS_PREFIX } from '../constants/key-prefix.constant';
import { RedisContext } from '../enums/redis-key.enum';

export const buildRedisKey = (
  module: string,
  context: RedisContext,
  identifier?: string,
  attribute?: string,
) => {
  return [REDIS_PREFIX, module, context, identifier, attribute]
    .filter(Boolean)
    .join(':');
};

export const buildRedisKeyQuery = (
  module: string,
  context: RedisContext,
  hashOfQuery?: string,
) => {
  const paramString = Object.entries(hashOfQuery || {})
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('&');
  return [REDIS_PREFIX, module, context, paramString].filter(Boolean).join(':');
};
