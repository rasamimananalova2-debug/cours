export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorPalette = 'classic' | 'teal' | 'cyberpunk' | 'amber';
export type FontSizeScale = 'normal' | 'large' | 'xlarge';
export type NetworkThrottle = 'fast' | '3g' | 'slow' | 'offline';

export interface ThemeSettings {
  mode: ThemeMode;
  palette: ColorPalette;
  fontSize: FontSizeScale;
  highContrast: boolean;
  reducedMotion: boolean;
  dataSaver: boolean;
  networkThrottle: NetworkThrottle;
}

export type ViewType = 
  | 'dashboard' 
  | 'courses' 
  | 'catalog' 
  | 'player' 
  | 'messages' 
  | 'assignments' 
  | 'settings';

export interface FastImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: 'low' | 'normal' | 'high';
  cacheControl?: 'immutable' | 'web' | 'cacheOnly';
  lazy?: boolean;
  aspectRatio?: string;
  showProgressIndicator?: boolean;
  fallbackSrc?: string;
  dataAlt?: string;
  onClick?: () => void;
}

export interface CacheEntry {
  url: string;
  blobUrl: string;
  sizeBytes: number;
  loadedAt: number;
  lastAccessed: number;
  priority: 'low' | 'normal' | 'high';
  loadTimeMs: number;
  status: 'cached' | 'loading' | 'failed';
}

export interface CacheStats {
  memoryItemsCount: number;
  totalCachedBytes: number;
  bandwidthSavedBytes: number;
  cacheHitCount: number;
  cacheMissCount: number;
  lazyLoadEventsCount: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  status: 'completed' | 'current' | 'locked';
  videoTimestamp?: string;
  summary: string;
  videoPoster: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseResource {
  id: string;
  title: string;
  type: 'pdf' | 'code' | 'article' | 'dataset';
  sizeOrTime: string;
  url: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Tech' | 'Design' | 'Business' | 'Langues';
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  price: string;
  rating: number;
  reviewsCount: string;
  progressPercent: number;
  currentModuleId: string;
  currentLessonId: string;
  totalHours: string;
  modules: CourseModule[];
  resources: CourseResource[];
  isPopular?: boolean;
  isNew?: boolean;
  isEnrolled?: boolean;
  badge?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'quiz' | 'doc' | 'badge';
  linkText?: string;
  linkUrl?: string;
  score?: string;
}

export interface DeadlineItem {
  id: string;
  title: string;
  deadlineLabel: string;
  timeRemaining: string;
  dateBadge: string;
  isUrgent?: boolean;
  courseTitle: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  timestamp: string;
  note?: string;
  suggestions?: string[];
  courseTimestampAction?: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  timeLabel: string; // 'Aujourd'hui' | 'Semaine dernière'
  category: 'UX' | 'Maths' | 'Python' | 'IA' | 'General';
  messages: ChatMessage[];
}

export interface AssignmentItem {
  id: string;
  title: string;
  courseTitle: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  maxGrade?: string;
  description: string;
}
