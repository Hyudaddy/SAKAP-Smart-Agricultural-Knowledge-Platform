// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  farmerId?: string;
  location?: UserLocation;
  phone?: string;
  specialization?: string;
  organization?: string;
  certification?: string;
  farmType?: string;
  profilePicture?: string;
  coverPhoto?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Expert farmer fields
  eventsAttended?: number;
  yearsExperience?: number;
  achievement?: string;
  quote?: string;
  featured?: boolean;
  featuredAt?: Date;
  // User skill level tracking
  trainingsAttended?: number;
  skillLevel?: UserSkillLevel;
}

// Location types
export interface UserLocation {
  province: string;
  municipality: string;
  barangay?: string;
  address?: string;
}

export type UserRole = 'admin' | 'aew' | 'public';

// User skill level based on Dreyfus model
export type UserSkillLevel = 'Novice' | 'Advanced Beginner' | 'Competent' | 'Proficient' | 'Expert';

export interface UserLevelInfo {
  level: UserSkillLevel;
  description: string;
  color: string;
  progress: number;
  nextLevelThreshold: number;
}

// Expert farmer specific type
export interface ExpertFarmer {
  id: string;
  name: string;
  location: string;
  specialization: string;
  achievement: string;
  profilePicture?: string;
  eventsAttended: number;
  yearsExperience: number;
  quote?: string;
  featured: boolean;
  featuredAt: Date;
}

// Authentication types
export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  farmerId?: string;
  location?: UserLocation;
  phone?: string;
  accessCode?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Content types
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author: string;
  publishedAt: Date;
  category: string;
  imageUrl?: string;
  tags?: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  capacity?: number;
  registered?: number;
  imageUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface LibraryContent {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'audio' | 'image' | 'document';
  category: string;
  downloadUrl?: string;
  viewUrl?: string;
  fileSize?: number;
  uploadedBy: string;
  uploadedAt: Date;
  tags?: string[];
}

// Chatbot types
export interface ChatMessage {
  id: string;
  userId?: string;
  message: string;
  response: string;
  mode: 'online' | 'offline';
  timestamp: Date;
  references?: string[];
}

export interface ChatbotRequest {
  message: string;
  userId?: string;
  mode: 'online' | 'offline';
}

export interface ChatbotResponse {
  response: string;
  mode: 'online' | 'offline';
  timestamp: Date;
  messageId: string;
  references?: string[];
}

// Dashboard types
export interface DashboardStats {
  totalUsers?: number;
  totalNews?: number;
  totalActivities?: number;
  totalLibraryItems?: number;
  recentActivity?: Activity[];
  popularContent?: LibraryContent[];
}