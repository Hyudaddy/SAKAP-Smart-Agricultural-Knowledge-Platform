# Using the Library Likes Feature

## Overview
This document explains how to use the newly implemented library likes feature in the SAKAP Agricultural Assistance Platform. The feature allows users to engage with library content through likes and provides administrators with engagement metrics.

## For End Users (Farmers, AEWs)

### Accessing the E-Library
1. Navigate to the E-Library section through the main navigation menu
2. Browse or search for agricultural resources
3. View content details by clicking on any resource

### Liking Content
1. In the E-Library, each resource card shows engagement metrics
2. Click the heart icon (♥) on any resource to like it
3. The heart icon will fill with color and the like count will increase
4. Click the heart icon again to unlike the content
5. Your likes are tracked per user to prevent duplicate likes

### Viewing Engagement Metrics
- View count: Number of times content has been viewed
- Download count: Number of times content has been downloaded
- Like count: Number of users who have liked the content

## For Administrators

### Accessing the Manage Library Section
1. Log in with admin credentials
2. Navigate to "Manage Library" in the sidebar (replaces "E-Library" for admins)
3. View all library content with full engagement metrics

### Managing Content
1. Add new content using the "Add Content" button
2. Edit existing content using the edit icon
3. Delete content using the trash icon
4. View detailed engagement metrics for each resource:
   - View count
   - Download count
   - Like count

### Content Engagement Analytics
Administrators can see real-time engagement metrics for all library content:
- Most viewed content
- Most downloaded content
- Most liked content
- Overall engagement trends

## Technical Implementation Details

### Database Structure
- `library_content` table now includes `like_count` column
- New `library_content_likes` table tracks user likes
- Indexes optimized for performance

### API Endpoints
- `GET /api/content/library` - Get all library content
- `GET /api/content/library/:id` - Get specific content
- `PUT /api/content/library/:id/view` - Increment view count
- `PUT /api/content/library/:id/download` - Increment download count
- `PUT /api/content/library/:id/like` - Toggle like (authenticated)

### Frontend Components
- `ELibrary.tsx` - User-facing library with like functionality
- `ManageELibrary.tsx` - Admin management interface with engagement metrics

## Testing the Feature

### Prerequisites
1. Development server running (`npm run dev`)
2. Database properly configured
3. Sample content created (can be done through admin interface)

### User Testing
1. Visit http://localhost:8081/library
2. Browse library content
3. Like several resources
4. Verify like counts update correctly
5. Unlike content and verify counts decrease

### Admin Testing
1. Visit http://localhost:8081/manage-library
2. Log in as admin
3. View engagement metrics for all content
4. Add/edit/delete content
5. Verify metrics display correctly

## Troubleshooting

### Common Issues and Solutions

1. **Likes not registering**
   - Ensure you're logged in as a user
   - Check browser console for API errors
   - Verify backend server is running

2. **Incorrect like counts**
   - Refresh the page to sync with database
   - Check database records directly
   - Verify API responses

3. **Performance issues**
   - Check database indexes
   - Monitor API response times
   - Verify network connectivity

### Debugging Steps

1. Check browser developer tools console for errors
2. Monitor network tab for API requests
3. Verify database records in Supabase dashboard
4. Check backend server logs for errors

## Best Practices

### For Users
- Like content that you find valuable
- Use search and filters to find relevant content
- Download content for offline access when needed

### For Administrators
- Regularly review engagement metrics to identify popular content
- Use analytics to guide content creation decisions
- Remove outdated or irrelevant content
- Encourage user engagement through quality content

## Future Enhancements

The current implementation provides a solid foundation for content engagement. Future enhancements could include:

1. **Advanced Analytics Dashboard**
   - Graphs and charts for engagement trends
   - User behavior analysis
   - Content performance reports

2. **Social Features**
   - Comments on library content
   - Sharing content on social media
   - User ratings and reviews

3. **Personalization**
   - Recommended content based on likes
   - Personalized content feeds
   - Bookmarking functionality

4. **Notifications**
   - Notify content creators when their content is liked
   - Alert users about new content in liked categories

## Conclusion

The library likes feature enhances user engagement with agricultural resources and provides administrators with valuable insights into content performance. The implementation follows best practices for security, performance, and usability.