# Supabase Setup Guide

This guide explains how to set up Supabase for the SAKAP Agricultural Assistance Platform.

## Prerequisites

1. A Supabase account (free tier available at https://supabase.com/)
2. Node.js and npm installed

## Setting up Supabase

### 1. Create a Supabase Project

1. Go to https://supabase.com/ and sign up or log in
2. Click "New Project"
3. Enter a name for your project
4. Select a region
5. Set a database password (make sure to remember this)
6. Click "Create new project"

### 2. Get Your Supabase Credentials

After your project is created, you'll need to get three important pieces of information:

1. **Project URL**: Found in the project settings
2. **Anonymous Key**: Found in the project settings under API
3. **Service Role Key**: Found in the project settings under API

### 3. Update Environment Variables

Update the `.env` file in the `backend` directory with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=your_actual_supabase_project_url
SUPABASE_ANON_KEY=your_actual_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_supabase_service_role_key
```

### 4. Set up the Database Schema

Run the SQL script to set up the database tables:

1. In your Supabase dashboard, go to the SQL editor
2. Copy and paste the contents of `supabase_schema.sql` into the editor
3. Run the script

### 5. Test the Connection

Start the backend server and test the news functionality:

```bash
cd backend
npm run dev
```

Then try creating a news article through the admin interface.

## Troubleshooting

### Common Issues

1. **"Invalid supabaseUrl" Error**: Make sure your SUPABASE_URL in the .env file is a valid HTTPS URL
2. **Authentication Errors**: Verify that your SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are correct
3. **Database Connection Issues**: Ensure that the database schema has been set up correctly

### Checking Environment Variables

You can verify that your environment variables are set correctly by adding console.log statements in `backend/src/config/supabase.ts`:

```javascript
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)