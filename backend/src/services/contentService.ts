import { supabase } from '../config/supabase';

// Define the News interface
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

// Define the Activity interface
export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  organizer_id: string;
  capacity?: number;
  registered_count: number;
  image_url?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags?: string[];
  created_at: string;
  updated_at: string;
  webinar_link?: string; // Added for webinar activities
}

// Helper function to check if Supabase is configured
const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};

export class ContentService {
  // News methods
  // Get all news
  static async getAllNews(): Promise<News[]> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    const { data, error } = await supabase!
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching news: ${error.message}`);
    }

    return data as News[];
  }

  // Get news by ID
  static async getNewsById(id: string): Promise<News | null> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning null');
      return null;
    }
    
    const { data, error } = await supabase!
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching news: ${error.message}`);
    }

    return data as News;
  }

  // Create new news
  static async createNews(newsData: Partial<News>): Promise<News> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot create news');
    }
    
    // Generate news ID
    const newsId = await this.generateNewsId();
    
    const newsWithId = {
      ...newsData,
      id: newsId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase!
      .from('news')
      .insert(newsWithId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating news: ${error.message}`);
    }

    return data as News;
  }

  // Update news
  static async updateNews(id: string, newsData: Partial<News>): Promise<News> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot update news');
    }
    
    const { data, error } = await supabase!
      .from('news')
      .update({
        ...newsData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating news: ${error.message}`);
    }

    return data as News;
  }

  // Delete news
  static async deleteNews(id: string): Promise<boolean> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot delete news');
    }
    
    const { error } = await supabase!
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting news: ${error.message}`);
    }

    return true;
  }

  // Generate news ID
  static async generateNewsId(): Promise<string> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot generate news ID');
    }
    
    const { data, error } = await supabase!.rpc('generate_news_id');
    
    if (error) {
      throw new Error(`Error generating news ID: ${error.message}`);
    }
    
    return data as string;
  }

  // Get published news
  static async getPublishedNews(): Promise<News[]> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    const { data, error } = await supabase!
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching published news: ${error.message}`);
    }

    return data as News[];
  }

  // Activities methods
  // Get all activities
  static async getAllActivities(): Promise<Activity[]> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    const { data, error } = await supabase!
      .from('activities')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Error fetching activities: ${error.message}`);
    }

    return data as Activity[];
  }

  // Get activity by ID
  static async getActivityById(id: string): Promise<Activity | null> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning null');
      return null;
    }
    
    const { data, error } = await supabase!
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching activity: ${error.message}`);
    }

    return data as Activity;
  }

  // Create new activity
  static async createActivity(activityData: Partial<Activity>): Promise<Activity> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot create activity');
    }
    
    // Generate activity ID
    const activityId = await this.generateActivityId();
    
    const activityWithId = {
      ...activityData,
      id: activityId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase!
      .from('activities')
      .insert(activityWithId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating activity: ${error.message}`);
    }

    return data as Activity;
  }

  // Update activity
  static async updateActivity(id: string, activityData: Partial<Activity>): Promise<Activity> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot update activity');
    }
    
    const { data, error } = await supabase!
      .from('activities')
      .update({
        ...activityData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating activity: ${error.message}`);
    }

    return data as Activity;
  }

  // Delete activity
  static async deleteActivity(id: string): Promise<boolean> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot delete activity');
    }
    
    const { error } = await supabase!
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting activity: ${error.message}`);
    }

    return true;
  }

  // Generate activity ID
  static async generateActivityId(): Promise<string> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot generate activity ID');
    }
    
    const { data, error } = await supabase!.rpc('generate_activities_id');
    
    if (error) {
      throw new Error(`Error generating activity ID: ${error.message}`);
    }
    
    return data as string;
  }

  // Get upcoming activities
  static async getUpcomingActivities(): Promise<Activity[]> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    const { data, error } = await supabase!
      .from('activities')
      .select('*')
      .eq('status', 'upcoming')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Error fetching upcoming activities: ${error.message}`);
    }

    return data as Activity[];
  }
}