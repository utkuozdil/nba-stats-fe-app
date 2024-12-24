interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheItem<any>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache: Cache = {};

export const cacheService = {
  set: <T>(key: string, data: T): void => {
    cache[key] = {
      data,
      timestamp: Date.now(),
    };
  },

  get: <T>(key: string): T | null => {
    const item = cache[key];
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > CACHE_DURATION;
    if (isExpired) {
      delete cache[key];
      return null;
    }

    return item.data as T;
  },

  clear: (): void => {
    Object.keys(cache).forEach(key => delete cache[key]);
  }
}; 