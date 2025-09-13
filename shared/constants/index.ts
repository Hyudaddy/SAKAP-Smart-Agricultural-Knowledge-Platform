// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
  },
  CONTENT: {
    NEWS: '/api/content/news',
    ACTIVITIES: '/api/content/activities',
    LIBRARY: '/api/content/library',
  },
  CHATBOT: {
    MESSAGE: '/api/chatbot/message',
    HISTORY: (userId: string) => `/api/chatbot/history/${userId}`,
  },
} as const;

// User Role Constants
export const USER_ROLES = {
  ADMIN: 'admin',
  AEW: 'aew',
  PUBLIC: 'public',
} as const;

// Content Categories
export const CONTENT_CATEGORIES = {
  NEWS: {
    TECHNOLOGY: 'technology',
    TIPS: 'tips',
    POLICY: 'policy',
    WEATHER: 'weather',
    MARKET: 'market',
  },
  LIBRARY: {
    FARMING: 'farming',
    DISEASE_MANAGEMENT: 'disease-management',
    PEST_CONTROL: 'pest-control',
    SOIL_HEALTH: 'soil-health',
    CROP_MANAGEMENT: 'crop-management',
    IRRIGATION: 'irrigation',
    HARVESTING: 'harvesting',
    POST_HARVEST: 'post-harvest',
  },
  ACTIVITIES: {
    WORKSHOP: 'workshop',
    TRAINING: 'training',
    SEMINAR: 'seminar',
    FIELD_VISIT: 'field-visit',
    DEMONSTRATION: 'demonstration',
  },
} as const;

// Activity Status
export const ACTIVITY_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// File Types
export const FILE_TYPES = {
  PDF: 'pdf',
  VIDEO: 'video',
  AUDIO: 'audio',
  IMAGE: 'image',
  DOCUMENT: 'document',
} as const;

// Location Constants - Caraga Region
export const CARAGA_REGION_DATA = {
  'Agusan del Norte': [
    'Buenavista', 'Butuan City', 'Cabadbaran City', 'Carmen', 'Jabonga',
    'Kitcharao', 'Las Nieves', 'Magallanes', 'Nasipit', 'Remedios T. Romualdez',
    'Santiago', 'Tubay'
  ],
  'Agusan del Sur': [
    'Bayugan City', 'Bunawan', 'Esperanza', 'La Paz', 'Loreto',
    'Prosperidad', 'Rosario', 'San Francisco', 'San Luis', 'Santa Josefa',
    'Sibagat', 'Talacogon', 'Trento', 'Veruela'
  ],
  'Dinagat Islands': [
    'Basilisa', 'Cagdianao', 'Dinagat', 'Libjo', 'Loreto',
    'San Jose', 'Tubajon'
  ],
  'Surigao del Norte': [
    'Alegria', 'Bacuag', 'Burgos', 'Claver', 'Dapa', 'Del Carmen',
    'General Luna', 'Gigaquit', 'Mainit', 'Malimono', 'Pilar',
    'Placer', 'San Benito', 'San Isidro', 'Santa Monica', 'Sison',
    'Socorro', 'Surigao City', 'Tagana-an', 'Tubod'
  ],
  'Surigao del Sur': [
    'Barobo', 'Bayabas', 'Bislig City', 'Cagwait', 'Cantilan',
    'Carmen', 'Carrascal', 'Cortes', 'Hinatuan', 'Lanuza',
    'Lianga', 'Lingig', 'Madrid', 'Marihatag', 'San Agustin',
    'San Miguel', 'Tagbina', 'Tago', 'Tandag City'
  ]
} as const;

// Legacy support - keeping Agusan del Sur municipalities for backward compatibility
export const AGUSAN_DEL_SUR_MUNICIPALITIES = CARAGA_REGION_DATA['Agusan del Sur'];

export const LOCATION_CONSTANTS = {
  REGION: 'Caraga Region',
  PROVINCES: Object.keys(CARAGA_REGION_DATA),
  CARAGA_DATA: CARAGA_REGION_DATA,
  // Legacy support
  PROVINCE: 'Agusan del Sur',
  MUNICIPALITIES: AGUSAN_DEL_SUR_MUNICIPALITIES,
} as const;

// Chatbot Modes
export const CHATBOT_MODES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;

// Default Configuration
export const DEFAULT_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },
  CHAT: {
    MAX_MESSAGE_LENGTH: 1000,
    HISTORY_LIMIT: 50,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_EXPIRED: 'Token has expired',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    INVALID_PHONE: 'Please enter a valid phone number',
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Bad request',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful',
  },
  USER: {
    PROFILE_UPDATED: 'Profile updated successfully',
    USER_CREATED: 'User created successfully',
    USER_DELETED: 'User deleted successfully',
  },
  CONTENT: {
    NEWS_CREATED: 'News article created successfully',
    ACTIVITY_CREATED: 'Activity created successfully',
    LIBRARY_UPLOADED: 'File uploaded successfully',
  },
  CHAT: {
    MESSAGE_SENT: 'Message sent successfully',
    HISTORY_CLEARED: 'Chat history cleared successfully',
  },
} as const;