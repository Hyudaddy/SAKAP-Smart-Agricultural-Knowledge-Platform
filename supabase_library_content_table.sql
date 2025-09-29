-- SAKAP Agricultural Assistance Platform - E-Library Content Table
-- This file contains only the E-Library Content table

-- Create Library Content table
CREATE TABLE library_content (
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
CREATE INDEX idx_library_content_type ON library_content(content_type);
CREATE INDEX idx_library_category ON library_content(category);
CREATE INDEX idx_library_published ON library_content(is_published);
CREATE INDEX idx_library_uploaded_by ON library_content(uploaded_by);

-- Create sequence for Library Content ID generation
CREATE SEQUENCE library_content_id_seq START 1;

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

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating timestamps
CREATE TRIGGER update_library_content_updated_at 
BEFORE UPDATE ON library_content 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();