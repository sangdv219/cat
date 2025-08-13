import { REDIS_PREFIX } from '../constants/key-prefix.constant';
import { RedisContext, RedisEntity } from '../enums/redis-key.enum';
import { config } from "dotenv";

config();
export const buildRedisKey = (
  module: string,
  context: RedisContext,
  identifier?: string,
  attribute?: string,
) => {
  return [
    REDIS_PREFIX,
    module,
    context,
    identifier,
    attribute
  ].filter(Boolean).join(':');
};
