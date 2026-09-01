import React from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { ColorPalette, FontSizeScale, ThemeMode } from '../types';
import {
  X,
  Palette,
  Sun,
  Moon,
  Monitor,
  Eye,
  Type,
  Sparkles,
  Check,
} from 'lucide-react';

export const ThemeCustomizerModal: React.FC = () => {
  const { isThemeCustomizerOpen, setIsThemeCustomizerOpen } = useApp();
  const {
    settings,
    setMode,
    setPalette,
    setFontSize,
    setHighContrast,
    setReducedMotion,
  } = useTheme();

  if (!isThemeCustomizerOpen) return null;

  const palettes: Array<{ id: ColorPalette; name: string; primary: string; secondary: string; desc: string }> = [
    {
      id: 'classic',
      name: 'EduSmart Classic',
      primary: '#000666',
      secondary: '#4b41e1',
      desc: 'Bleu marine académique et lavande moderne',
    },
    {
      id: 'teal',
      name: 'Teal Focus',
      primary: '#005049',
      secondary: '#00897b',
      desc: 'Émeraude reposante et accents menthe fraîche',
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Indigo',
      primary: '#33148d',
      secondary: '#7c3aed',
      desc: 'Indigo profond et violet électrique high-tech',
    },
    {
      id: 'amber',
      name: 'Amber Warmth',
      primary: '#78350f',
      secondary: '#d97706',
      desc: 'Chaleur ambrée inspirée des bibliothèques classiques',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-xl rounded-2xl border border-outline-variant/80 dark:border-outline-variant/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-low/60 dark:bg-surface-container/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-title-md text-lg font-bold text-on-surface">
                Thèmes Visuels & Accessibilité
              </h2>
              <p className="text-xs text-on-surface-variant">
                Personnalisez le contraste, les polices et l'ambiance visuelle du portail.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeCustomizerOpen(false)}
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Native Dark Mode Selector */}
          <div>
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-3">
              Mode d'Affichage (Mode Sombre Natif)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light' as ThemeMode, label: 'Clair', icon: <Sun className="w-4 h-4" /> },
                { id: 'dark' as ThemeMode, label: 'Sombre', icon: <Moon className="w-4 h-4" /> },
                { id: 'system' as ThemeMode, label: 'Système', icon: <Monitor className="w-4 h-4" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border font-semibold text-xs transition-all ${
                    settings.mode === m.id
                      ? 'border-primary bg-primary/10 text-primary dark:border-primary-fixed dark:text-primary-fixed shadow-xs'
                      : 'border-outline-variant/60 bg-surface-container-lowest dark:bg-surface text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-3">
              Palette Graphique Personnalisée
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {palettes.map((p) => {
                const isSelected = settings.palette === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPalette(p.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary dark:border-primary-fixed bg-surface-container-low dark:bg-surface-container shadow-xs'
                        : 'border-outline-variant/60 bg-surface-container-lowest dark:bg-surface hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-on-surface">{p.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: p.primary }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: p.secondary }}
                        />
                        {isSelected && (
                          <span className="ml-1 text-primary dark:text-primary-fixed">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Scale */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-4 h-4 text-primary dark:text-primary-fixed" />
                Taille du texte (Accessibilité A11Y)
              </label>
              <span className="text-xs text-on-surface-variant font-medium">
                {settings.fontSize === 'normal' && 'Standard (100%)'}
                {settings.fontSize === 'large' && 'Confort (110%)'}
                {settings.fontSize === 'xlarge' && 'Grand (120%)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal' as FontSizeScale, label: 'A', sub: 'Standard' },
                { id: 'large' as FontSizeScale, label: 'A+', sub: 'Confort' },
                { id: 'xlarge' as FontSizeScale, label: 'A++', sub: 'Grand' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFontSize(s.id)}
                  className={`py-3 px-2 rounded-xl border text-center font-bold transition-all ${
                    settings.fontSize === s.id
                      ? 'border-primary bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed shadow-xs'
                      : 'border-outline-variant/60 bg-surface-container-lowest dark:bg-surface text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="text-base block">{s.label}</span>
                  <span className="text-[10px] font-normal opacity-80">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Toggles */}
          <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-secondary" />
                  Mode Contraste Renforcé (WCAG AAA)
                </span>
                <p className="text-[11px] text-on-surface-variant">Bordures et contrastes textuels accentués pour la lisibilité.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-outline-variant peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
              <div>
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-secondary" />
                  Réduction des animations (Reduced Motion)
                </span>
                <p className="text-[11px] text-on-surface-variant">Désactive les transitions pour le confort visuel.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-outline-variant peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/60 bg-surface-container-lowest dark:bg-surface-container-low flex justify-end">
          <button
            onClick={() => setIsThemeCustomizerOpen(false)}
            className="px-6 py-2.5 rounded-lg bg-primary dark:bg-primary-container text-on-primary font-label-sm text-xs font-bold hover:bg-primary-container transition-colors shadow-xs"
          >
            Appliquer les préférences
          </button>
        </div>
      </div>
    </div>
  );
};
