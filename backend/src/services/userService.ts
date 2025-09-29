import { supabase, supabaseAdmin } from '../config/supabase';
import { User } from '../types';

// Helper function to check if Supabase is configured
const isSupabaseAvailable = (): boolean => {
  return supabaseAdmin !== null;
};

export class UserService {
  // Get all users
  static async getAllUsers(): Promise<User[]> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    const { data, error } = await supabaseAdmin!
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }

    // Map snake_case properties back to camelCase for response
    return data.map((item: any) => {
      const user: any = {};
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          // Special case for password_hash
          if (key === 'password_hash') {
            user['password_hash'] = item[key];
          } else {
            const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            user[camelCaseKey] = item[key];
          }
        }
      }
      return user as User;
    });
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning null');
      return null;
    }
    
    const { data, error } = await supabaseAdmin!
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // If user not found, return null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error fetching user: ${error.message}`);
    }

    // Map snake_case properties back to camelCase for response
    const user: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Special case for password_hash
        if (key === 'password_hash') {
          user['password_hash'] = data[key];
        } else {
          const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          user[camelCaseKey] = (data as any)[key];
        }
      }
    }

    return user as User;
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning null');
      return null;
    }
    
    const { data, error } = await supabaseAdmin!
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      // If user not found, return null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error fetching user: ${error.message}`);
    }

    // Map snake_case properties back to camelCase for response
    const user: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Special case for password_hash
        if (key === 'password_hash') {
          user['password_hash'] = data[key];
        } else {
          const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          user[camelCaseKey] = (data as any)[key];
        }
      }
    }

    return user as User;
  }

  // Create a new user
  static async createUser(userData: Partial<User>): Promise<User> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot create user');
    }
    
    // Map camelCase properties to snake_case for database
    const dbUserData: any = {};
    
    // Map all properties from userData to dbUserData with snake_case keys
    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        // Special case for password_hash
        if (key === 'password_hash') {
          dbUserData['password_hash'] = (userData as any)[key];
        } else {
          const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          dbUserData[snakeCaseKey] = (userData as any)[key];
        }
      }
    }
    
    console.log('Inserting user data:', dbUserData);
    
    const { data, error } = await supabaseAdmin!
      .from('users')
      .insert(dbUserData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw new Error(`Error creating user: ${error.message}`);
    }
    
    console.log('User created successfully:', data);

    // Map snake_case properties back to camelCase for response
    const user: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Special case for password_hash
        if (key === 'password_hash') {
          user['password_hash'] = data[key];
        } else {
          const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          user[camelCaseKey] = (data as any)[key];
        }
      }
    }

    return user as User;
  }

  // Update user
  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot update user');
    }
    
    // Map camelCase properties to snake_case for database
    const dbUserData: any = {};
    
    // Map all properties from userData to dbUserData with snake_case keys
    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        // Special case for password_hash
        if (key === 'password_hash') {
          dbUserData['password_hash'] = (userData as any)[key];
        } else {
          const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          dbUserData[snakeCaseKey] = (userData as any)[key];
        }
      }
    }
    
    // Ensure updated_at is set
    dbUserData.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin!
      .from('users')
      .update(dbUserData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }

    // Map snake_case properties back to camelCase for response
    const user: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Special case for password_hash
        if (key === 'password_hash') {
          user['password_hash'] = data[key];
        } else {
          const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          user[camelCaseKey] = (data as any)[key];
        }
      }
    }

    return user as User;
  }

  // Delete user
  static async deleteUser(id: string): Promise<boolean> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot delete user');
    }
    
    const { error } = await supabaseAdmin!
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }

    return true;
  }

  // Generate user ID based on role
  static async generateUserId(role: string): Promise<string> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot generate user ID');
    }
    
    const { data, error } = await supabaseAdmin!.rpc('generate_user_id', { user_role: role });
    
    if (error) {
      throw new Error(`Error generating user ID: ${error.message}`);
    }
    
    return data as string;
  }

  // Get featured experts
  static async getFeaturedExperts(): Promise<User[]> {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    const { data, error } = await supabaseAdmin!
      .from('users')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching featured experts: ${error.message}`);
    }

    // Map snake_case properties back to camelCase for response
    return data.map((item: any) => {
      const user: any = {};
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          // Special case for password_hash
          if (key === 'password_hash') {
            user['password_hash'] = item[key];
          } else {
            const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            user[camelCaseKey] = item[key];
          }
        }
      }
      return user as User;
    });
  }

  // Update featured status
  static async updateFeaturedStatus(id: string, featured: boolean, achievement?: string, quote?: string): Promise<User> {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not configured, cannot update featured status');
    }
    
    const { data, error } = await supabaseAdmin!
      .from('users')
      .update({
        featured,
        achievement,
        quote,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating featured status: ${error.message}`);
    }

    // Map snake_case properties back to camelCase for response
    const user: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Special case for password_hash
        if (key === 'password_hash') {
          user['password_hash'] = data[key];
        } else {
          const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          user[camelCaseKey] = (data as any)[key];
        }
      }
    }

    return user as User;
  }
}