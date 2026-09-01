import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FastImage } from '../components/FastImage';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings as SettingsIcon,
  Subtitles,
  CheckCircle2,
  Lock,
  PlayCircle,
  FileDown,
  ExternalLink,
  BookOpen,
  Bot,
  Send,
  Zap,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sparkles,
} from 'lucide-react';

export const CoursePlayerView: React.FC = () => {
  const {
    selectedCourse,
    selectedLesson,
    setSelectedLessonId,
    setCurrentView,
    completeLesson,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sommaire' | 'ressources' | 'assistant'>('assistant');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(615); // 10:15 in seconds
  const totalDurationSec = selectedLesson?.durationSeconds || 1960; // 32:40
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; note?: string; actions?: string[] }>>([
    {
      sender: 'ai',
      text: 'Bonjour ! Je suis l\'EduBot. Je peux vous aider à comprendre les concepts de cette vidéo. Avez-vous une question spécifique sur la leçon d\'aujourd\'hui ?',
    },
    {
      sender: 'user',
      text: 'Peux-tu m\'expliquer le concept de réseaux de neurones mentionné à 10:15 ?',
    },
    {
      sender: 'ai',
      text: 'Bien sûr ! À 10:15, le professeur compare les réseaux de neurones artificiels au cerveau humain.\n\nEn termes simples, un réseau de neurones est constitué de couches de "nœuds" (ou neurones artificiels) :\n\n• Une couche d\'entrée qui reçoit les données (comme les pixels d\'une image).\n• Des couches cachées qui effectuent des calculs mathématiques sur ces données, en cherchant des motifs.\n• Une couche de sortie qui donne le résultat final (par exemple, "c\'est un chat").',
      note: 'L\'idée clé est que les connexions entre ces nœuds ont un "poids" qui s\'ajuste pendant l\'apprentissage, permettant au réseau de s\'améliorer avec l\'expérience.',
      actions: ['Aller à 10:15', 'Exemple visuel'],
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTimeSec(Number(e.target.value));
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userText = inputQuestion;
    setInputQuestion('');

    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Dans cette séquence vidéo à ${formatTime(currentTimeSec)}, ce point est crucial pour comprendre le fonctionnement global. Les paramètres apprennent par descente de gradient avec un taux d'apprentissage optimisé.`,
          note: 'Vous pouvez tester le notebook Colab associé dans l\'onglet Ressources pour voir le code en action.',
          actions: ['Aller au marqueur', 'Voir le code Colab'],
        },
      ]);
    }, 600);
  };

  const handleJumpToTime = (timestampStr: string) => {
    if (timestampStr.includes('10:15')) {
      setCurrentTimeSec(615);
      setIsPlaying(true);
    }
  };

  const handleCompleteCurrent = () => {
    if (selectedLesson) {
      completeLesson(selectedCourse.id, selectedLesson.id);
    }
  };

  // Find all lessons flattened for navigation
  const allLessons = selectedCourse.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === selectedLesson?.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedLessonId(allLessons[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < allLessons.length - 1) {
      setSelectedLessonId(allLessons[currentIndex + 1].id);
    } else {
      handleCompleteCurrent();
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-on-background font-body-md">
      {/* Top Navigation (Header matching Screenshot 1) */}
      <header className="bg-surface-container-lowest dark:bg-surface-container-low h-16 border-b border-outline-variant/70 dark:border-outline-variant/40 flex justify-between items-center px-4 md:px-8 w-full shrink-0 z-20">
        <div className="flex items-center gap-3 md:gap-4 truncate">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 group text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-primary dark:text-primary-fixed group-hover:-translate-x-1 transition-transform" />
            <span className="font-label-sm text-xs font-semibold uppercase tracking-wider hidden sm:inline">
              Retour au tableau de bord
            </span>
          </button>
          <div className="h-5 w-px bg-outline-variant/60 mx-1 hidden sm:block" />
          <h1 className="font-title-md text-sm md:text-base font-bold text-primary dark:text-primary-fixed truncate">
            {selectedCourse.title} & Réseaux de Neurones
          </h1>
        </div>

        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <div className="hidden md:flex items-center gap-2.5">
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">
              Progression: {selectedCourse.progressPercent}%
            </span>
            <div className="w-32 h-1.5 bg-surface-container dark:bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: `${selectedCourse.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant">
              <FastImage
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXoEW0b9clVDK_4SkmUytSoGTvg6xjG9mSlevQlIG14Yu3czBSPhgXPbMNji8YohXAnA75SphHVfRoYl5fLjAWu0UVdsxjBe0R7Tp_Kco0R5riPMyDBWAtXj7Xnzy2jUE0TwFSOHKXsJogbkPo290MlRBaiCqmcFidTrv4JP2Bz1NG6pBpBFc800-PrYDj78n8FXpARX6HS1HmBEd7NEh_LMZ8Ion4GQzTipHNS3ljr-FSzYVbySUBNA"
                alt="User Profile"
                showProgressIndicator={false}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Video & Context Split View */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left: Video Player Area */}
        <section className="flex-1 flex flex-col bg-slate-950 relative z-0 min-h-[300px]">
          {/* Interactive Video Container */}
          <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden group">
            {/* Neural Network Video Poster with FastImage */}
            <div className="absolute inset-0 w-full h-full">
              <FastImage
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxG1yNV4qihl4gfhYXBlxpHgRn02hbpo3Gc7BQ27j6zjsD9AbGJyhTno_Zgg4lZ5jV9sYBDkANHwdH-8RInKHwcepyTJrYdoLE3yEN2XMg1P1xe1iZEDCV5ljSwjHuN0z4SF3qXa_meGAYvdzTD8kkrl0_0SS0la8WEUH9nMw2EqNDft-WRgtwf_MLi2lpWNxuYLAxvnMEAvgdFEoYaOAJ_mZ_7xsmqeOWsnO6p4tdG67FQwNVsFN6EA"
                alt="Video Still Neural Network"
                priority="high"
                lazy={false}
                className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-101"
              />
            </div>

            {/* Play Button Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full bg-primary/80 dark:bg-primary-container/80 text-white flex items-center justify-center z-10 hover:bg-primary hover:scale-105 transition-all duration-300 shadow-2xl backdrop-blur-xs group-hover:opacity-100 opacity-90 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>

            {/* Video Controls (Bottom Gradient) */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              {/* Timeline Track & Scrubber */}
              <div className="w-full relative mb-3 cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max={totalDurationSec}
                  value={currentTimeSec}
                  onChange={handleTimelineChange}
                  className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer accent-secondary focus:outline-hidden"
                />
              </div>

              {/* Controls bar */}
              <div className="flex justify-between items-center text-white text-xs">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-secondary transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setIsMuted(!isMuted)} className="hover:text-secondary transition-colors">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="font-label-sm font-medium tracking-wide">
                    {formatTime(currentTimeSec)} / {formatTime(totalDurationSec)}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <button title="Sous-titres" className="hover:text-secondary transition-colors">
                    <Subtitles className="w-4 h-4" />
                  </button>
                  <button title="Qualité" className="hover:text-secondary transition-colors">
                    <SettingsIcon className="w-4 h-4" />
                  </button>
                  <button title="Plein écran" className="hover:text-secondary transition-colors">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Title & Info */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-low p-5 sm:p-6 border-b border-outline-variant/70 dark:border-outline-variant/40 shrink-0">
            <h2 className="font-title-md text-lg sm:text-xl font-bold text-on-surface mb-1">
              {selectedLesson?.title || 'Leçon 3: Architecture des Réseaux de Neurones'}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {selectedLesson?.summary ||
                'Comprendre les couches cachées, les poids et l\'apprentissage par propagation arrière.'}
            </p>
          </div>
        </section>

        {/* Right: Tabs & Context Area */}
        <aside className="w-full lg:w-[420px] xl:w-[480px] bg-surface-container-lowest dark:bg-surface-container-low border-l border-outline-variant/70 dark:border-outline-variant/40 flex flex-col z-10 shrink-0">
          {/* Tabs Navigation */}
          <div className="flex border-b border-outline-variant/70 dark:border-outline-variant/40 px-2 pt-2 bg-surface-container-lowest dark:bg-surface-container-low">
            <button
              id="tab-sommaire"
              onClick={() => setActiveTab('sommaire')}
              className={`flex-1 py-3 px-3 text-center border-b-2 font-label-sm text-xs font-semibold transition-colors ${
                activeTab === 'sommaire'
                  ? 'border-primary dark:border-primary-fixed text-primary dark:text-primary-fixed bg-surface-container-low dark:bg-surface-container'
                  : 'border-transparent text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Sommaire du cours
            </button>
            <button
              id="tab-ressources"
              onClick={() => setActiveTab('ressources')}
              className={`flex-1 py-3 px-3 text-center border-b-2 font-label-sm text-xs font-semibold transition-colors ${
                activeTab === 'ressources'
                  ? 'border-primary dark:border-primary-fixed text-primary dark:text-primary-fixed bg-surface-container-low dark:bg-surface-container'
                  : 'border-transparent text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Ressources
            </button>
            <button
              id="tab-assistant"
              onClick={() => setActiveTab('assistant')}
              className={`flex-1 py-3 px-3 text-center border-b-2 font-label-sm text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'assistant'
                  ? 'border-primary dark:border-primary-fixed text-primary dark:text-primary-fixed bg-surface-container-low dark:bg-surface-container'
                  : 'border-transparent text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              Assistant IA
            </button>
          </div>

          {/* TAB 1: Sommaire */}
          {activeTab === 'sommaire' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {selectedCourse.modules.map((mod) => (
                <div key={mod.id} className="space-y-1.5">
                  <h3 className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-bold ml-2">
                    {mod.title}
                  </h3>
                  <div className="space-y-1">
                    {mod.lessons.map((lesson) => {
                      const isCurrent = lesson.id === selectedLesson?.id;
                      const isCompleted = lesson.status === 'completed';
                      const isLocked = lesson.status === 'locked';

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            if (!isLocked) setSelectedLessonId(lesson.id);
                          }}
                          disabled={isLocked}
                          className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${
                            isCurrent
                              ? 'bg-surface-container-low dark:bg-surface-container border-l-4 border-primary dark:border-primary-fixed shadow-2xs'
                              : isLocked
                              ? 'opacity-60 cursor-not-allowed'
                              : 'hover:bg-surface-container'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                          ) : isCurrent ? (
                            <PlayCircle className="w-4 h-4 text-primary dark:text-primary-fixed mt-0.5 shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-outline mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-body-md text-xs truncate ${
                                isCurrent
                                  ? 'text-primary dark:text-primary-fixed font-bold'
                                  : 'text-on-surface'
                              }`}
                            >
                              {lesson.title}
                            </div>
                            <div className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">
                              {lesson.duration} {isCurrent && '• En cours'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Ressources */}
          {activeTab === 'ressources' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-3 text-xs">
              <h3 className="font-title-md text-sm font-bold text-on-surface mb-3">
                Ressources associées
              </h3>

              {selectedCourse.resources.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  download={res.type === 'pdf'}
                  className="flex items-center p-3.5 border border-outline-variant/60 dark:border-outline-variant/40 rounded-xl hover:bg-surface-container hover:border-outline transition-all group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 shrink-0 ${
                      res.type === 'pdf'
                        ? 'bg-error/10 text-error'
                        : res.type === 'code'
                        ? 'bg-primary/10 text-primary dark:text-primary-fixed'
                        : 'bg-tertiary-fixed/20 text-tertiary-container dark:text-tertiary-fixed'
                    }`}
                  >
                    {res.type === 'pdf' ? (
                      <FileDown className="w-5 h-5" />
                    ) : res.type === 'code' ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      <BookOpen className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-body-md text-xs font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                      {res.title}
                    </div>
                    <div className="font-label-sm text-[11px] text-on-surface-variant">
                      {res.sizeOrTime}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-outline group-hover:text-primary transition-colors shrink-0" />
                </a>
              ))}
            </div>
          )}

          {/* TAB 3: Assistant IA (Active by default matching Screenshot 1 & 3) */}
          {activeTab === 'assistant' && (
            <div className="flex-1 flex flex-col h-full bg-surface-bright dark:bg-surface-dim/40 relative">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end max-w-[85%] ml-auto' : 'justify-start max-w-[95%]'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center shrink-0 shadow-xs text-white mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed shadow-2xs ${
                        msg.sender === 'user'
                          ? 'bg-primary dark:bg-primary-container text-on-primary rounded-tr-xs'
                          : 'bg-surface-container dark:bg-surface-container-high text-on-surface rounded-tl-xs border border-outline-variant/30'
                      }`}
                    >
                      <div className="whitespace-pre-line text-xs">{msg.text}</div>

                      {msg.note && (
                        <div className="mt-3 bg-surface-container-highest dark:bg-surface-container p-2.5 rounded-lg border-l-2 border-secondary text-[11px] italic text-on-surface">
                          {msg.note}
                        </div>
                      )}

                      {msg.actions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.actions.map((act, actIdx) => (
                            <button
                              key={actIdx}
                              onClick={() => handleJumpToTime(act)}
                              className="px-3 py-1 rounded-full border border-outline-variant/60 font-label-sm text-[11px] text-on-surface-variant hover:bg-surface-container-high transition-colors"
                            >
                              {act}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-surface-container-lowest dark:bg-surface-container-low border-t border-outline-variant/60 shrink-0">
                <form onSubmit={handleSendChat} className="relative flex items-end bg-surface dark:bg-surface-container rounded-xl border border-outline-variant/70 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow">
                  <textarea
                    rows={1}
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChat();
                      }
                    }}
                    placeholder="Posez une question sur le cours..."
                    className="w-full bg-transparent border-none focus:ring-0 resize-none py-2.5 px-3 font-body-md text-xs text-on-surface placeholder:text-outline"
                  />
                  <div className="p-1.5 shrink-0">
                    <button
                      type="submit"
                      disabled={!inputQuestion.trim()}
                      className="w-7 h-7 rounded-full bg-primary dark:bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
                <div className="flex justify-between items-center mt-1.5 px-1">
                  <span className="font-label-sm text-[10px] text-outline flex items-center gap-1">
                    <Zap className="w-3 h-3 text-secondary fill-current" />
                    Basé sur la transcription vidéo
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Bottom Navigation Bar (Matching Screenshot 1 & 3) */}
      <footer className="bg-surface-container-lowest dark:bg-surface-container-low border-t border-outline-variant/70 dark:border-outline-variant/40 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="h-[44px] px-5 rounded-lg border border-primary dark:border-primary-fixed text-primary dark:text-primary-fixed font-label-sm text-xs font-semibold hover:bg-surface-container transition-colors flex items-center gap-1.5 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Précédent</span>
        </button>

        {/* Lesson pagination dots */}
        <div className="hidden sm:flex items-center gap-2">
          {allLessons.map((l, i) => (
            <button
              key={l.id}
              onClick={() => setSelectedLessonId(l.id)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-primary dark:bg-primary-fixed scale-125'
                  : l.status === 'completed'
                  ? 'bg-secondary'
                  : 'bg-outline-variant'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="h-[44px] px-6 rounded-lg bg-primary dark:bg-primary-container text-on-primary font-label-sm text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>{currentIndex === allLessons.length - 1 ? 'Terminer la leçon' : 'Suivant'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
