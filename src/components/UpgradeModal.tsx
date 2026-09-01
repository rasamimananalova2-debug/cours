import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Sparkles, Zap, ShieldCheck, DownloadCloud } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, triggerConfetti } = useApp();

  if (!isUpgradeModalOpen) return null;

  const handleUpgrade = () => {
    triggerConfetti();
    setIsUpgradeModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest dark:bg-surface-container-low w-full max-w-lg rounded-2xl border border-outline-variant/80 dark:border-outline-variant/40 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-container to-secondary p-6 text-white relative">
          <button
            onClick={() => setIsUpgradeModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 backdrop-blur-xs">
            <Sparkles className="w-6 h-6 text-tertiary-fixed" />
          </div>
          <h2 className="font-headline-lg text-2xl font-bold">EduSmart Pro Academic</h2>
          <p className="text-sm text-primary-fixed-dim mt-1">
            Débloquez toutes les formations, le tuteur EduBot illimité et le téléchargement hors-ligne FastImage.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-baseline gap-2 pb-4 border-b border-outline-variant/40">
            <span className="text-3xl font-extrabold text-primary dark:text-primary-fixed">19,99 €</span>
            <span className="text-xs text-on-surface-variant font-medium">/ mois (Sans engagement)</span>
          </div>

          <div className="space-y-3">
            {[
              { icon: <Zap className="w-4 h-4 text-secondary" />, text: 'Accès illimité à 100% des masterclasses (Tech, Design, Business, Langues)' },
              { icon: <Sparkles className="w-4 h-4 text-secondary" />, text: 'EduBot IA sans limite avec correction de code et analyses en direct' },
              { icon: <DownloadCloud className="w-4 h-4 text-secondary" />, text: 'Mise en cache ultra-rapide FastImage & téléchargement des vidéos 4K' },
              { icon: <ShieldCheck className="w-4 h-4 text-secondary" />, text: 'Certifications professionnelles accréditées partageables sur LinkedIn' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-xs text-on-surface">
                <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-secondary" />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant/50 bg-surface-container-low/50 dark:bg-surface-container/40 flex flex-col gap-2">
          <button
            onClick={handleUpgrade}
            className="w-full h-11 bg-primary dark:bg-primary-container text-on-primary font-label-sm text-sm font-bold rounded-xl hover:bg-primary-container transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-tertiary-fixed" />
            Commencer l'essai gratuit 14 jours
          </button>
          <p className="text-center text-[11px] text-outline">Annulation en 1 clic à tout moment depuis vos paramètres.</p>
        </div>
      </div>
    </div>
  );
};
