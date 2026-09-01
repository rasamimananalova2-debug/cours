import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FastImage } from '../components/FastImage';
import { Play, CheckCircle, Clock, BookOpen, Sparkles, Award } from 'lucide-react';

export const MyCoursesView: React.FC = () => {
  const { courses, setSelectedCourseId, setCurrentView } = useApp();
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const enrolledCourses = courses.filter((c) => (c.progressPercent ?? 0) > 0 || c.isEnrolled);

  const filtered = enrolledCourses.filter((c) => {
    if (filter === 'in_progress') return (c.progressPercent ?? 0) < 100;
    if (filter === 'completed') return (c.progressPercent ?? 0) === 100;
    return true;
  });

  const handleOpenCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('player');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1280px] mx-auto w-full space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-background font-bold tracking-tight">
            Mes Formations
          </h1>
          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant mt-1">
            Suivez votre progression académique et reprenez vos cours là où vous vous êtes arrêté.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex bg-surface-container-lowest dark:bg-surface-container p-1 rounded-xl border border-outline-variant/60">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-primary dark:bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Tous ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'in_progress'
                ? 'bg-primary dark:bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'completed'
                ? 'bg-primary dark:bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Terminés
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-dashed border-outline-variant p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-outline mx-auto" />
          <h3 className="text-base font-bold text-on-surface">Aucun cours trouvé dans cette catégorie</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Explorez notre catalogue complet de masterclasses pour démarrer une nouvelle formation dès maintenant.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-xs shadow-xs hover:bg-primary-container transition-colors"
          >
            Explorer le catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/70 dark:border-outline-variant/40 shadow-xs hover:shadow-md hover:border-primary transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="aspect-video w-full bg-surface-container relative overflow-hidden">
                <FastImage
                  src={course.image}
                  alt={course.title}
                  priority="normal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-surface-container-lowest/90 dark:bg-surface-container-high/90 backdrop-blur-xs font-label-sm text-[11px] font-bold text-on-surface px-2.5 py-1 rounded shadow-xs">
                  {course.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-title-md text-base font-bold text-on-surface mb-1 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-outline-variant/40">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-on-surface-variant">Progression</span>
                    <span className="text-primary dark:text-primary-fixed font-bold">
                      {course.progressPercent || 0}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-500"
                      style={{ width: `${course.progressPercent || 0}%` }}
                    />
                  </div>

                  <button
                    onClick={() => handleOpenCourse(course.id)}
                    className="w-full h-10 bg-primary dark:bg-primary-container text-on-primary rounded-xl font-label-sm text-xs font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                  >
                    <span>Reprendre le cours</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
