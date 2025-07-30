import Redis from "ioredis";

export class CacheVersionService{
    private redis: Redis;

    constructor(redis?: Redis) {
        this.redis = redis ?? new Redis();
    }

    async incrementVersion(keyPrefix: string): Promise<number> {
        const versionKey = `cache_version:${keyPrefix}`;

        const newVersion = await this.redis.incr(versionKey);

        return newVersion;
    }

    async getCurrentVersion(keyPrefix:string): Promise<number>{
        const versionKey = await this.redis.get(`cache_version:${keyPrefix}`);
        return versionKey ? Number(versionKey) : 1; // Default to 1 if not set
    }

    async buildVersionedKey(keyPrefix: string, queryParams: Record<string, string | number>): Promise<string>{
        const version = await this.getCurrentVersion(keyPrefix);
        
        const query = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${value}`)
            .join(':');
            
        return `${keyPrefix}:v${version}:${query}`;
    }
}