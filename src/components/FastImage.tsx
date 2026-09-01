import React, { useEffect, useRef, useState } from 'react';
import { FastImageProps } from '../types';
import { imageOptimizer } from '../services/imageOptimizer';
import { RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export const FastImage: React.FC<FastImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  priority = 'normal',
  lazy = true,
  aspectRatio,
  showProgressIndicator = true,
  fallbackSrc,
  dataAlt,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [isLoading, setIsLoading] = useState(!imageOptimizer.isCached(src));
  const [isLoaded, setIsLoaded] = useState(imageOptimizer.isCached(src));
  const [isCachedHit, setIsCachedHit] = useState(imageOptimizer.isCached(src));
  const [progress, setProgress] = useState<number>(imageOptimizer.isCached(src) ? 100 : 0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>(imageOptimizer.isCached(src) ? src : '');

  // Handle Lazy Loading with IntersectionObserver
  useEffect(() => {
    if (!lazy || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            imageOptimizer.recordLazyLoadEvent();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // trigger slightly before it enters viewport for smooth UX
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy, isVisible]);

  // Load image once visible
  useEffect(() => {
    if (!isVisible || !src) return;

    let isMounted = true;
    const wasCached = imageOptimizer.isCached(src);
    setIsCachedHit(wasCached);

    if (wasCached) {
      setImageSrc(src);
      setIsLoading(false);
      setIsLoaded(true);
      setProgress(100);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setProgress(10);

    const effectivePriority: 'low' | 'normal' | 'high' = (priority === 'high' || priority === 'low') ? priority : 'normal';
    imageOptimizer
      .fetchAndCache(src, effectivePriority, (percent) => {
        if (isMounted) {
          setProgress(percent);
        }
      })
      .then((resolvedUrl) => {
        if (!isMounted) return;
        const img = new Image();
        img.src = resolvedUrl;
        img.onload = () => {
          if (isMounted) {
            setImageSrc(resolvedUrl);
            setIsLoading(false);
            setIsLoaded(true);
            setProgress(100);
          }
        };
        img.onerror = () => {
          if (isMounted) {
            if (fallbackSrc) {
              setImageSrc(fallbackSrc);
              setIsLoading(false);
              setIsLoaded(true);
            } else {
              setHasError(true);
              setIsLoading(false);
            }
          }
        };
      })
      .catch(() => {
        if (isMounted) {
          if (fallbackSrc) {
            setImageSrc(fallbackSrc);
            setIsLoading(false);
            setIsLoaded(true);
          } else {
            setHasError(true);
            setIsLoading(false);
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isVisible, src, priority, fallbackSrc]);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoading(true);
    setProgress(10);
    const retryPriority: 'low' | 'normal' | 'high' = (priority === 'high' || priority === 'low') ? priority : 'normal';
    imageOptimizer
      .fetchAndCache(src, retryPriority, (p) => setProgress(p))
      .then((url) => {
        setImageSrc(url);
        setIsLoading(false);
        setIsLoaded(true);
        setProgress(100);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  };

  return (
    <div
      ref={containerRef}
      id={`fast-image-${Math.random().toString(36).substring(2, 9)}`}
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      onClick={onClick}
    >
      {/* Loading Placeholder & Progress Indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-container/60 dark:bg-surface-container/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative flex flex-col items-center justify-center p-3">
            {/* Circular Progress Ring */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  className="stroke-outline-variant/30 dark:stroke-outline/20"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  className="stroke-secondary transition-all duration-200"
                  strokeWidth="3"
                  strokeDasharray={`${(progress / 100) * 94.2}, 94.2`}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[10px] font-semibold text-on-surface">
                {progress}%
              </span>
            </div>

            {showProgressIndicator && (
              <span className="mt-1.5 text-[10px] tracking-wider uppercase font-medium text-on-surface-variant flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-secondary animate-spin" /> FastImage
              </span>
            )}
          </div>

          {/* Bottom subtle progress bar */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-surface-container-high/50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-error-container/20 p-4 text-center">
          <AlertCircle className="w-6 h-6 text-error mb-2" />
          <p className="text-xs text-error font-medium mb-2">Erreur de chargement</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary dark:text-primary-fixed bg-surface-container-lowest dark:bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container shadow-xs transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Réessayer
          </button>
        </div>
      )}

      {/* Actual Rendered Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          data-alt={dataAlt || alt}
          referrerPolicy="no-referrer"
          className={`${className} transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-102'
          }`}
          loading={lazy ? 'lazy' : 'eager'}
        />
      )}

      {/* Cache Hit Badge (Shown briefly for tech demonstration) */}
      {isCachedHit && isLoaded && (
        <div
          title="Servi instantanément depuis le cache mémoire FastImage"
          className="absolute top-2 right-2 z-10 bg-emerald-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-0.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span>⚡ FastCache</span>
        </div>
      )}
    </div>
  );
};
