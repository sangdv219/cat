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
  AUTH = 'auth',
  USER = 'users',
  ORDER = 'orders',
  ROLE = 'roles',
  CATEGORIES = 'categories',
  PRODUCTS = 'products',
  BRAND = 'brands',
  INVENTORY = 'inventories',
  PERMISSION = 'permissions',
  TRANSACTION = 'transactions',
}
