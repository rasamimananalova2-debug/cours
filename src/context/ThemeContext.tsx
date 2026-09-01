import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorPalette, FontSizeScale, NetworkThrottle, ThemeMode, ThemeSettings } from '../types';
import { imageOptimizer } from '../services/imageOptimizer';

interface ThemeContextType {
  settings: ThemeSettings;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ColorPalette) => void;
  setFontSize: (size: FontSizeScale) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setDataSaver: (enabled: boolean) => void;
  setNetworkThrottle: (throttle: NetworkThrottle) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const defaultSettings: ThemeSettings = {
  mode: 'light',
  palette: 'classic',
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  dataSaver: false,
  networkThrottle: 'fast',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('edusmart_theme_settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('edusmart_theme_settings', JSON.stringify(settings));

    // Calculate effective dark mode
    let effectiveDark = false;
    if (settings.mode === 'dark') {
      effectiveDark = true;
    } else if (settings.mode === 'system') {
      effectiveDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    setIsDark(effectiveDark);

    // Apply classes to documentElement
    const root = document.documentElement;

    if (effectiveDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Set theme palette attribute
    if (settings.palette === 'classic') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', settings.palette);
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size root scaling
    if (settings.fontSize === 'large') {
      root.style.fontSize = '17px';
    } else if (settings.fontSize === 'xlarge') {
      root.style.fontSize = '18.5px';
    } else {
      root.style.fontSize = '16px';
    }

    // Update ImageOptimizer
    imageOptimizer.setNetworkThrottle(settings.networkThrottle);
    imageOptimizer.setDataSaver(settings.dataSaver);
  }, [settings]);

  const setMode = (mode: ThemeMode) => setSettings((prev) => ({ ...prev, mode }));
  const setPalette = (palette: ColorPalette) => setSettings((prev) => ({ ...prev, palette }));
  const setFontSize = (fontSize: FontSizeScale) => setSettings((prev) => ({ ...prev, fontSize }));
  const setHighContrast = (highContrast: boolean) => setSettings((prev) => ({ ...prev, highContrast }));
  const setReducedMotion = (reducedMotion: boolean) => setSettings((prev) => ({ ...prev, reducedMotion }));
  const setDataSaver = (dataSaver: boolean) => setSettings((prev) => ({ ...prev, dataSaver }));
  const setNetworkThrottle = (networkThrottle: NetworkThrottle) =>
    setSettings((prev) => ({ ...prev, networkThrottle }));

  const toggleDarkMode = () => {
    setSettings((prev) => ({
      ...prev,
      mode: isDark ? 'light' : 'dark',
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        setMode,
        setPalette,
        setFontSize,
        setHighContrast,
        setReducedMotion,
        setDataSaver,
        setNetworkThrottle,
        isDark,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
