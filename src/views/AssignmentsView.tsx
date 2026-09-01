import React from 'react';
import { useApp } from '../context/AppContext';
import { FileCheck2, Clock, CheckCircle2, AlertCircle, Sparkles, Upload } from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const { assignments, triggerConfetti } = useApp();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1280px] mx-auto w-full space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-background font-bold tracking-tight">
          Devoirs & Travaux Pratiques
        </h1>
        <p className="font-body-lg text-sm sm:text-base text-on-surface-variant mt-1">
          Gérez vos rendus de projets, soumettez vos codes et consultez vos notes d'évaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/70 dark:border-outline-variant/40 p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-label-sm text-xs font-semibold text-secondary bg-surface-container px-2.5 py-0.5 rounded">
                  {item.courseTitle}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    item.status === 'graded'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {item.status === 'graded' ? `Noté : ${item.grade}` : item.dueDate}
                </span>
              </div>

              <h3 className="font-title-md text-base font-bold text-on-surface mb-2">{item.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
              <span className="text-xs text-outline font-medium">Barème: {item.maxGrade}</span>
              {item.status === 'pending' ? (
                <button
                  onClick={() => triggerConfetti()}
                  className="px-4 py-2 bg-primary dark:bg-primary-container text-on-primary rounded-xl font-semibold text-xs flex items-center gap-1.5 hover:bg-primary-container transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Déposer mon rendu</span>
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Validé
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
