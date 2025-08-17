export enum RedisContext {
  SESSION = 'session',
  CACHE = 'cache',
  LOCK = 'lock',
  RATE_LIMIT = 'rate',
  OTP = 'otp'
}
export enum RedisModule {
  USER = 'user',
  ORDER = 'order',
  AUTH = 'auth',
  TRANSACTION = 'transaction',
}