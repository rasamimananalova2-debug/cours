import { CacheEntry, CacheStats, NetworkThrottle } from '../types';

class ImageOptimizerService {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private subscribers: Set<() => void> = new Set();
  private stats: CacheStats = {
    memoryItemsCount: 0,
    totalCachedBytes: 0,
    bandwidthSavedBytes: 0,
    cacheHitCount: 0,
    cacheMissCount: 0,
    lazyLoadEventsCount: 0,
  };
  private networkThrottle: NetworkThrottle = 'fast';
  private dataSaverMode: boolean = false;

  constructor() {
    // Initialize stats
    this.updateStats();
  }

  public setNetworkThrottle(throttle: NetworkThrottle) {
    this.networkThrottle = throttle;
    this.notify();
  }

  public setDataSaver(enabled: boolean) {
    this.dataSaverMode = enabled;
    this.notify();
  }

  public getStats(): CacheStats {
    return { ...this.stats };
  }

  public subscribe(cb: () => void): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  private notify() {
    this.updateStats();
    this.subscribers.forEach((cb) => cb());
  }

  private updateStats() {
    this.stats.memoryItemsCount = this.memoryCache.size;
    let totalBytes = 0;
    this.memoryCache.forEach((entry) => {
      totalBytes += entry.sizeBytes;
    });
    this.stats.totalCachedBytes = totalBytes;
  }

  public recordLazyLoadEvent() {
    this.stats.lazyLoadEventsCount++;
    this.notify();
  }

  public isCached(url: string): boolean {
    return this.memoryCache.has(url);
  }

  public getCachedEntry(url: string): CacheEntry | undefined {
    const entry = this.memoryCache.get(url);
    if (entry) {
      entry.lastAccessed = Date.now();
      this.stats.cacheHitCount++;
      this.stats.bandwidthSavedBytes += entry.sizeBytes;
      this.notify();
      return entry;
    }
    return undefined;
  }

  public async fetchAndCache(
    url: string,
    priority: 'low' | 'normal' | 'high' = 'normal',
    onProgress?: (percent: number) => void
  ): Promise<string> {
    // If already cached
    const cached = this.getCachedEntry(url);
    if (cached) {
      if (onProgress) onProgress(100);
      return cached.blobUrl;
    }

    this.stats.cacheMissCount++;
    this.notify();

    if (this.networkThrottle === 'offline') {
      throw new Error('Simulated network is offline');
    }

    const startTime = performance.now();

    // Determine simulation speed
    let stepDelay = 20;
    let totalSteps = 10;

    if (this.networkThrottle === '3g') {
      stepDelay = 60;
      totalSteps = 15;
    } else if (this.networkThrottle === 'slow') {
      stepDelay = 120;
      totalSteps = 20;
    }

    // Step-by-step progress simulation
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDelay));
      const pct = Math.min(Math.round((i / totalSteps) * 95), 95);
      if (onProgress) onProgress(pct);
    }

    try {
      // Estimate size between 80KB and 450KB based on URL length/hash
      const pseudoHash = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const estimatedBytes = (pseudoHash % 300 + 100) * 1024;

      const loadTime = Math.round(performance.now() - startTime);

      const entry: CacheEntry = {
        url,
        blobUrl: url,
        sizeBytes: estimatedBytes,
        loadedAt: Date.now(),
        lastAccessed: Date.now(),
        priority,
        loadTimeMs: loadTime,
        status: 'cached',
      };

      this.memoryCache.set(url, entry);
      if (onProgress) onProgress(100);
      this.notify();

      return url;
    } catch {
      throw new Error(`Failed to load image: ${url}`);
    }
  }

  public prefetch(urls: string[], priority: 'low' | 'normal' = 'low') {
    urls.forEach((url) => {
      if (!this.memoryCache.has(url)) {
        this.fetchAndCache(url, priority).catch(() => {});
      }
    });
  }

  public clearCache() {
    this.memoryCache.clear();
    this.stats.cacheHitCount = 0;
    this.stats.cacheMissCount = 0;
    this.stats.bandwidthSavedBytes = 0;
    this.stats.lazyLoadEventsCount = 0;
    this.notify();
  }

  public getCacheEntriesList(): CacheEntry[] {
    return Array.from(this.memoryCache.values()).sort((a, b) => b.lastAccessed - a.lastAccessed);
  }
}

export const imageOptimizer = new ImageOptimizerService();
