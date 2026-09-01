import React, { createContext, useContext, useState } from 'react';
import { ActivityItem, AssignmentItem, Course, CourseLesson, DeadlineItem, Conversation, ViewType } from '../types';
import { initialActivities, initialAssignments, initialCourses, initialDeadlines, initialConversations } from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  courses: Course[];
  selectedCourse: Course;
  selectedLesson: CourseLesson | null;
  setSelectedCourseId: (courseId: string) => void;
  setSelectedLessonId: (lessonId: string) => void;
  activities: ActivityItem[];
  deadlines: DeadlineItem[];
  assignments: AssignmentItem[];
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  sendChatMessage: (text: string) => void;
  startNewConversation: (title?: string) => void;
  enrollInCourse: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  isCacheInspectorOpen: boolean;
  setIsCacheInspectorOpen: (open: boolean) => void;
  isThemeCustomizerOpen: boolean;
  setIsThemeCustomizerOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  triggerConfetti: () => void;
  floatingEduBotOpen: boolean;
  setFloatingEduBotOpen: (open: boolean) => void;
  notifications: Array<{ id: string; title: string; time: string; read: boolean }>;
  markNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourseId, setSelectedCourseIdState] = useState<string>('course-ai-intro');
  const [selectedLessonId, setSelectedLessonIdState] = useState<string>('lesson-3');
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [deadlines] = useState<DeadlineItem[]>(initialDeadlines);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(initialAssignments);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isCacheInspectorOpen, setIsCacheInspectorOpen] = useState<boolean>(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [floatingEduBotOpen, setFloatingEduBotOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Nouveau TP disponible : Architecture Neurones', time: 'Il y a 10 min', read: false },
    { id: '2', title: 'Rappel : Échéance Quiz IA demain à 23:59', time: 'Il y a 1 heure', read: false },
    { id: '3', title: 'Votre tuteur EduBot a répondu à votre question', time: 'Il y a 2 heures', read: true },
  ]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const findLesson = (): CourseLesson | null => {
    for (const mod of selectedCourse.modules) {
      const found = mod.lessons.find((l) => l.id === selectedLessonId);
      if (found) return found;
    }
    return selectedCourse.modules[0]?.lessons[0] || null;
  };

  const selectedLesson = findLesson();

  const setSelectedCourseId = (courseId: string) => {
    setSelectedCourseIdState(courseId);
    const course = courses.find((c) => c.id === courseId);
    if (course && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
      setSelectedLessonIdState(course.modules[0].lessons[0].id);
    }
  };

  const setSelectedLessonId = (lessonId: string) => {
    setSelectedLessonIdState(lessonId);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4b41e1', '#89f5e7', '#1a237e', '#ffd700'],
      });
    } catch {
      // ignore
    }
  };

  const enrollInCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isEnrolled: true, progressPercent: 5 } : c))
    );
    triggerConfetti();
  };

  const completeLesson = (courseId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const newModules = c.modules.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) =>
            l.id === lessonId ? { ...l, status: 'completed' as const } : l
          ),
        }));
        const newProgress = Math.min(100, c.progressPercent + 15);
        return {
          ...c,
          modules: newModules,
          progressPercent: newProgress,
        };
      })
    );

    // Add activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `Leçon terminée : ${selectedLesson?.title || 'Leçon'}`,
        description: 'Progression du cours mise à jour.',
        timestamp: 'À l\'instant',
        type: 'quiz',
        score: '+15%',
      },
      ...prev,
    ]);

    triggerConfetti();
  };

  const startNewConversation = (title: string = 'Nouvelle question de cours') => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title,
      preview: 'Commencez à poser vos questions...',
      timestamp: 'Maintenant',
      timeLabel: 'Aujourd\'hui',
      category: 'General',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: `Bonjour Alex ! Je suis l'EduBot, votre tuteur IA disponible 24/7. Je peux vous expliquer les cours, corriger votre code ou vous donner des exemples interactifs. Comment puis-je vous aider ?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'Explique-moi la rétropropagation',
            'Comment optimiser le lazy loading d\'images ?',
            'Exemple de structure React propre',
          ],
        },
      ],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-u-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeConversationId) return conv;
        return {
          ...conv,
          preview: text.substring(0, 45) + '...',
          timestamp: 'Maintenant',
          messages: [...conv.messages, userMsg],
        };
      })
    );

    // Generate responsive contextual AI answer
    setTimeout(() => {
      let aiResponseText = '';
      let codeSnippet: { language: string; code: string } | undefined = undefined;
      let note: string | undefined = undefined;
      let suggestions: string[] = ['Approfondir ce point', 'Tester avec un exemple', 'Autre question'];

      const lower = text.toLowerCase();
      if (lower.includes('accessibilit') || lower.includes('a11y') || lower.includes('bouton') || lower.includes('button')) {
        aiResponseText = `Pour garantir une conformité WCAG optimale, assurez-vous d'inclure des contrastes suffisants (au moins 4.5:1), des cibles tactiles de 44px minimum, et des attributs sémantiques explicites :`;
        codeSnippet = {
          language: 'html',
          code: `<button class="btn-primary" aria-label="Envoyer le formulaire">\n  <span class="icon" aria-hidden="true">send</span>\n  Envoyer\n</button>`,
        };
        note = `L'attribut aria-label fournit un contexte clair aux lecteurs d'écran, tandis que aria-hidden="true" masque les icônes purement décoratives.`;
        suggestions = ['Qu\'est-ce que l\'accessibilité web (a11y) ?', 'Comment tester avec un lecteur d\'écran ?', 'Contrastes de couleurs recommandés'];
      } else if (lower.includes('image') || lower.includes('fastimage') || lower.includes('cache') || lower.includes('lazy')) {
        aiResponseText = `L'utilisation d'un composant optimisé comme FastImage permet de réduire drastiquement l'empreinte mémoire et la latence réseau :`;
        codeSnippet = {
          language: 'tsx',
          code: `<FastImage\n  src={course.image}\n  alt={course.title}\n  lazy={true}\n  priority="high"\n  cacheControl="immutable"\n  showProgressIndicator={true}\n/>`,
        };
        note = `Le cache mémoire LRU combiné à l'IntersectionObserver garantit un défilement ultra-fluide à 60/120 FPS même avec de longues listes de médias.`;
        suggestions = ['Voir les statistiques de cache', 'Activer le mode économiseur de données', 'Simuler un réseau 3G'];
      } else if (lower.includes('neurone') || lower.includes('ia') || lower.includes('10:15')) {
        aiResponseText = `À 10:15 de la leçon, nous abordons l'architecture des couches profondes. Un réseau de neurones artificiel est structuré en couches successives :`;
        note = `• Couche d'entrée : reçoit les tenseurs de données.\n• Couches cachées : appliquent des pondérations W et biais b suivis d'activations non-linéaires.\n• Couche de sortie : calcule les probabilités softmax ou la régression.`;
        suggestions = ['Aller à 10:15 dans le lecteur', 'Exemple visuel', 'Fonction de coût'];
      } else {
        aiResponseText = `Excellente question ! Dans le cadre de votre formation EduSmart, ce concept est essentiel pour concevoir des architectures robustes et performantes. N'hésitez pas à tester le code directement dans vos TP.`;
        note = `Astuce : Vous pouvez aussi consulter les slides PDF dans l'onglet Ressources pour plus de détails.`;
      }

      const aiMsg = {
        id: `msg-a-${Date.now()}`,
        sender: 'ai' as const,
        text: aiResponseText,
        codeSnippet,
        note,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions,
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeConversationId) return conv;
          return {
            ...conv,
            messages: [...conv.messages, aiMsg],
          };
        })
      );
    }, 700);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        courses,
        selectedCourse,
        selectedLesson,
        setSelectedCourseId,
        setSelectedLessonId,
        activities,
        deadlines,
        assignments,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendChatMessage,
        startNewConversation,
        enrollInCourse,
        completeLesson,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        isCacheInspectorOpen,
        setIsCacheInspectorOpen,
        isThemeCustomizerOpen,
        setIsThemeCustomizerOpen,
        searchQuery,
        setSearchQuery,
        triggerConfetti,
        floatingEduBotOpen,
        setFloatingEduBotOpen,
        notifications,
        markNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
