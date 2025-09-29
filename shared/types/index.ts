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
  province?: string;
  municipality?: string;
  barangay?: string;
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
  province?: string;
  municipality?: string;
  barangay?: string;
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
  date: string; // Changed from Date to string to match backend
  location: string;
  organizer: string;
  organizerId: string; // Changed to match frontend naming convention
  capacity?: number;
  registered: number; // Changed to match frontend naming convention
  registered_count?: number; // Keep for backward compatibility
  imageUrl?: string; // Changed to match frontend naming convention
  image_url?: string; // Keep for backward compatibility
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags?: string[];
  createdAt: string; // Changed to match frontend naming convention
  created_at?: string; // Keep for backward compatibility
  updatedAt: string; // Changed to match frontend naming convention
  updated_at?: string; // Keep for backward compatibility
  type?: string; // Added for frontend display
  webinarLink?: string; // Added for webinar activities
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
  viewCount?: number;
  downloadCount?: number;
  likeCount?: number;
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