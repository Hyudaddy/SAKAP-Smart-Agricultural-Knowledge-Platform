-- SAKAP Agricultural Assistance Platform - Supabase Schema
-- Authentication System - Users Table

-- Add location columns to existing users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS province VARCHAR(255),
ADD COLUMN IF NOT EXISTS municipality VARCHAR(255),
ADD COLUMN IF NOT EXISTS barangay VARCHAR(255);

-- Create indexes for better query performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_featured ON users(featured);
CREATE INDEX IF NOT EXISTS idx_users_specialization ON users(specialization);

-- Enable Row Level Security (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create sequences for custom ID generation (if they don't exist)
-- For ATI Admin users
CREATE SEQUENCE IF NOT EXISTS admin_id_seq START 1;
-- For AEW users
CREATE SEQUENCE IF NOT EXISTS aew_id_seq START 1;
-- For Public users
CREATE SEQUENCE IF NOT EXISTS public_id_seq START 1;

-- Function to generate next ID based on role (if it doesn't exist)
CREATE OR REPLACE FUNCTION generate_user_id(user_role VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  next_id INTEGER;
BEGIN
  CASE user_role
    WHEN 'admin' THEN
      SELECT nextval('admin_id_seq') INTO next_id;
      RETURN 'ATI-ADMIN-' || LPAD(next_id::TEXT, 3, '0');
    WHEN 'aew' THEN
      SELECT nextval('aew_id_seq') INTO next_id;
      RETURN 'AEW-' || LPAD(next_id::TEXT, 3, '0');
    ELSE
      SELECT nextval('public_id_seq') INTO next_id;
      RETURN 'PUB-' || LPAD(next_id::TEXT, 3, '0');
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- News & Activities Tables

-- Create News table
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  author_id VARCHAR(20) REFERENCES users(id),
  author_name VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  image_url TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for News table
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author_id);

-- Create Activities table
CREATE TABLE IF NOT EXISTS activities (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255) NOT NULL,
  organizer VARCHAR(255) NOT NULL,
  organizer_id VARCHAR(20) REFERENCES users(id),
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  tags TEXT[],
  webinar_link TEXT, -- Added for webinar activities
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for Activities table
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_organizer ON activities(organizer_id);

-- Create sequences for News and Activities ID generation
CREATE SEQUENCE IF NOT EXISTS news_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS activities_id_seq START 1;

-- Function to generate News ID
CREATE OR REPLACE FUNCTION generate_news_id()
RETURNS VARCHAR AS $$
DECLARE
  next_id INTEGER;
BEGIN
  SELECT nextval('news_id_seq') INTO next_id;
  RETURN 'NEWS-' || LPAD(next_id::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate Activities ID
CREATE OR REPLACE FUNCTION generate_activities_id()
RETURNS VARCHAR AS $$
DECLARE
  next_id INTEGER;
BEGIN
  SELECT nextval('activities_id_seq') INTO next_id;
  RETURN 'ACT-' || LPAD(next_id::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_updated_at') THEN
        CREATE TRIGGER update_news_updated_at 
        BEFORE UPDATE ON news 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_activities_updated_at') THEN
        CREATE TRIGGER update_activities_updated_at 
        BEFORE UPDATE ON activities 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- E-Library Content Table

-- Create Library Content table
CREATE TABLE IF NOT EXISTS library_content (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('pdf', 'video', 'audio', 'image', 'document')),
  category VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER,
  uploaded_by VARCHAR(20) REFERENCES users(id),
  tags TEXT[],
  is_published BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for Library Content table
CREATE INDEX IF NOT EXISTS idx_library_content_type ON library_content(content_type);
CREATE INDEX IF NOT EXISTS idx_library_category ON library_content(category);
CREATE INDEX IF NOT EXISTS idx_library_published ON library_content(is_published);
CREATE INDEX IF NOT EXISTS idx_library_uploaded_by ON library_content(uploaded_by);

-- Create sequence for Library Content ID generation
CREATE SEQUENCE IF NOT EXISTS library_content_id_seq START 1;

-- Function to generate Library Content ID
CREATE OR REPLACE FUNCTION generate_library_content_id()
RETURNS VARCHAR AS $$
DECLARE
  next_id INTEGER;
BEGIN
  SELECT nextval('library_content_id_seq') INTO next_id;
  RETURN 'LIB-' || LPAD(next_id::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating timestamps
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_library_content_updated_at') THEN
        CREATE TRIGGER update_library_content_updated_at 
        BEFORE UPDATE ON library_content 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create Library Content Likes table
CREATE TABLE IF NOT EXISTS library_content_likes (
  id VARCHAR(20) PRIMARY KEY,
  content_id VARCHAR(20) REFERENCES library_content(id) ON DELETE CASCADE,
  user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, user_id)
);

-- Create indexes for Library Content Likes table
CREATE INDEX IF NOT EXISTS idx_library_content_likes_content ON library_content_likes(content_id);
CREATE INDEX IF NOT EXISTS idx_library_content_likes_user ON library_content_likes(user_id);

-- Create sequence for Library Content Likes ID generation
CREATE SEQUENCE IF NOT EXISTS library_content_likes_id_seq START 1;

-- Function to generate Library Content Likes ID
CREATE OR REPLACE FUNCTION generate_library_content_like_id()
RETURNS VARCHAR AS $$
DECLARE
  next_id INTEGER;
BEGIN
  SELECT nextval('library_content_likes_id_seq') INTO next_id;
  RETURN 'LCL-' || LPAD(next_id::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating timestamps on likes
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_library_content_likes_updated_at') THEN
        CREATE TRIGGER update_library_content_likes_updated_at 
        BEFORE UPDATE ON library_content_likes 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Chatbot System Tables

-- Create Chat Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  mode VARCHAR(10) NOT NULL CHECK (mode IN ('online', 'offline')),
  references_content TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for Chat Messages table
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_mode ON chat_messages(mode);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

-- Create Chat Sessions table (for tracking conversation sessions)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) REFERENCES users(id),
  title VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0
);

-- Create indexes for Chat Sessions table
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_active ON chat_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_started ON chat_sessions(started_at);

-- Create sequences for Chat IDs
CREATE SEQUENCE IF NOT EXISTS chat_messages_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS chat_sessions_id_seq START 1;

-- Functions to generate Chat IDs
CREATE OR REPLACE FUNCTION generate_chat_message_id()
RETURNS VARCHAR AS $$
DECLARE
  next_id INTEGER;
BEGIN
  SELECT nextval('chat_messages_id_seq') INTO next_id;
  RETURN 'CHAT-' || LPAD(next_id::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_chat_session_id()
RETURNS VARCHAR AS $$
DECLARE
  next_id INTEGER;
BEGIN
  SELECT nextval('chat_sessions_id_seq') INTO next_id;
  RETURN 'CHSESS-' || LPAD(next_id::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update chat session ended_at
CREATE OR REPLACE FUNCTION update_chat_session_ended_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.ended_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating chat session ended_at
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_chat_sessions_ended_at') THEN
        CREATE TRIGGER update_chat_sessions_ended_at 
        BEFORE UPDATE ON chat_sessions 
        FOR EACH ROW 
        WHEN (NEW.is_active = false AND OLD.is_active = true)
        EXECUTE FUNCTION update_chat_session_ended_at();
    END IF;
END $$;

-- Admin Features Tables

-- Create Audit Log table (for tracking admin actions)
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id VARCHAR(20),
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for Audit Logs table
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Create Admin Settings table (for application configuration)
CREATE TABLE IF NOT EXISTS admin_settings (
  id VARCHAR(20) PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for Admin Settings table
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_admin_settings_public ON admin_settings(is_public);

-- Create sequences for Admin IDs
CREATE SEQUENCE IF NOT EXISTS audit_logs_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS admin_settings_id_seq START 1;

-- Functions to generate Admin IDs
CREATE OR REPLACE FUNCTION generate_audit_log_id()
RETURNS VARCHAR AS $$
DECLARE
  next_id INTEGER;
BEGIN
  SELECT nextval('audit_logs_id_seq') INTO next_id;
  RETURN 'AUDIT-' || LPAD(next_id::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_admin_setting_id()
RETURNS VARCHAR AS $$
DECLARE
  next_id INTEGER;
BEGIN
  SELECT nextval('admin_settings_id_seq') INTO next_id;
  RETURN 'SET-' || LPAD(next_id::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating admin settings timestamps
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_admin_settings_updated_at') THEN
        CREATE TRIGGER update_admin_settings_updated_at 
        BEFORE UPDATE ON admin_settings 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;