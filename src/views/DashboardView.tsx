import React from 'react';
import { useApp } from '../context/AppContext';
import { FastImage } from '../components/FastImage';
import {
  Play,
  Flame,
  ArrowRight,
  MoreVertical,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Award,
  Sparkles,
  Bot,
  Layers,
  Code,
  Compass,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    courses,
    setSelectedCourseId,
    setCurrentView,
    activities,
    deadlines,
    startNewConversation,
  } = useApp();

  const featuredCourse = courses.find((c) => c.id === 'course-ai-intro') || courses[0];
  const uxCourse = courses.find((c) => c.id === 'course-ux-ui') || courses[1];
  const webCourse = courses.find((c) => c.id === 'course-web-fullstack') || courses[2];

  const handleContinueCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('player');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1280px] mx-auto w-full space-y-8 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-background font-bold tracking-tight">
            Bonjour, Alex ! 👋
          </h1>
          <p className="font-body-lg text-base sm:text-lg text-on-surface-variant mt-1">
            Prêt à continuer votre apprentissage ?
          </p>
        </div>

        {/* Weekly Goal Progress Widget */}
        <div className="flex items-center gap-4 bg-surface-container-lowest dark:bg-surface-container-low p-4 rounded-xl border border-outline-variant/70 dark:border-outline-variant/40 shadow-xs shrink-0">
          <div className="flex flex-col">
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Objectif Hebdo
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-title-md text-2xl font-bold text-primary dark:text-primary-fixed">12</span>
              <span className="font-body-md text-sm text-on-surface-variant">/ 15h</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-surface-container dark:border-surface-container-highest flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                className="text-surface-container dark:text-surface-container-highest"
                strokeWidth="3.5"
                fill="none"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                className="stroke-primary dark:stroke-primary-fixed transition-all duration-500"
                strokeWidth="3.5"
                strokeDasharray="80, 100"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <Flame className="w-5 h-5 text-primary dark:text-primary-fixed fill-current" />
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Courses & Activity) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Section: En cours (Bento Grid) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-title-md text-xl font-bold text-on-background">En cours</h2>
              <button
                onClick={() => setCurrentView('courses')}
                className="font-label-sm text-xs text-primary dark:text-primary-fixed hover:underline flex items-center gap-1 font-semibold group"
              >
                Voir tout
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: Featured Course (Large Span) */}
              <div className="md:col-span-2 bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant/70 dark:border-outline-variant/40 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row gap-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary dark:bg-primary-fixed group-hover:w-2.5 transition-all duration-300" />
                
                {/* Course Image using FastImage with custom progress */}
                <div className="w-full md:w-5/12 aspect-video md:aspect-auto rounded-lg overflow-hidden bg-surface-container relative min-h-[160px]">
                  <FastImage
                    src={featuredCourse.image}
                    alt={featuredCourse.title}
                    priority="high"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs text-primary dark:text-primary-fixed font-label-sm text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                    {featuredCourse.badge || 'Dernière session'}
                  </span>
                </div>

                {/* Course Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-label-sm text-xs font-semibold text-secondary bg-surface-container-low dark:bg-surface-container px-2.5 py-1 rounded-md">
                        Module 4
                      </span>
                      <button className="text-outline hover:text-primary p-1 rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-title-md text-lg sm:text-xl font-bold text-on-background mb-1">
                      {featuredCourse.title}
                    </h3>
                    <p className="font-body-md text-xs sm:text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                      {featuredCourse.description}
                    </p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between font-label-sm text-xs">
                      <span className="text-on-surface-variant font-medium">Progression globale</span>
                      <span className="font-bold text-primary dark:text-primary-fixed">
                        {featuredCourse.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary transition-all duration-500 rounded-full"
                        style={{ width: `${featuredCourse.progressPercent}%` }}
                      />
                    </div>
                    <button
                      id="btn-continue-ai-course"
                      onClick={() => handleContinueCourse(featuredCourse.id)}
                      className="w-full h-11 bg-primary dark:bg-primary-container text-on-primary font-label-sm text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-container dark:hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98 cursor-pointer"
                    >
                      <span>Continuer la leçon</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: UX/UI Design */}
              <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant/70 dark:border-outline-variant/40 p-5 shadow-xs hover:border-primary transition-colors flex flex-col justify-between">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-surface-container-high dark:bg-surface-container flex items-center justify-center text-primary dark:text-primary-fixed shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-title-md text-base font-bold text-on-background leading-tight">
                      {uxCourse.title}
                    </h3>
                    <span className="font-label-sm text-xs text-on-surface-variant font-medium">
                      Projet en cours
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/40">
                  <div className="flex justify-between font-label-sm text-xs mb-2">
                    <span className="text-on-surface-variant">Progression</span>
                    <span className="font-bold text-primary dark:text-primary-fixed">
                      {uxCourse.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${uxCourse.progressPercent}%` }}
                    />
                  </div>
                  <button
                    onClick={() => handleContinueCourse(uxCourse.id)}
                    className="w-full h-10 bg-transparent border border-primary dark:border-primary-fixed text-primary dark:text-primary-fixed font-label-sm text-xs font-semibold rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors active:scale-98"
                  >
                    Continuer
                  </button>
                </div>
              </div>

              {/* Card 3: Fullstack Dev */}
              <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant/70 dark:border-outline-variant/40 p-5 shadow-xs hover:border-primary transition-colors flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-surface-container-high/40 dark:bg-surface-container/20 rounded-bl-full pointer-events-none" />
                <div className="flex items-center gap-3.5 mb-4 relative z-10">
                  <div className="w-11 h-11 rounded-lg bg-surface-container-high dark:bg-surface-container flex items-center justify-center text-primary dark:text-primary-fixed shrink-0">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-title-md text-base font-bold text-on-background leading-tight">
                      {webCourse.title}
                    </h3>
                    <span className="font-label-sm text-xs text-on-surface-variant font-medium">
                      Module final
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/40 relative z-10">
                  <div className="flex justify-between font-label-sm text-xs mb-2">
                    <span className="text-on-surface-variant">Progression</span>
                    <span className="font-bold text-primary dark:text-primary-fixed">
                      {webCourse.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${webCourse.progressPercent}%` }}
                    />
                  </div>
                  <button
                    onClick={() => handleContinueCourse(webCourse.id)}
                    className="w-full h-10 bg-transparent border border-primary dark:border-primary-fixed text-primary dark:text-primary-fixed font-label-sm text-xs font-semibold rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors active:scale-98"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Activité Récente */}
          <section>
            <h2 className="font-title-md text-xl font-bold text-on-background mb-4">
              Activité Récente
            </h2>
            <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant/70 dark:border-outline-variant/40 p-6 shadow-xs">
              <div className="relative border-l-2 border-outline-variant/50 ml-3 space-y-6">
                {activities.map((act) => (
                  <div key={act.id} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface-container-lowest dark:bg-surface-container-low border-2 border-primary dark:border-primary-fixed flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-fixed" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <p className="font-body-md text-sm text-on-background font-medium">
                          {act.title}
                        </p>
                        {act.description && (
                          <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                            {act.description}
                          </p>
                        )}
                        {act.linkText && (
                          <a
                            href={act.linkUrl || '#'}
                            className="inline-flex items-center gap-1 font-label-sm text-xs text-secondary hover:underline mt-1.5 bg-surface-container dark:bg-surface-container-high px-2 py-1 rounded"
                          >
                            <FileText className="w-3 h-3" />
                            {act.linkText}
                          </a>
                        )}
                      </div>
                      <span className="font-label-sm text-xs text-outline shrink-0">
                        {act.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {}}
                className="w-full mt-6 py-2.5 text-center font-label-sm text-xs font-semibold text-primary dark:text-primary-fixed hover:bg-surface-container-low dark:hover:bg-surface-container rounded-lg transition-colors border border-outline-variant/30"
              >
                Charger plus d'activités
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Deadlines & AI Tutor Mini-Widget */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Prochaines échéances */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant/70 dark:border-outline-variant/40 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-title-md text-lg font-bold text-on-background">
                Prochaines échéances
              </h2>
              <button
                onClick={() => setCurrentView('assignments')}
                className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>

            <ul className="space-y-3">
              {deadlines.map((dl) => (
                <li
                  key={dl.id}
                  onClick={() => setCurrentView('assignments')}
                  className="flex gap-3.5 items-start p-3 rounded-lg hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors cursor-pointer border border-transparent hover:border-outline-variant/40"
                >
                  <div
                    className={`flex flex-col items-center justify-center min-w-[44px] h-11 rounded-lg font-bold text-sm ${
                      dl.isUrgent
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-surface-container-high dark:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span>{dl.dateBadge}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body-md text-sm font-semibold text-on-background truncate">
                      {dl.title}
                    </h4>
                    <p
                      className={`font-label-sm text-xs flex items-center gap-1 mt-0.5 ${
                        dl.isUrgent ? 'text-error font-medium' : 'text-on-surface-variant'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {dl.timeRemaining}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Assistant Mini-Widget */}
          <div className="bg-gradient-to-br from-primary-container to-surface-tint rounded-xl p-6 text-white shadow-md relative overflow-hidden group">
            {/* Decorative ambient blur */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center mb-3 shadow-inner relative">
                <span className="absolute inset-0 rounded-full border-2 border-tertiary-fixed animate-ping opacity-25" />
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-title-md text-lg font-bold text-white mb-1">
                EduBot IA
              </h3>
              <p className="font-body-md text-xs text-primary-fixed-dim mb-5 max-w-[220px]">
                Besoin d'aide ? Posez une question à votre tuteur IA.
              </p>
              <button
                id="btn-start-edubot-chat"
                onClick={() => {
                  startNewConversation();
                  setCurrentView('messages');
                }}
                className="w-full bg-surface-container-lowest text-primary dark:text-primary h-11 rounded-lg font-label-sm text-xs font-bold hover:bg-surface-container-high transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>Démarrer le chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
