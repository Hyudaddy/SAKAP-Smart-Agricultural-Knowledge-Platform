import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';
import { Search, Filter, BookOpen, Play, Headphones, Download, Eye, Heart, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ELibrary = () => {
  const location = useLocation();
  const userRole = location.state?.userRole || sessionStorage.getItem('userRole') || 'public';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [likedResources, setLikedResources] = useState(new Set());

  const mockResources = [
    {
      id: 1,
      title: 'Rice Farming Best Practices Guide',
      type: 'PDF',
      category: 'guides',
      description: 'Comprehensive guide covering modern rice farming techniques, pest management, and yield optimization.',
      views: 1245,
      likes: 89,
      downloadUrl: '#',
      contentUrl: 'https://example.com/sample.pdf',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Sustainable Agriculture Webinar Series',
      type: 'Video',
      category: 'training',
      description: 'Expert-led webinar series on sustainable farming practices and environmental conservation.',
      views: 892,
      likes: 156,
      downloadUrl: '#',
      contentUrl: 'https://example.com/sample-video.mp4',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Crop Disease Identification Audio Guide',
      type: 'Audio',
      category: 'guides',
      description: 'Audio guide for identifying common crop diseases and their treatments.',
      views: 634,
      likes: 67,
      downloadUrl: '#',
      contentUrl: 'https://example.com/sample-audio.mp3',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Organic Farming Research Study',
      type: 'PDF',
      category: 'research',
      description: 'Latest research findings on organic farming methods and their economic impact.',
      views: 789,
      likes: 112,
      downloadUrl: '#',
      contentUrl: 'https://example.com/research.pdf',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 5,
      title: 'Water Management Training Video',
      type: 'Video',
      category: 'training',
      description: 'Practical training on efficient water management systems for agricultural use.',
      views: 567,
      likes: 78,
      downloadUrl: '#',
      contentUrl: 'https://example.com/water-management.mp4',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 6,
      title: 'Livestock Care Handbook',
      type: 'PDF',
      category: 'guides',
      description: 'Complete handbook covering livestock health, nutrition, and breeding practices.',
      views: 923,
      likes: 134,
      downloadUrl: '#',
      contentUrl: 'https://example.com/livestock.pdf',
      thumbnail: '/placeholder.svg'
    }
  ];

  const mostViewedResources = mockResources.sort((a, b) => b.views - a.views).slice(0, 3);

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <BookOpen className="h-5 w-5" />;
      case 'video':
        return <Play className="h-5 w-5" />;
      case 'audio':
        return <Headphones className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    setIsViewerOpen(true);
  };

  const handleLike = (resourceId, e) => {
    e.stopPropagation();
    const newLikedResources = new Set(likedResources);
    if (newLikedResources.has(resourceId)) {
      newLikedResources.delete(resourceId);
    } else {
      newLikedResources.add(resourceId);
    }
    setLikedResources(newLikedResources);
  };

  const handleDownload = (resource, e) => {
    e.stopPropagation();
    // In a real application, this would trigger the actual download
    console.log('Downloading:', resource.title);
    // window.open(resource.downloadUrl, '_blank');
  };

  const renderResourceContent = (resource) => {
    if (!resource) return null;

    switch (resource.type.toLowerCase()) {
      case 'pdf':
        return (
          <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">PDF Viewer</p>
              <p className="text-sm text-gray-500">In a real application, this would display the PDF content</p>
              <iframe 
                src={`${resource.contentUrl}#toolbar=0`}
                className="w-full h-96 mt-4 border rounded"
                title={resource.title}
              />
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="w-full">
            <video 
              controls 
              className="w-full h-auto rounded-lg"
              poster={resource.thumbnail}
            >
              <source src={resource.contentUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'audio':
        return (
          <div className="w-full bg-gray-50 rounded-lg p-8 text-center">
            <Headphones className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-4">{resource.title}</h3>
            <audio controls className="w-full max-w-md mx-auto">
              <source src={resource.contentUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return <div>Unsupported content type</div>;
    }
  };

  const ResourceCard = ({ resource, isCompact = false }) => (
    <Card 
      key={resource.id} 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
      onClick={() => handleResourceClick(resource)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="w-fit">
            {getTypeIcon(resource.type)}
            <span className="ml-2">{resource.type}</span>
          </Badge>
          {!isCompact && (
            <Badge variant="outline" className="capitalize">{resource.category}</Badge>
          )}
        </div>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{resource.description}</CardDescription>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {resource.views}
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {resource.likes + (likedResources.has(resource.id) ? 1 : 0)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleLike(resource.id, e)}
              className={`${likedResources.has(resource.id) ? 'text-red-500 border-red-200' : ''}`}
            >
              <Heart className={`h-4 w-4 ${likedResources.has(resource.id) ? 'fill-current' : ''}`} />
            </Button>
            <Button size="sm" onClick={(e) => handleDownload(resource, e)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Navigation userRole={userRole} />
      <main className="flex-1 overflow-auto ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">E-Library</h1>
            <p className="text-muted-foreground">Access agricultural resources, guides, and research materials</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="guides">Guides</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Most Viewed Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Most Viewed Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mostViewedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} isCompact={true} />
              ))}
            </div>
          </div>

          {/* All Resources */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">All Resources ({filteredResources.length})</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </div>

        {/* Resource Viewer Dialog */}
        <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {selectedResource?.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {selectedResource?.views} views
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {selectedResource?.likes + (likedResources.has(selectedResource?.id) ? 1 : 0)} likes
                </div>
                <Badge variant="outline" className="capitalize">
                  {selectedResource?.category}
                </Badge>
              </div>
            </DialogHeader>
            <div className="overflow-auto max-h-[calc(90vh-120px)]">
              {renderResourceContent(selectedResource)}
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {selectedResource?.description}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={(e) => handleLike(selectedResource?.id, e)}
                  className={`${likedResources.has(selectedResource?.id) ? 'text-red-500 border-red-200' : ''}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${likedResources.has(selectedResource?.id) ? 'fill-current' : ''}`} />
                  {likedResources.has(selectedResource?.id) ? 'Liked' : 'Like'}
                </Button>
                <Button onClick={(e) => handleDownload(selectedResource, e)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Floating Chatbot Widget */}
        <FloatingChatbot />
      </main>
    </div>
  );
};

export default ELibrary;