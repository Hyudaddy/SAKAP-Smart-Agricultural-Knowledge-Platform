import { Activity } from '@shared/types';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface CreateActivityData {
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  organizer_id: string;
  capacity?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registered_count: number;
  tags?: string[];
  webinar_link?: string; // Added for webinar activities
}

export class ActivityService {
  static async getAllActivities(): Promise<Activity[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/content/activities`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Transform the data to match the frontend Activity interface
      return data.data.activities.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        date: new Date(activity.date).toISOString(), // Ensure consistent date format
        location: activity.location,
        organizer: activity.organizer,
        organizerId: activity.organizer_id,
        capacity: activity.capacity,
        registered: activity.registered_count,
        imageUrl: activity.image_url,
        status: activity.status,
        tags: activity.tags,
        createdAt: activity.created_at,
        updatedAt: activity.updated_at,
        type: 'Activity', // Default type, can be overridden
        webinarLink: activity.webinar_link // Added for webinar activities
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }

  static async createActivity(activityData: CreateActivityData): Promise<Activity> {
    try {
      // Get the authentication token
      const token = authService.getToken();
      
      // Check if token exists
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      // Create headers with authentication
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_BASE_URL}/content/activities`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error as JSON, use the raw text
          if (errorText) {
            errorMessage = errorText;
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Transform the data to match the frontend Activity interface
      const activity = data.data.activity;
      return {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        date: new Date(activity.date).toISOString(), // Ensure consistent date format
        location: activity.location,
        organizer: activity.organizer,
        organizerId: activity.organizer_id,
        capacity: activity.capacity,
        registered: activity.registered_count,
        imageUrl: activity.image_url,
        status: activity.status,
        tags: activity.tags,
        createdAt: activity.created_at,
        updatedAt: activity.updated_at,
        type: 'Activity', // Default type
        webinarLink: activity.webinar_link // Added for webinar activities
      };
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }
}