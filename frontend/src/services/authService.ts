import { User } from '@shared/types';

// Get the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Define the authentication response interface
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

// Define the login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Define the registration data interface
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'aew' | 'public';
  province?: string;
  municipality?: string;
  barangay?: string;
}

class AuthService {
  // Store the token in localStorage
  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Remove the token from localStorage
  private removeToken(): void {
    localStorage.removeItem('authToken');
  }

  // Store user data in localStorage
  private setUserData(user: User): void {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  // Get user data from localStorage
  getUserData(): User | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Update user data in localStorage
  updateUserData(userData: User): void {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  // Remove user data from localStorage
  private removeUserData(): void {
    localStorage.removeItem('userData');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get authorization headers
  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  // Register a new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.data) {
        // Store token and user data
        this.setToken(data.data.token);
        this.setUserData(data.data.user);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.data) {
        // Store token and user data
        this.setToken(data.data.token);
        this.setUserData(data.data.user);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call the logout endpoint
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token and user data regardless of server response
      this.removeToken();
      this.removeUserData();
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      return data.data?.user || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Refresh user data
  async refreshUserData(): Promise<User | null> {
    try {
      const user = await this.getCurrentUser();
      if (user) {
        this.setUserData(user);
      }
      return user;
    } catch (error) {
      console.error('Refresh user data error:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
export const authService = new AuthService();