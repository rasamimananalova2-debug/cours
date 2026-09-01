import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { ColorPalette, FontSizeScale, NetworkThrottle, ThemeMode } from '../types';
import { FastImage } from '../components/FastImage';
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Type,
  Eye,
  Zap,
  Wifi,
  HardDriveDownload,
  Check,
  Shield,
  User,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    setMode,
    setPalette,
    setFontSize,
    setHighContrast,
    setReducedMotion,
    setDataSaver,
    setNetworkThrottle,
  } = useTheme();

  const { setIsCacheInspectorOpen } = useApp();

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
    <div className="p-4 sm:p-6 md:p-8 max-w-[1000px] mx-auto w-full space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-background font-bold tracking-tight">
          Paramètres & Accessibilité
        </h1>
        <p className="font-body-lg text-sm sm:text-base text-on-surface-variant mt-1">
          Personnalisez votre expérience d'apprentissage, optimisez les performances et configurez vos thèmes.
        </p>
      </div>

      {/* Profile summary */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/70 dark:border-outline-variant/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary shrink-0">
            <FastImage
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnJwiGsh5QMAu6kCB92k41hJ36gtddxQ8QYxE8taczb7rEPe7pOII42RKdvDr0tbl05NC85hlcQr160GXKemNKRrG3CLimHUO7FQ3Qv5vfDeSjkZTaBQvsZfxL_vPCuGwiDp_0-1AQT9-b5sFv_N6j2PxI0zdHnN2JW14ipFEfnhS5OMUdmZt7E-lN8byRVeBQZm_iXuJ3KBmW-KDr7ZdY55rNEXNbu_mDPUoBSs0t6uMe3XtD6BA2jg"
              alt="Alex D."
              showProgressIndicator={false}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-title-md text-base font-bold text-on-surface">Alex Dupont</h3>
            <p className="text-xs text-on-surface-variant">alex.d@edusmart.ac • Étudiant Master IA</p>
          </div>
        </div>
        <span className="self-start sm:self-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          Compte Vérifié
        </span>
      </div>

      {/* Visual Theming & Dark Mode */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/70 dark:border-outline-variant/40 p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-title-md text-base font-bold text-on-surface">Mode Sombre & Thème Graphique</h2>
            <p className="text-xs text-on-surface-variant">Choisissez le mode d'affichage natif et votre univers chromatique.</p>
          </div>
        </div>

        {/* Mode selector */}
        <div>
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-3">
            Mode d'affichage
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light' as ThemeMode, label: 'Mode Clair', icon: <Sun className="w-4 h-4" /> },
              { id: 'dark' as ThemeMode, label: 'Mode Sombre Natif', icon: <Moon className="w-4 h-4" /> },
              { id: 'system' as ThemeMode, label: 'Automatique / Système', icon: <Monitor className="w-4 h-4" /> },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border text-xs font-semibold transition-all ${
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

        {/* Palettes */}
        <div>
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-3">
            Palettes de couleurs avancées
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {palettes.map((p) => {
              const isSelected = settings.palette === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPalette(p.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary dark:border-primary-fixed bg-surface-container-low dark:bg-surface-container shadow-xs'
                      : 'border-outline-variant/60 bg-surface-container-lowest dark:bg-surface hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-on-surface">{p.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: p.primary }} />
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: p.secondary }} />
                      {isSelected && <Check className="w-4 h-4 text-primary dark:text-primary-fixed ml-1" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/70 dark:border-outline-variant/40 p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-title-md text-base font-bold text-on-surface">Accessibilité & Lisibilité</h2>
            <p className="text-xs text-on-surface-variant">Options conçues pour une lisibilité maximale et un confort visuel durable.</p>
          </div>
        </div>

        {/* Font scale */}
        <div>
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-3">
            Échelle typographique
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'normal' as FontSizeScale, label: 'Standard (100%)', sub: 'Taille recommandée' },
              { id: 'large' as FontSizeScale, label: 'Confort (110%)', sub: 'Pour écran standard' },
              { id: 'xlarge' as FontSizeScale, label: 'Grand (120%)', sub: 'Lisibilité haute' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setFontSize(s.id)}
                className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                  settings.fontSize === s.id
                    ? 'border-primary bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed shadow-xs'
                    : 'border-outline-variant/60 bg-surface text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span>{s.label}</span>
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">{s.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-on-surface">Mode Contraste Renforcé (WCAG AAA)</span>
              <p className="text-[11px] text-on-surface-variant">Augmente les délimitations et contrastes textuels.</p>
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
              <span className="text-xs font-bold text-on-surface">Réduction des mouvements (Reduced Motion)</span>
              <p className="text-[11px] text-on-surface-variant">Minimise les effets visuels animés.</p>
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

      {/* FastImage & Performance Center */}
      <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/70 dark:border-outline-variant/40 p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-title-md text-base font-bold text-on-surface">Moteur FastImage & Bande Passante</h2>
              <p className="text-xs text-on-surface-variant">Contrôles de mise en cache, lazy loading et simulation réseau.</p>
            </div>
          </div>

          <button
            onClick={() => setIsCacheInspectorOpen(true)}
            className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors"
          >
            Ouvrir l'inspecteur
          </button>
        </div>

        {/* Network simulator */}
        <div>
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-3 flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-primary dark:text-primary-fixed" />
            Simulateur de vitesse de connexion
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['fast', '3g', 'slow', 'offline'] as NetworkThrottle[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setNetworkThrottle(mode)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
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
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
          <div>
            <span className="text-xs font-bold text-on-surface">Mode Économiseur de Données (Data Saver)</span>
            <p className="text-[11px] text-on-surface-variant">Bloque le préchargement agressif pour réduire la consommation mobile.</p>
          </div>
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
    </div>
  );
};
