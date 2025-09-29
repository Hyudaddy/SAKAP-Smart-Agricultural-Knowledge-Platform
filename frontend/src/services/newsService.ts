import type { NewsItem } from '@shared/types';
import { authService } from './authService';

// Define the News interface to match the backend
export interface News {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author_id: string;
  author_name: string;
  category: string;
  image_url?: string;
  tags?: string[];
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const newsService = {
  // Get all news (public endpoint - no auth required)
  async getAllNews(): Promise<News[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/content/news`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch news');
      }
      
      return data.data.news;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Get published news (public endpoint - no auth required)
  async getPublishedNews(): Promise<News[]> {
    try {
      // For now, we'll use the same endpoint since the backend filters by published status
      const response = await fetch(`${API_BASE_URL}/content/news`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch published news');
      }
      
      // Filter for published news on the client side as well
      return data.data.news.filter((news: News) => news.is_published);
    } catch (error) {
      console.error('Error fetching published news:', error);
      throw error;
    }
  },

  // Create news (requires authentication)
  async createNews(newsData: Partial<News>): Promise<News> {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
      
      const response = await fetch(`${API_BASE_URL}/content/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newsData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create news');
      }
      
      return data.data.news;
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  }
};