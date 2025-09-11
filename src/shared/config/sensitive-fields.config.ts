export const sensitiveFields: Record<string, string[]> = {
  User: ['password_hash', 'failed_login_attempts', 'last_failed_login_at', 'locked_until' ],
  Products: ['password_hash'],
  Customer: [],
  Order: [],
};