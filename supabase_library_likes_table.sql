-- SAKAP Agricultural Assistance Platform - E-Library Content Likes Table
-- This file contains the table for tracking user likes on library content

-- Create Library Content Likes table
CREATE TABLE library_content_likes (
  id VARCHAR(20) PRIMARY KEY,
  content_id VARCHAR(20) REFERENCES library_content(id) ON DELETE CASCADE,
  user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, user_id)
);

-- Create indexes for Library Content Likes table
CREATE INDEX idx_library_content_likes_content ON library_content_likes(content_id);
CREATE INDEX idx_library_content_likes_user ON library_content_likes(user_id);

-- Create sequence for Library Content Likes ID generation
CREATE SEQUENCE library_content_likes_id_seq START 1;

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

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating timestamps
CREATE TRIGGER update_library_content_likes_updated_at 
BEFORE UPDATE ON library_content_likes 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();