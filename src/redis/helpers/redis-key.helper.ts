import { REDIS_PREFIX } from '@redis/constants/key-prefix.constant';
import { RedisContext } from '@redis/enums/redis-key.enum';

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
  hashOfQuery: Record<string, string> = {},
  id?: string
) => {
  const paramString = Object.entries(hashOfQuery || {})
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('&');
  return [REDIS_PREFIX, module, context, paramString, id].filter(Boolean).join(':');
};
