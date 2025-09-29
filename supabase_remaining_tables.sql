-- SAKAP Agricultural Assistance Platform - Remaining Supabase Tables
-- This file contains only the tables that haven't been created yet

-- Chatbot System Tables

-- Create Chat Messages table
CREATE TABLE chat_messages (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  mode VARCHAR(10) NOT NULL CHECK (mode IN ('online', 'offline')),
  references_content TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for Chat Messages table
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_mode ON chat_messages(mode);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

-- Create Chat Sessions table (for tracking conversation sessions)
CREATE TABLE chat_sessions (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) REFERENCES users(id),
  title VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0
);

-- Create indexes for Chat Sessions table
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_active ON chat_sessions(is_active);
CREATE INDEX idx_chat_sessions_started ON chat_sessions(started_at);

-- Create sequences for Chat IDs
CREATE SEQUENCE chat_messages_id_seq START 1;
CREATE SEQUENCE chat_sessions_id_seq START 1;

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

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update chat session ended_at
CREATE OR REPLACE FUNCTION update_chat_session_ended_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.ended_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating chat session ended_at
CREATE TRIGGER update_chat_sessions_ended_at 
BEFORE UPDATE ON chat_sessions 
FOR EACH ROW 
WHEN (NEW.is_active = false AND OLD.is_active = true)
EXECUTE FUNCTION update_chat_session_ended_at();

-- Admin Features Tables

-- Create Audit Log table (for tracking admin actions)
CREATE TABLE audit_logs (
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
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Create Admin Settings table (for application configuration)
CREATE TABLE admin_settings (
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
CREATE INDEX idx_admin_settings_key ON admin_settings(setting_key);
CREATE INDEX idx_admin_settings_public ON admin_settings(is_public);

-- Create sequences for Admin IDs
CREATE SEQUENCE audit_logs_id_seq START 1;
CREATE SEQUENCE admin_settings_id_seq START 1;

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
CREATE TRIGGER update_admin_settings_updated_at 
BEFORE UPDATE ON admin_settings 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();