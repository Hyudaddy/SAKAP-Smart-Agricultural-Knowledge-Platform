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
  createdAt: string;
  updatedAt: string;
  // Expert farmer fields
  eventsAttended?: number;
  yearsExperience?: number;
  achievement?: string;
  quote?: string;
  featured?: boolean;
  featuredAt?: string;
  // User skill level tracking
  trainingsAttended?: number;
  skillLevel?: UserSkillLevel;
  // Password field for authentication
  password_hash?: string;
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