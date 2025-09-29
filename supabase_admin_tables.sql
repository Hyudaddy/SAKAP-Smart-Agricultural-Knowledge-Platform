-- SAKAP Agricultural Assistance Platform - Admin Features Tables
-- This file contains only the Admin Features tables

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

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating admin settings timestamps
CREATE TRIGGER update_admin_settings_updated_at 
BEFORE UPDATE ON admin_settings 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();