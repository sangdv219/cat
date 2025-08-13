export enum RedisContext {
  SESSION = 'session',
  CACHE = 'cache',
  LOCK = 'lock',
  RATE_LIMIT = 'rate',
  OTP = 'otp'
}
export enum RedisEntity {
  USER = 'user',
  ORDER = 'order',
  TRANSACTION = 'transaction',
}