import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  Palette,
  HardDriveDownload,
  Check,
  Zap,
} from 'lucide-react';
import { FastImage } from './FastImage';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    searchQuery,
    setSearchQuery,
    setCurrentView,
    setIsCacheInspectorOpen,
    setIsThemeCustomizerOpen,
    notifications,
    markNotificationsAsRead,
  } = useApp();
  const { isDark, toggleDarkMode } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('catalog');
    }
  };

  return (
    <header
      id="top-header"
      className="h-16 bg-surface-container-lowest dark:bg-surface-container-lowest border-b border-outline-variant/70 dark:border-outline-variant/40 flex justify-between items-center px-4 md:px-8 w-full sticky top-0 z-40 shadow-xs transition-colors"
    >
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          id="btn-mobile-menu"
          onClick={onToggleMobileMenu}
          aria-label="Ouvrir le menu"
          className="md:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des cours, des documents..."
            className="w-full h-10 pl-10 pr-9 bg-surface dark:bg-surface-container-low rounded-lg border border-outline-variant/70 dark:border-outline-variant/40 font-body-md text-[14px] text-on-surface placeholder:text-outline focus:outline-hidden focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary-fixed/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Right: Action Buttons & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* FastImage Cache Inspector Trigger */}
        <button
          id="btn-open-cache-hud"
          onClick={() => setIsCacheInspectorOpen(true)}
          title="Inspecteur FastImage & Cache Réseau"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="hidden lg:inline">FastImage Cache</span>
        </button>

        {/* Theme Customizer Trigger */}
        <button
          id="btn-open-theme-customizer"
          onClick={() => setIsThemeCustomizerOpen(true)}
          title="Personnaliser les thèmes & Accessibilité"
          className="p-2 text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed rounded-lg hover:bg-surface-container transition-colors relative"
        >
          <Palette className="w-5 h-5" />
        </button>

        {/* Dark Mode Native Toggle */}
        <button
          id="btn-toggle-dark-mode"
          onClick={toggleDarkMode}
          title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          className="p-2 text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed rounded-lg hover:bg-surface-container transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="btn-notifications-drawer"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            title="Notifications"
            className="p-2 text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed rounded-lg hover:bg-surface-container transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface-container-lowest ring-1 ring-error animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant/80 dark:border-outline-variant/40 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
                <span className="font-title-md text-[15px] font-bold text-on-surface">
                  Notifications ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markNotificationsAsRead}
                    className="text-xs text-secondary hover:underline flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3 h-3" /> Tout marquer lu
                  </button>
                )}
              </div>
              <div className="divide-y divide-outline-variant/30 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`py-2.5 px-1 flex flex-col gap-0.5 text-left ${
                      !n.read ? 'bg-primary-fixed/20 dark:bg-primary-fixed-dim/10 rounded-md' : ''
                    }`}
                  >
                    <p className="text-xs text-on-surface font-medium leading-snug">{n.title}</p>
                    <span className="text-[10px] text-outline">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-outline-variant/60 mx-1 hidden sm:block" />

        {/* User Profile */}
        <div className="relative">
          <button
            id="btn-user-profile"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant flex-shrink-0 bg-surface-container">
              <FastImage
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnJwiGsh5QMAu6kCB92k41hJ36gtddxQ8QYxE8taczb7rEPe7pOII42RKdvDr0tbl05NC85hlcQr160GXKemNKRrG3CLimHUO7FQ3Qv5vfDeSjkZTaBQvsZfxL_vPCuGwiDp_0-1AQT9-b5sFv_N6j2PxI0zdHnN2JW14ipFEfnhS5OMUdmZt7E-lN8byRVeBQZm_iXuJ3KBmW-KDr7ZdY55rNEXNbu_mDPUoBSs0t6uMe3XtD6BA2jg"
                alt="Alex D. Profile"
                priority="high"
                lazy={false}
                showProgressIndicator={false}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:block font-label-sm text-[13px] text-on-surface font-semibold">
              Alex D.
            </span>
          </button>

          {showProfileMenu && (
            <div
              id="profile-dropdown"
              className="absolute right-0 mt-2 w-64 bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant/80 dark:border-outline-variant/40 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/40">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
                  <FastImage
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnJwiGsh5QMAu6kCB92k41hJ36gtddxQ8QYxE8taczb7rEPe7pOII42RKdvDr0tbl05NC85hlcQr160GXKemNKRrG3CLimHUO7FQ3Qv5vfDeSjkZTaBQvsZfxL_vPCuGwiDp_0-1AQT9-b5sFv_N6j2PxI0zdHnN2JW14ipFEfnhS5OMUdmZt7E-lN8byRVeBQZm_iXuJ3KBmW-KDr7ZdY55rNEXNbu_mDPUoBSs0t6uMe3XtD6BA2jg"
                    alt="Alex D."
                    showProgressIndicator={false}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Alex Dupont</h4>
                  <p className="text-xs text-on-surface-variant">alex.d@edusmart.ac</p>
                </div>
              </div>
              <div className="pt-3 space-y-1 text-xs font-medium">
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
                >
                  Paramètres du compte & Accessibilité
                </button>
                <button
                  onClick={() => {
                    setCurrentView('courses');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
                >
                  Mes certifications & Relevé
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
