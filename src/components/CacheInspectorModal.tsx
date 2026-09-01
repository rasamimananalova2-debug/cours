import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { imageOptimizer } from '../services/imageOptimizer';
import { CacheStats, CacheEntry, NetworkThrottle } from '../types';
import {
  X,
  Zap,
  Trash2,
  Activity,
  HardDrive,
  Download,
  Wifi,
  Sparkles,
  Layers,
} from 'lucide-react';

export const CacheInspectorModal: React.FC = () => {
  const { isCacheInspectorOpen, setIsCacheInspectorOpen } = useApp();
  const { settings, setNetworkThrottle, setDataSaver } = useTheme();

  const [stats, setStats] = useState<CacheStats>(imageOptimizer.getStats());
  const [entries, setEntries] = useState<CacheEntry[]>([]);

  useEffect(() => {
    if (!isCacheInspectorOpen) return;

    const update = () => {
      setStats(imageOptimizer.getStats());
      setEntries(imageOptimizer.getCacheEntriesList());
    };

    update();
    const unsub = imageOptimizer.subscribe(update);
    return () => unsub();
  }, [isCacheInspectorOpen]);

  if (!isCacheInspectorOpen) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleClearCache = () => {
    imageOptimizer.clearCache();
    setStats(imageOptimizer.getStats());
    setEntries([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-2xl rounded-2xl border border-outline-variant/80 dark:border-outline-variant/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-low/60 dark:bg-surface-container/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="font-title-md text-lg font-bold text-on-surface flex items-center gap-2">
                FastImage & Cache Optimizer
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Temps Réel
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                Gestionnaire de cache mémoire, préchargement, lazy loading et simulation réseau.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCacheInspectorOpen(false)}
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Metrics Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/40">
              <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                <span>En Cache</span>
                <HardDrive className="w-4 h-4 text-primary dark:text-primary-fixed" />
              </div>
              <p className="text-xl font-bold text-on-surface">{stats.memoryItemsCount} médias</p>
              <p className="text-[11px] text-outline mt-0.5">{formatBytes(stats.totalCachedBytes)}</p>
            </div>

            <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/40">
              <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                <span>Bande passante sauvée</span>
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatBytes(stats.bandwidthSavedBytes)}
              </p>
              <p className="text-[11px] text-outline mt-0.5">Économies de data</p>
            </div>

            <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/40">
              <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                <span>Taux de Cache Hit</span>
                <Activity className="w-4 h-4 text-secondary" />
              </div>
              <p className="text-xl font-bold text-secondary">
                {stats.cacheHitCount + stats.cacheMissCount === 0
                  ? '100%'
                  : `${Math.round(
                      (stats.cacheHitCount / (stats.cacheHitCount + stats.cacheMissCount)) * 100
                    )}%`}
              </p>
              <p className="text-[11px] text-outline mt-0.5">{stats.cacheHitCount} hits / {stats.cacheMissCount} miss</p>
            </div>

            <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/40">
              <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                <span>Lazy Loads</span>
                <Layers className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl font-bold text-on-surface">{stats.lazyLoadEventsCount}</p>
              <p className="text-[11px] text-outline mt-0.5">Intersections observées</p>
            </div>
          </div>

          {/* Network Simulator Controls */}
          <div className="bg-surface-container-lowest dark:bg-surface-container p-4 rounded-xl border border-outline-variant/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-primary dark:text-primary-fixed" />
                <span className="text-sm font-bold text-on-surface">Simulateur de Débit Réseau</span>
              </div>
              <span className="text-xs text-outline">Testez les indicateurs de progression personnalisés</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['fast', '3g', 'slow', 'offline'] as NetworkThrottle[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setNetworkThrottle(mode)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    settings.networkThrottle === mode
                      ? 'bg-primary text-on-primary border-primary dark:bg-primary-fixed dark:text-on-primary-fixed'
                      : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {mode === 'fast' && '⚡ 4G / Fibre'}
                  {mode === '3g' && '📶 3G Rapide'}
                  {mode === 'slow' && '🐢 3G Lente'}
                  {mode === 'offline' && '🚫 Hors-ligne'}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
              <span className="text-xs text-on-surface-variant">Mode Économiseur de Données (Data Saver)</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dataSaver}
                  onChange={(e) => setDataSaver(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-outline-variant peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
          </div>

          {/* Cached Entries List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Objets en Cache Mémoire ({entries.length})
              </h3>
              {entries.length > 0 && (
                <button
                  onClick={handleClearCache}
                  className="flex items-center gap-1 text-xs text-error hover:bg-error-container/20 px-2.5 py-1 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Vider le cache
                </button>
              )}
            </div>

            {entries.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-outline-variant/60 rounded-xl">
                <p className="text-xs text-outline">Aucun élément en cache. Naviguez dans l'application pour remplir le cache.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {entries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-surface-container-lowest dark:bg-surface-container rounded-lg border border-outline-variant/40 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate flex-1 mr-3">
                      <div className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                        <img src={entry.url} alt="thumbnail" className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate font-mono text-[11px] text-on-surface">
                        {entry.url.split('/').pop()?.substring(0, 30)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-on-surface-variant font-medium">
                      <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded">
                        {formatBytes(entry.sizeBytes)}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {entry.loadTimeMs}ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-outline-variant/60 bg-surface-container-lowest dark:bg-surface-container-low flex justify-end">
          <button
            onClick={() => setIsCacheInspectorOpen(false)}
            className="px-5 py-2 rounded-lg bg-primary dark:bg-primary-container text-on-primary font-label-sm text-xs font-bold hover:bg-primary-container transition-colors"
          >
            Fermer l'inspecteur
          </button>
        </div>
      </div>
    </div>
  );
};
