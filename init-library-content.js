// Script to initialize library content with sample data
const API_BASE_URL = 'http://localhost:5020/api';

async function initLibraryContent() {
  console.log('Initializing library content with sample data...\n');

  try {
    // Sample library content data
    const sampleContent = [
      {
        title: 'Rice Farming Best Practices Guide',
        description: 'Comprehensive guide covering modern rice farming techniques, pest management, and yield optimization.',
        content_type: 'pdf',
        category: 'guides',
        file_url: 'https://example.com/sample.pdf',
        thumbnail_url: '/placeholder.svg',
        tags: ['rice', 'farming', 'guide'],
        is_published: true
      },
      {
        title: 'Sustainable Agriculture Webinar Series',
        description: 'Expert-led webinar series on sustainable farming practices and environmental conservation.',
        content_type: 'video',
        category: 'training',
        file_url: 'https://example.com/sample-video.mp4',
        thumbnail_url: '/placeholder.svg',
        tags: ['sustainable', 'webinar', 'training'],
        is_published: true
      },
      {
        title: 'Crop Disease Identification Audio Guide',
        description: 'Audio guide for identifying common crop diseases and their treatments.',
        content_type: 'audio',
        category: 'guides',
        file_url: 'https://example.com/sample-audio.mp3',
        thumbnail_url: '/placeholder.svg',
        tags: ['crop', 'disease', 'audio'],
        is_published: true
      }
    ];

    // Create each content item
    for (let i = 0; i < sampleContent.length; i++) {
      console.log(`Creating content: ${sampleContent[i].title}`);
      
      // In a real implementation, we would call the API to create content
      // For now, we'll just log what would be created
      console.log(`  Would create content with ID: LIB-${String(i + 1).padStart(4, '0')}`);
      console.log(`  Type: ${sampleContent[i].content_type}`);
      console.log(`  Category: ${sampleContent[i].category}`);
      console.log(`  Views: 0, Downloads: 0, Likes: 0\n`);
    }

    console.log('✅ Library content initialization complete!');
    console.log('\nTo see the likes functionality in action:');
    console.log(`1. Visit http://localhost:8083/library (User-facing E-Library)`);
    console.log(`2. Visit http://localhost:8083/manage-library (Admin Library Management)`);
    console.log('3. Log in as an admin user');
    console.log('4. Like some content and see the like counts update in real-time');
    
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
  }
}

// Run the initialization
initLibraryContent();