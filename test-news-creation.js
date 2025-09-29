// Script to test creating news items using the backend services
require('dotenv').config({ path: './backend/.env' });
const { ContentService } = require('./backend/src/services/contentService');

// Sample news data
const sampleNews = [
  {
    title: 'New Agricultural Subsidy Program Launched',
    content: 'The Department of Agriculture announces a new subsidy program for small-scale farmers, providing financial assistance for organic farming transitions and equipment upgrades.\n\nThe Department of Agriculture (DA) has officially launched a comprehensive subsidy program aimed at supporting small-scale farmers across the Philippines. This groundbreaking initiative provides substantial financial assistance for farmers looking to transition to organic farming practices and upgrade their agricultural equipment.\n\nKey Features of the Subsidy Program:\n\n• Financial support up to ₱50,000 per qualified farmer\n• Technical assistance and training programs\n• Equipment upgrade subsidies covering up to 70% of costs\n• Organic certification support and guidance\n• Market linkage opportunities for organic produce\n\nEligibility Requirements:\n\n• Must be a registered small-scale farmer with land ownership or legal tenure\n• Farm size should not exceed 3 hectares\n• Must commit to organic farming practices for minimum 3 years\n• Participation in mandatory training programs\n• Compliance with environmental and safety standards\n\nApplication Process:\n\nInterested farmers can apply through their local Municipal Agriculture Office or visit the DA regional offices. The application period runs from January 15 to March 31, 2024. Required documents include farm ownership papers, barangay certification, and completion certificate from basic agricultural training.\n\nExpected Impact:\n\nThe program aims to benefit approximately 10,000 small-scale farmers nationwide, promoting sustainable agriculture while improving farmers income and food security. This initiative aligns with the governments commitment to environmental sustainability and rural development.',
    summary: 'The Department of Agriculture announces a new subsidy program for small-scale farmers, providing financial assistance for organic farming transitions and equipment upgrades.',
    author_id: 'ATI-ADMIN-001',
    author_name: 'ATI Admin',
    category: 'policy',
    is_published: true,
    published_at: new Date().toISOString()
  },
  {
    title: 'Climate-Resilient Rice Varieties Now Available',
    content: 'Research institutions have developed new rice varieties that can withstand extreme weather conditions. Seeds are now available for distribution through authorized dealers.\n\nAfter years of extensive research and field testing, Philippine research institutions have successfully developed climate-resilient rice varieties that demonstrate exceptional tolerance to extreme weather conditions, marking a significant breakthrough in agricultural science.\n\nNew Rice Varieties:\n\n• NSIC Rc 27 (Salinas 1) - Drought and salt-tolerant variety\n• NSIC Rc 28 (Sahod Ulan 18) - Flood-tolerant with high yield potential\n• NSIC Rc 29 (Tubigan 25) - Heat-tolerant variety suitable for dry season\n• NSIC Rc 30 (Katihan 8) - Multi-stress tolerant with premium grain quality\n\nKey Characteristics:\n\n• 20-30% higher yield compared to traditional varieties\n• Shorter maturity period (105-115 days)\n• Enhanced resistance to major rice diseases\n• Superior grain quality and milling recovery\n• Adaptable to various ecosystems and growing conditions\n\nAvailability and Distribution:\n\nSeeds are now available through the Philippine Seed Board-accredited seed growers and the Philippine Rice Research Institute (PhilRice) stations nationwide. The DA has allocated ₱200 million for seed multiplication and distribution to ensure widespread access.\n\nFarmer Training Programs:\n\nComprehensive training programs are being conducted to educate farmers on proper cultivation techniques, water management, and integrated pest management specific to these new varieties.\n\nTesting Results:\n\nField trials conducted across different regions showed consistent performance even under severe weather stress, with some varieties showing 40% better survival rates during drought conditions compared to conventional varieties.',
    summary: 'Research institutions have developed new rice varieties that can withstand extreme weather conditions. Seeds are now available for distribution through authorized dealers.',
    author_id: 'ATI-ADMIN-001',
    author_name: 'ATI Admin',
    category: 'technology',
    is_published: true,
    published_at: new Date(Date.now() - 86400000).toISOString() // Yesterday
  }
];

async function createSampleNews() {
  console.log('Creating sample news items...');
  
  // Check if Supabase is configured
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env');
    process.exit(1);
  }
  
  for (let i = 0; i < sampleNews.length; i++) {
    try {
      const newsItem = sampleNews[i];
      const result = await ContentService.createNews(newsItem);
      console.log(`Successfully created news item: ${result.title} with ID: ${result.id}`);
    } catch (error) {
      console.error('Error creating news item:', error.message);
    }
  }
  
  console.log('Sample news creation completed.');
}

// Run the function
createSampleNews().catch(console.error);