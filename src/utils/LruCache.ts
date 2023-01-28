class LruCache {
    private cache: Map<string, any>;
    private readonly maxSize: number;

    constructor(maxSize: number = 50) {
        this.cache = new Map<string, any>();
        this.maxSize = maxSize;
    }

    public set(key: string, value: any) {
        if (this.cache.size === this.maxSize) {
            const leastRecentlyUsedKey = this.cache.keys().next().value;
            this.cache.delete(leastRecentlyUsedKey);
        }
        this.cache.set(key, value);
    }

    public get(key: string) {
        if (!this.cache.has(key)) {
            return undefined;
        }
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
}
