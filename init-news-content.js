// Script to initialize the news table with sample data
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - replace with your actual values
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_KEY';

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_KEY') {
  console.error('Please set SUPABASE_URL and SUPABASE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
  },
  {
    title: 'Updated Guidelines for Organic Certification',
    content: 'The Bureau of Agriculture and Fisheries Standards has released updated guidelines for organic certification, streamlining the process for farmers seeking organic certification.\n\nThe Bureau of Agriculture and Fisheries Standards (BAFS) has released comprehensive updated guidelines for organic certification, significantly streamlining the process and making it more accessible for Filipino farmers interested in organic agriculture.\n\nMajor Updates Include:\n\n• Simplified application procedures with reduced documentation requirements\n• Digital submission options through the BAFS online portal\n• Faster processing time: reduced from 90 to 45 working days\n• Lower certification fees for small-scale farmers\n• Enhanced support for transition period farmers\n\nNew Certification Categories:\n\n• Individual Producer Certification\n• Group Certification for farmer cooperatives\n• Processor and Handler Certification\n• Input Material Certification\n• Import Certification for organic products\n\nKey Requirements:\n\n• Minimum 3-year transition period for conventional farms\n• Detailed organic system plan submission\n• Annual inspection by accredited certification bodies\n• Proper record-keeping and documentation\n• Compliance with National Organic Standards\n\nSupport Services:\n\n• Free consultation services for first-time applicants\n• Training workshops on organic farming standards\n• Technical assistance during transition period\n• Market linkage programs for certified organic farmers\n• Financial assistance through partner lending institutions\n\nImplementation Timeline:\n\nThe new guidelines take effect immediately, with a 6-month grace period for existing applicants to comply with updated requirements. BAFS regional offices are conducting orientation sessions for farmers and certification bodies.\n\nExpected Benefits:\n\nThe streamlined process is expected to increase organic certification participation by 50% and support the governments goal of expanding organic agriculture to 5% of total agricultural land by 2028.',
    summary: 'The Bureau of Agriculture and Fisheries Standards has released updated guidelines for organic certification, streamlining the process for farmers seeking organic certification.',
    author_id: 'ATI-ADMIN-001',
    author_name: 'ATI Admin',
    category: 'policy',
    is_published: true,
    published_at: new Date(Date.now() - 2 * 86400000).toISOString() // 2 days ago
  },
  {
    title: 'Integrated Pest Management Workshop Series',
    content: 'A nationwide workshop series on Integrated Pest Management will be conducted starting February 2024. Registration is open for all agricultural extension workers and farmers.\n\nThe Department of Agriculture, in partnership with the Agricultural Training Institute, announces a comprehensive nationwide workshop series on Integrated Pest Management (IPM) scheduled to begin in February 2024.\n\nWorkshop Objectives:\n\n• Promote sustainable pest control methods\n• Reduce dependency on chemical pesticides\n• Enhance crop productivity and quality\n• Protect environmental and human health\n• Build local expertise in IPM techniques\n\nProgram Coverage:\n\n• Biological pest control methods\n• Cultural management practices\n• Proper use of biopesticides and organic inputs\n• Pest monitoring and identification techniques\n• Economic threshold determination\n• Record-keeping and evaluation methods\n\nTarget Participants:\n\n• Agricultural Extension Workers (AEWs)\n• Farmer leaders and cooperative members\n• Agricultural technicians and researchers\n• Private sector stakeholders\n• Students and academic staff\n\nWorkshop Schedule:\n\n• February 2024: Luzon regions (NCR, CAR, Regions I-V)\n• March 2024: Visayas regions (Regions VI-VIII)\n• April 2024: Mindanao regions (Regions IX-XIII, BARMM)\n• May 2024: Follow-up and advanced sessions\n\nRegistration Information:\n\n• Online registration through DA-ATI website\n• Registration fee: ₱500 for farmers, ₱1,000 for others\n• Includes training materials, meals, and certificate\n• Limited slots: 50 participants per session\n• Priority given to registered farmers and cooperatives\n\nResource Persons:\n\n• International and local IPM experts\n• University researchers and professors\n• Successful IPM practitioner farmers\n• DA technical specialists\n\nExpected Outcomes:\n\nParticipants will receive hands-on training, demonstration materials, and ongoing technical support to implement IPM in their respective areas, contributing to sustainable agriculture development nationwide.',
    summary: 'A nationwide workshop series on Integrated Pest Management will be conducted starting February 2024. Registration is open for all agricultural extension workers and farmers.',
    author_id: 'ATI-ADMIN-001',
    author_name: 'ATI Admin',
    category: 'training',
    is_published: true,
    published_at: new Date(Date.now() - 3 * 86400000).toISOString() // 3 days ago
  },
  {
    title: 'Digital Agriculture Platform Beta Testing',
    content: 'The Department of Agriculture invites farmers to participate in beta testing of the new digital agriculture platform, featuring crop monitoring and market price updates.\n\nThe Department of Agriculture proudly invites progressive farmers and agricultural stakeholders to participate in the beta testing phase of the revolutionary Digital Agriculture Platform, a cutting-edge technology solution designed to modernize Philippine agriculture.\n\nPlatform Features:\n\n• Real-time crop monitoring using satellite imagery\n• Weather forecasting and climate data integration\n• Market price tracking and trends analysis\n• Pest and disease alert system\n• Digital farm record management\n• Direct market linkage opportunities\n• Agricultural advisory and consultation services\n\nKey Components:\n\n• Mobile application for smartphones and tablets\n• Web-based dashboard for detailed analytics\n• SMS-based alerts for areas with limited internet\n• Integration with existing DA programs and services\n• Multi-language support (English, Filipino, major regional languages)\n\nBeta Testing Requirements:\n\n• Active farmers with smartphone or computer access\n• Willingness to provide feedback and suggestions\n• Commitment to use platform for minimum 3 months\n• Participation in training sessions and surveys\n• Basic digital literacy skills\n\nBenefits for Beta Testers:\n\n• Free access to premium platform features\n• Priority technical support and assistance\n• Direct input in platform development\n• Recognition as pioneer digital farmers\n• Networking opportunities with tech-savvy farmers\n\nTesting Schedule:\n\n• Phase 1 (January-March 2024): Core functionality testing\n• Phase 2 (April-June 2024): Advanced features and integration\n• Phase 3 (July-September 2024): Performance optimization\n• Official Launch: October 2024\n\nHow to Apply:\n\n• Submit application through DA regional offices\n• Online registration via official DA website\n• Nomination by agricultural extension workers\n• Endorsement by farmer associations or cooperatives\n\nTechnical Support:\n\nDedicated help desk and technical team available 24/7 during testing period, with regular training sessions and user guides provided in multiple formats.\n\nFuture Vision:\n\nThe platform aims to transform Philippine agriculture into a data-driven, efficient, and profitable sector, supporting the countrys food security and farmers livelihood goals.',
    summary: 'The Department of Agriculture invites farmers to participate in beta testing of the new digital agriculture platform, featuring crop monitoring and market price updates.',
    author_id: 'ATI-ADMIN-001',
    author_name: 'ATI Admin',
    category: 'technology',
    is_published: true,
    published_at: new Date(Date.now() - 4 * 86400000).toISOString() // 4 days ago
  }
];

async function insertSampleNews() {
  console.log('Inserting sample news data...');
  
  // Generate IDs using the Supabase function
  for (let i = 0; i < sampleNews.length; i++) {
    try {
      // Generate a news ID using the Supabase function
      const { data: newsIdData, error: idError } = await supabase.rpc('generate_news_id');
      
      if (idError) {
        console.error('Error generating news ID:', idError);
        continue;
      }
      
      const newsItem = {
        ...sampleNews[i],
        id: newsIdData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('news')
        .insert(newsItem);
      
      if (error) {
        console.error('Error inserting news item:', error);
      } else {
        console.log(`Successfully inserted news item: ${newsItem.title}`);
      }
    } catch (err) {
      console.error('Error processing news item:', err);
    }
  }
  
  console.log('Sample news data insertion completed.');
}

// Run the function
insertSampleNews().catch(console.error);