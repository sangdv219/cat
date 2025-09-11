export enum RedisContext {
  LIST = 'list',
  DETAIL = 'detail',
  QUERY = 'query',
  SESSION = 'session',
  CACHE = 'cache',
  LOCK = 'lock',
  RATE_LIMIT = 'rate',
  OTP = 'otp',
}
export enum RedisModule {
  USER = 'users',
  ORDER = 'order',
  AUTH = 'auth',
  TRANSACTION = 'transaction',
}
