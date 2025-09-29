import { supabase } from '../config/supabase';

// Define the LibraryContent interface
export interface LibraryContent {
  id: string;
  title: string;
  description: string;
  content_type: 'pdf' | 'video' | 'audio' | 'image' | 'document';
  category: string;
  file_url: string;
  thumbnail_url?: string;
  file_size?: number;
  uploaded_by: string;
  tags?: string[];
  is_published: boolean;
  download_count: number;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

// Define the LibraryContentLike interface
export interface LibraryContentLike {
  id: string;
  content_id: string;
  user_id: string;
  created_at: string;
}

// Helper function to check if Supabase is configured
const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};

export class LibraryService {
  // Get all library content
  static async getAllContent(): Promise<LibraryContent[]> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    const { data, error } = await supabase!
      .from('library_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching library content: ${error.message}`);
    }

    return data as LibraryContent[];
  }

  // Get library content by ID
  static async getContentById(id: string): Promise<LibraryContent | null> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning null');
      return null;
    }
    
    const { data, error } = await supabase!
      .from('library_content')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching library content: ${error.message}`);
    }

    return data as LibraryContent;
  }

  // Create new library content
  static async createContent(contentData: Partial<LibraryContent>): Promise<LibraryContent> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot create library content');
    }
    
    // Generate content ID
    const contentId = await this.generateContentId();
    
    const contentWithId = {
      ...contentData,
      id: contentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase!
      .from('library_content')
      .insert(contentWithId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating library content: ${error.message}`);
    }

    return data as LibraryContent;
  }

  // Update library content
  static async updateContent(id: string, contentData: Partial<LibraryContent>): Promise<LibraryContent> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot update library content');
    }
    
    const { data, error } = await supabase!
      .from('library_content')
      .update({
        ...contentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating library content: ${error.message}`);
    }

    return data as LibraryContent;
  }

  // Delete library content
  static async deleteContent(id: string): Promise<boolean> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot delete library content');
    }
    
    const { error } = await supabase!
      .from('library_content')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting library content: ${error.message}`);
    }

    return true;
  }

  // Generate library content ID
  static async generateContentId(): Promise<string> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot generate library content ID');
    }
    
    const { data, error } = await supabase!.rpc('generate_library_content_id');
    
    if (error) {
      throw new Error(`Error generating library content ID: ${error.message}`);
    }
    
    return data as string;
  }

  // Get content by category
  static async getContentByCategory(category: string): Promise<LibraryContent[]> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    const { data, error } = await supabase!
      .from('library_content')
      .select('*')
      .eq('category', category)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching library content by category: ${error.message}`);
    }

    return data as LibraryContent[];
  }

  // Get content by type
  static async getContentByType(type: string): Promise<LibraryContent[]> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    const { data, error } = await supabase!
      .from('library_content')
      .select('*')
      .eq('content_type', type)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching library content by type: ${error.message}`);
    }

    return data as LibraryContent[];
  }

  // Increment view count
  static async incrementViewCount(id: string): Promise<LibraryContent> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot increment view count');
    }
    
    // First get the current content to know the current view count
    const { data: currentContent, error: fetchError } = await supabase!
      .from('library_content')
      .select('view_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching library content: ${fetchError.message}`);
    }

    // Increment the view count
    const newViewCount = (currentContent?.view_count || 0) + 1;

    // Update with the new view count
    const { data, error } = await supabase!
      .from('library_content')
      .update({
        view_count: newViewCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error incrementing view count: ${error.message}`);
    }

    return data as LibraryContent;
  }

  // Increment download count
  static async incrementDownloadCount(id: string): Promise<LibraryContent> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot increment download count');
    }
    
    // First get the current content to know the current download count
    const { data: currentContent, error: fetchError } = await supabase!
      .from('library_content')
      .select('download_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching library content: ${fetchError.message}`);
    }

    // Increment the download count
    const newDownloadCount = (currentContent?.download_count || 0) + 1;

    // Update with the new download count
    const { data, error } = await supabase!
      .from('library_content')
      .update({
        download_count: newDownloadCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error incrementing download count: ${error.message}`);
    }

    return data as LibraryContent;
  }

  // Check if user has liked content
  static async hasUserLikedContent(contentId: string, userId: string): Promise<boolean> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning false');
      return false;
    }
    
    const { data, error } = await supabase!
      .from('library_content_likes')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error checking if user liked content: ${error.message}`);
    }

    return !!data;
  }

  // Add like to content
  static async addLikeToContent(contentId: string, userId: string): Promise<{ success: boolean; like?: LibraryContentLike; content?: LibraryContent }> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot add like to content');
    }
    
    // First check if user already liked this content
    const hasLiked = await this.hasUserLikedContent(contentId, userId);
    if (hasLiked) {
      return { success: false };
    }

    // Generate like ID
    const { data: likeData, error: likeError } = await supabase!.rpc('generate_library_content_like_id');
    if (likeError) {
      throw new Error(`Error generating like ID: ${likeError.message}`);
    }

    const likeId = likeData as string;

    // Insert the like
    const { data: insertedLike, error: insertError } = await supabase!
      .from('library_content_likes')
      .insert({
        id: likeId,
        content_id: contentId,
        user_id: userId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Error adding like: ${insertError.message}`);
    }

    // Get current like count and increment it
    const { data: currentContent, error: fetchError } = await supabase!
      .from('library_content')
      .select('like_count')
      .eq('id', contentId)
      .single();

    if (fetchError) {
      // If we failed to get the current content, we should remove the like we just added
      await supabase!
        .from('library_content_likes')
        .delete()
        .eq('id', likeId);
      throw new Error(`Error fetching library content: ${fetchError.message}`);
    }

    // Increment the like count
    const newLikeCount = (currentContent?.like_count || 0) + 1;

    // Update the like count on the content
    const { data: updatedContent, error: updateError } = await supabase!
      .from('library_content')
      .update({
        like_count: newLikeCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', contentId)
      .select()
      .single();

    if (updateError) {
      // If we failed to update the content, we should remove the like we just added
      await supabase!
        .from('library_content_likes')
        .delete()
        .eq('id', likeId);
      
      throw new Error(`Error incrementing like count: ${updateError.message}`);
    }

    return { 
      success: true, 
      like: insertedLike as LibraryContentLike, 
      content: updatedContent as LibraryContent 
    };
  }

  // Remove like from content
  static async removeLikeFromContent(contentId: string, userId: string): Promise<{ success: boolean; content?: LibraryContent }> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot remove like from content');
    }
    
    // First check if user has liked this content
    const { data: likeData, error: likeError } = await supabase!
      .from('library_content_likes')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (likeError) {
      throw new Error(`Error checking like: ${likeError.message}`);
    }

    if (!likeData) {
      return { success: false };
    }

    // Delete the like
    const { error: deleteError } = await supabase!
      .from('library_content_likes')
      .delete()
      .eq('id', likeData.id);

    if (deleteError) {
      throw new Error(`Error removing like: ${deleteError.message}`);
    }

    // Get current like count and decrement it
    const { data: currentContent, error: fetchError } = await supabase!
      .from('library_content')
      .select('like_count')
      .eq('id', contentId)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching library content: ${fetchError.message}`);
    }

    // Decrement the like count (but don't let it go below 0)
    const newLikeCount = Math.max(0, (currentContent?.like_count || 0) - 1);

    // Update the like count on the content
    const { data: updatedContent, error: updateError } = await supabase!
      .from('library_content')
      .update({
        like_count: newLikeCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', contentId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Error decrementing like count: ${updateError.message}`);
    }

    return { 
      success: true, 
      content: updatedContent as LibraryContent 
    };
  }

  // Get like count for content
  static async getLikeCount(contentId: string): Promise<number> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning 0');
      return 0;
    }
    
    const { data, error } = await supabase!
      .from('library_content')
      .select('like_count')
      .eq('id', contentId)
      .single();

    if (error) {
      throw new Error(`Error fetching like count: ${error.message}`);
    }

    return data.like_count;
  }

  // Increment like count (alternative method using direct update)
  static async incrementLikeCount(id: string): Promise<LibraryContent> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot increment like count');
    }
    
    // Get current like count and increment it
    const { data: currentContent, error: fetchError } = await supabase!
      .from('library_content')
      .select('like_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching library content: ${fetchError.message}`);
    }

    // Increment the like count
    const newLikeCount = (currentContent?.like_count || 0) + 1;

    // Update with the new like count
    const { data, error } = await supabase!
      .from('library_content')
      .update({
        like_count: newLikeCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error incrementing like count: ${error.message}`);
    }

    return data as LibraryContent;
  }

  // Decrement like count (alternative method using direct update)
  static async decrementLikeCount(id: string): Promise<LibraryContent> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot decrement like count');
    }
    
    // Get current like count and decrement it
    const { data: currentContent, error: fetchError } = await supabase!
      .from('library_content')
      .select('like_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching library content: ${fetchError.message}`);
    }

    // Decrement the like count (but don't let it go below 0)
    const newLikeCount = Math.max(0, (currentContent?.like_count || 0) - 1);

    // Update with the new like count
    const { data, error } = await supabase!
      .from('library_content')
      .update({
        like_count: newLikeCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error decrementing like count: ${error.message}`);
    }

    return data as LibraryContent;
  }
}