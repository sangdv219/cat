import Redis from 'ioredis';
export const findCacheByEmail = (keys: string[], email: string) => {
  const result = keys.find((key) => {
    if (key.split(':').slice(-1).join() === email) {
      return key;
    }
  });
  return result ? result : null;
};

export const scanlAlKeys = async (pattern: string) => {
  let cursor = '0';
  const results: string[] = [];
  const redis = new Redis({ host: 'redis', port: 6379 });;
  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      100,
    );
    cursor = nextCursor;
    results.push(...keys);
  } while (cursor !== '0');

  return results;
};
