import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewType } from '../types';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileCheck2,
  Mail,
  Settings,
  Sparkles,
  ArrowUpRight,
  HardDriveDownload,
  Palette,
} from 'lucide-react';
import { FastImage } from './FastImage';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, setIsUpgradeModalOpen, setIsCacheInspectorOpen, setIsThemeCustomizerOpen } = useApp();

  const navItems: Array<{ view: ViewType; label: string; icon: React.ReactNode }> = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { view: 'courses', label: 'My Courses', icon: <GraduationCap className="w-5 h-5" /> },
    { view: 'catalog', label: 'Catalog', icon: <BookOpen className="w-5 h-5" /> },
    { view: 'assignments', label: 'Assignments', icon: <FileCheck2 className="w-5 h-5" /> },
    { view: 'messages', label: 'Messages', icon: <Mail className="w-5 h-5" /> },
    { view: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNav = (view: ViewType) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      id="main-sidebar"
      className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-surface-container-lowest dark:bg-surface-container-lowest border-r border-outline-variant/70 dark:border-outline-variant/40 flex flex-col z-50 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-outline-variant/70 dark:border-outline-variant/40 shrink-0">
        <button
          onClick={() => handleNav('dashboard')}
          className="flex items-center gap-3 text-left w-full group focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-outline-variant/50 flex-shrink-0 bg-surface-container flex items-center justify-center shadow-xs">
            <FastImage
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaT-GCt5EsvaxidEhVQN3Ql3855CEKVngtEp7RqnPkhiO0IdyQRg0Z7TuBiYyZ1NB7ZAMg5uTJrjnhFGJ5DCv0lF7Pg6y2_63HkG10P_sern4PZqomJBXMjtsYI26J7AjtJle2U40yxWcR8V4SfTpk3Kd5FAKhtm0xY0ayBSRJ9R_ouqO9JS7syG-qHxQvOfcu2jqGd3EooXADzYrAYFLHHCl7H06igCPGG4cQrb1JliL4BOkrVMEtPQ"
              alt="EduSmart Logo"
              lazy={false}
              priority="high"
              showProgressIndicator={false}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <h1 className="font-headline-lg font-bold text-[20px] text-primary dark:text-primary-fixed leading-tight tracking-tight">
              EduSmart
            </h1>
            <span className="font-label-sm text-[11px] text-on-surface-variant tracking-wider uppercase">
              Academic Portal
            </span>
          </div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              id={`nav-${item.view}`}
              onClick={() => handleNav(item.view)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-label-sm text-[14px] font-medium transition-all duration-150 active:scale-98 ${
                isActive
                  ? 'border-l-4 border-primary dark:border-primary-fixed bg-surface-container-low dark:bg-surface-container-high text-primary dark:text-primary-fixed font-semibold shadow-xs'
                  : 'border-l-4 border-transparent text-on-surface-variant hover:bg-surface-container dark:hover:bg-surface-container-high hover:text-primary dark:hover:text-primary-fixed'
              }`}
            >
              <span className={isActive ? 'text-primary dark:text-primary-fixed' : 'text-on-surface-variant'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Quick Tools in Sidebar */}
        <div className="mt-4 pt-4 border-t border-outline-variant/50 dark:border-outline-variant/30 space-y-1">
          <span className="px-4 text-[10px] uppercase font-bold tracking-widest text-outline">
            Optimisation & Rendu
          </span>
          <button
            onClick={() => setIsCacheInspectorOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed hover:bg-surface-container rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <HardDriveDownload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              FastImage Cache
            </span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
              Actif
            </span>
          </button>

          <button
            onClick={() => setIsThemeCustomizerOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed hover:bg-surface-container rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-secondary" />
              Thèmes & a11y
            </span>
          </button>
        </div>
      </nav>

      {/* Upgrade Plan Call To Action */}
      <div className="p-4 border-t border-outline-variant/70 dark:border-outline-variant/40 shrink-0">
        <button
          id="btn-upgrade-plan"
          onClick={() => setIsUpgradeModalOpen(true)}
          className="w-full h-[44px] bg-primary dark:bg-primary-container text-on-primary font-label-sm text-[13px] font-semibold rounded-lg hover:bg-primary-container dark:hover:bg-primary transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 group cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-tertiary-fixed group-hover:rotate-12 transition-transform" />
          <span>Upgrade Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>
    </aside>
  );
};
