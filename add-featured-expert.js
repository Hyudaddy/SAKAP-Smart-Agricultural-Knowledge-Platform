const { supabaseAdmin } = require('./backend/src/config/supabase');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function addFeaturedExpert() {
  if (!supabaseAdmin) {
    console.log('Supabase not configured');
    return;
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('password123', saltRounds);
  
  // Generate a unique ID
  const userId = 'EXP-' + uuidv4().substring(0, 8).toUpperCase();

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      id: userId,
      name: 'Test Expert Farmer',
      email: 'test.expert@example.com',
      password_hash: hashedPassword,
      role: 'public',
      featured: true,
      specialization: 'Rice Farming',
      achievement: 'Increased yield by 40% using sustainable methods',
      quote: 'SAKAP helped me learn modern techniques while preserving traditional wisdom.',
      province: 'Nueva Ecija',
      municipality: 'Cabanatuan',
      barangay: 'Mabini',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select();

  if (error) {
    console.error('Error adding featured expert:', error);
  } else {
    console.log('Featured expert added successfully:', data);
  }
}

addFeaturedExpert();