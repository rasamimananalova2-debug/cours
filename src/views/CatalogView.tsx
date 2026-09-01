import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FastImage } from '../components/FastImage';
import {
  Search,
  Star,
  Clock,
  BookOpen,
  Filter,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { courses, setSelectedCourseId, setCurrentView, enrollInCourse, searchQuery, setSearchQuery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');

  const categories = ['Tout', 'Tech', 'Design', 'Business', 'Langues'];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'Tout' || c.category === selectedCategory;
    const matchesQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const popularCourse = courses.find((c) => c.id === 'course-ux-ui') || courses[1];

  const handleStartCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('player');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1280px] mx-auto w-full space-y-8 animate-in fade-in duration-200">
      {/* Catalog Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-background font-bold tracking-tight">
            Catalogue de Formations
          </h1>
          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant mt-1">
            Découvrez nos programmes certifiants enseignés par des experts du secteur.
          </p>
        </div>

        {/* Search Bar in Catalog */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrer les cours..."
            className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest dark:bg-surface-container rounded-lg border border-outline-variant/70 text-xs text-on-surface focus:outline-hidden focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-label-sm text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-primary dark:bg-primary-container text-on-primary shadow-xs'
                : 'bg-surface-container-lowest dark:bg-surface-container border border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured / Formations Populaires Banner (Matching Screenshot 6) */}
      {selectedCategory === 'Tout' && !searchQuery && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-title-md text-xl font-bold text-on-background flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-tertiary-fixed fill-current" />
              Formations Populaires
            </h2>
            <span className="text-xs text-on-surface-variant font-medium">Sélection du mois</span>
          </div>

          <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/80 dark:border-outline-variant/40 p-6 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
            {/* FastImage Banner */}
            <div className="lg:col-span-6 aspect-video sm:aspect-16/9 lg:aspect-auto rounded-xl overflow-hidden bg-surface-container relative min-h-[220px]">
              <FastImage
                src={popularCourse.image}
                alt={popularCourse.title}
                priority="high"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-tertiary-fixed text-tertiary-container text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                ⭐ Recommandé
              </div>
            </div>

            {/* Course Info */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-label-sm text-xs text-secondary font-bold bg-surface-container px-2.5 py-0.5 rounded">
                    {popularCourse.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{popularCourse.rating}</span>
                    <span className="text-outline text-[11px]">({popularCourse.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface mb-2">
                  Masterclass UI/UX Design Avancé
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {popularCourse.description}
                </p>
              </div>

              {/* Instructor & Action */}
              <div className="pt-4 border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shrink-0">
                    <FastImage
                      src={popularCourse.instructor.avatar}
                      alt={popularCourse.instructor.name}
                      showProgressIndicator={false}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">{popularCourse.instructor.name}</h4>
                    <span className="text-[11px] text-on-surface-variant">{popularCourse.instructor.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-primary dark:text-primary-fixed">{popularCourse.price}</span>
                  <button
                    onClick={() => handleStartCourse(popularCourse.id)}
                    className="px-5 py-2.5 bg-primary dark:bg-primary-container text-on-primary font-label-sm text-xs font-bold rounded-lg hover:bg-primary-container transition-all shadow-xs active:scale-98 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Accéder au cours</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tous les cours Grid (Matching Screenshot 6) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-title-md text-xl font-bold text-on-background">
            {selectedCategory === 'Tout' ? 'Tous les cours' : `Cours en ${selectedCategory}`}
          </h2>
          <span className="font-label-sm text-xs text-outline font-medium">
            {filteredCourses.length} programmes disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = (course.progressPercent ?? 0) > 0 || course.isEnrolled;

            return (
              <div
                key={course.id}
                className="bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant/70 dark:border-outline-variant/40 shadow-xs hover:shadow-md hover:border-primary transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Course Image using FastImage */}
                <div className="aspect-video w-full bg-surface-container relative overflow-hidden">
                  <FastImage
                    src={course.image}
                    alt={course.title}
                    priority="normal"
                    lazy={true}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-surface-container-lowest/90 dark:bg-surface-container-high/90 backdrop-blur-xs font-label-sm text-[11px] font-bold text-on-surface px-2 py-0.5 rounded shadow-xs">
                    {course.category}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{course.rating}</span>
                        <span className="text-[10px] text-outline">({course.reviewsCount})</span>
                      </div>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.totalHours}
                      </span>
                    </div>

                    <h3 className="font-title-md text-base font-bold text-on-surface line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Instructor and Action Button */}
                  <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-outline-variant shrink-0">
                        <FastImage
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          showProgressIndicator={false}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-on-surface-variant truncate max-w-[100px]">
                        {course.instructor.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary dark:text-primary-fixed">
                        {course.price}
                      </span>
                      {isEnrolled ? (
                        <button
                          onClick={() => handleStartCourse(course.id)}
                          className="px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 font-label-sm text-xs font-bold transition-colors"
                        >
                          Accéder
                        </button>
                      ) : (
                        <button
                          onClick={() => enrollInCourse(course.id)}
                          className="px-3 py-1.5 rounded-lg bg-primary dark:bg-primary-container text-on-primary font-label-sm text-xs font-bold hover:bg-primary-container transition-colors shadow-2xs cursor-pointer"
                        >
                          S'inscrire
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
