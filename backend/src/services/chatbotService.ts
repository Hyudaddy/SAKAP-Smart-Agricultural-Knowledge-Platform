import { supabase } from '../config/supabase';

// Define the ChatMessage interface
export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  mode: 'online' | 'offline';
  references_content?: string[];
  created_at: string;
}

// Define the ChatSession interface
export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  is_active: boolean;
  started_at: string;
  ended_at?: string;
  message_count: number;
}

// Helper function to check if Supabase is configured
const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};

export class ChatbotService {
  // Chat Message methods
  // Get all messages for a user
  static async getUserMessages(userId: string): Promise<ChatMessage[]> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    const { data, error } = await supabase!
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Error fetching chat messages: ${error.message}`);
    }

    return data as ChatMessage[];
  }

  // Create new chat message
  static async createChatMessage(messageData: Partial<ChatMessage>): Promise<ChatMessage> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot create chat message');
    }
    
    // Generate message ID
    const messageId = await this.generateChatMessageId();
    
    const messageWithId = {
      ...messageData,
      id: messageId,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase!
      .from('chat_messages')
      .insert(messageWithId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating chat message: ${error.message}`);
    }

    return data as ChatMessage;
  }

  // Generate chat message ID
  static async generateChatMessageId(): Promise<string> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot generate chat message ID');
    }
    
    const { data, error } = await supabase!.rpc('generate_chat_message_id');
    
    if (error) {
      throw new Error(`Error generating chat message ID: ${error.message}`);
    }
    
    return data as string;
  }

  // Chat Session methods
  // Get active session for a user
  static async getActiveSession(userId: string): Promise<ChatSession | null> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning null');
      return null;
    }
    
    const { data, error } = await supabase!
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) {
      // If no active session found, this is not an error
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error fetching active chat session: ${error.message}`);
    }

    return data as ChatSession;
  }

  // Create new chat session
  static async createChatSession(sessionData: Partial<ChatSession>): Promise<ChatSession> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot create chat session');
    }
    
    // Generate session ID
    const sessionId = await this.generateChatSessionId();
    
    const sessionWithId = {
      ...sessionData,
      id: sessionId,
      started_at: new Date().toISOString()
    };

    const { data, error } = await supabase!
      .from('chat_sessions')
      .insert(sessionWithId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating chat session: ${error.message}`);
    }

    return data as ChatSession;
  }

  // End chat session
  static async endChatSession(sessionId: string): Promise<ChatSession> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot end chat session');
    }
    
    const { data, error } = await supabase!
      .from('chat_sessions')
      .update({
        is_active: false,
        ended_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error ending chat session: ${error.message}`);
    }

    return data as ChatSession;
  }

  // Generate chat session ID
  static async generateChatSessionId(): Promise<string> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot generate chat session ID');
    }
    
    const { data, error } = await supabase!.rpc('generate_chat_session_id');
    
    if (error) {
      throw new Error(`Error generating chat session ID: ${error.message}`);
    }
    
    return data as string;
  }

  // Get session messages
  static async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    // This would require a join or a separate query to get messages for a session
    // For now, we'll get messages by user and filter by time
    // In a more complex implementation, we might add a session_id field to chat_messages
    throw new Error('Not implemented: Session messages require a more complex schema');
  }
}