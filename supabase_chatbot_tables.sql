-- SAKAP Agricultural Assistance Platform - Chatbot System Tables
-- This file contains only the Chatbot System tables that haven't been created yet

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

-- Create sequences for Chat IDs (only if they don't exist)
CREATE SEQUENCE IF NOT EXISTS chat_sessions_id_seq START 1;

-- Functions to generate Chat IDs (only if they don't exist)
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