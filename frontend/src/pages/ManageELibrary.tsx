import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';
import { Search, Filter, BookOpen, Play, Headphones, Upload, Edit, Trash2, Plus, Eye, Heart, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Define the LibraryContent interface
interface LibraryContent {
  id: string;
  title: string;
  description: string;
  content_type: string;
  category: string;
  file_url: string;
  thumbnail_url?: string;
  file_size?: number;
  uploaded_by: string;
  tags?: string[];
  is_published: boolean;
  download_count: number;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

const ManageELibrary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || sessionStorage.getItem('userRole') || 'admin';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditResourceOpen, setIsEditResourceOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<LibraryContent | null>(null);
  const [resources, setResources] = useState<LibraryContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<LibraryContent | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Fetch library content from the backend
  useEffect(() => {
    const fetchLibraryContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/content/library');
        const data = await response.json();
        
        if (data.success) {
          setResources(data.data.content);
        } else {
          setError('Failed to fetch library content');
        }
      } catch (err) {
        setError('Error fetching library content');
        console.error('Error fetching library content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryContent();
  }, []);

  const filteredResources = resources.filter(resource => {
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

  const handleResourceClick = async (resource: LibraryContent) => {
    // Increment view count when resource is viewed
    try {
      const response = await fetch(`/api/content/library/${resource.id}/view`, {
        method: 'PUT'
      });
      
      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      // Update the view count in the local state
      setResources(prevResources => 
        prevResources.map(r => 
          r.id === resource.id 
            ? { ...r, view_count: r.view_count + 1 } 
            : r
        )
      );
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
    
    setSelectedResource(resource);
    setIsViewerOpen(true);
  };

  const handleEditResource = async () => {
    if (!editingResource) return;
    
    try {
      // Get the authentication token
      const token = localStorage.getItem('authToken');

      const response = await fetch(`/api/content/library/${editingResource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: editingResource.title,
          description: editingResource.description,
          content_type: editingResource.content_type,
          category: editingResource.category
        })
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update the resource in the list
        setResources(resources.map(r => 
          r.id === editingResource.id ? result.data.content : r
        ));
        setIsEditResourceOpen(false);
        setEditingResource(null);
        alert('Resource updated successfully');
      } else {
        alert(`Error updating resource: ${result.message}`);
      }
    } catch (err) {
      console.error('Error updating resource:', err);
      alert(`Error updating resource: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }
    
    try {
      // Get the authentication token
      const token = localStorage.getItem('authToken');

      const response = await fetch(`/api/content/library/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Remove the resource from the list
        setResources(resources.filter(r => r.id !== id));
        alert('Resource deleted successfully');
      } else {
        alert(`Error deleting resource: ${result.message}`);
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert(`Error deleting resource: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const renderResourceContent = (resource: LibraryContent) => {
    if (!resource) return null;

    // Since we're using a proxy, we can access files directly through the same origin
    const fullFileUrl = `${resource.file_url}`;

    switch (resource.content_type.toLowerCase()) {
      case 'pdf':
        return (
          <div className="w-full h-[600px]">
            {/* Try Google Docs Viewer as a fallback for PDFs */}
            <iframe 
              src={`https://docs.google.com/gviewer?url=${encodeURIComponent(window.location.origin + fullFileUrl)}&embedded=true`}
              className="w-full h-full border rounded"
              title={resource.title}
              onError={(e) => {
                console.error('Google Docs Viewer failed, falling back to direct PDF:', e);
                // Fallback to direct PDF if Google Docs Viewer fails
                const iframe = e.target as HTMLIFrameElement;
                iframe.src = fullFileUrl;
              }}
            />
            {/* Fallback link in case iframe doesn't work */}
            <div className="mt-2 text-center">
              <p className="text-sm text-muted-foreground">If PDF doesn't display above, </p>
              <a 
                href={fullFileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                click here to open in new tab
              </a>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="w-full">
            <video 
              controls 
              className="w-full h-auto rounded-lg"
              poster={resource.thumbnail_url}
            >
              <source src={fullFileUrl} type="video/mp4" />
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
              <source src={fullFileUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return (
          <div className="text-center py-8">
            <p>Unsupported content type: {resource.content_type}</p>
            <Button onClick={() => window.open(fullFileUrl, '_blank')}>
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
          </div>
        );
    }
  };

  const handleDownload = async (resource: LibraryContent) => {
    // Increment download count
    try {
      await fetch(`/api/content/library/${resource.id}/download`, {
        method: 'PUT'
      });
      
      // Update the download count in the local state
      setResources(prevResources => 
        prevResources.map(r => 
          r.id === resource.id 
            ? { ...r, download_count: r.download_count + 1 } 
            : r
        )
      );
    } catch (err) {
      console.error('Error incrementing download count:', err);
    }
    
    // Trigger the actual download
    const downloadUrl = `${resource.file_url}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background w-full">
        <Navigation userRole={userRole as any} />
        <main className="flex-1 overflow-auto ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <p>Loading library content...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background w-full">
        <Navigation userRole={userRole as any} />
        <main className="flex-1 overflow-auto ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500">Error: {error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Navigation userRole={userRole as any} />
      <main className="flex-1 overflow-auto ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Manage E-Library</h1>
                <p className="text-muted-foreground">Add, edit, and organize agricultural resources for farmers and AEWs</p>
              </div>
              <Button onClick={() => navigate('/create-library-content')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Content
              </Button>
            </div>
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

          {/* Resources Grid */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">All Resources ({filteredResources.length})</h2>
            {filteredResources.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No resources found</h3>
                  <p className="text-muted-foreground mb-4">Add your first resource to get started</p>
                  <Button onClick={() => navigate('/create-library-content')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredResources.map((resource) => (
                  <Card 
                    key={resource.id} 
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                    onClick={() => handleResourceClick(resource)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="w-fit">
                          {getTypeIcon(resource.content_type)}
                          <span className="ml-2">{resource.content_type}</span>
                        </Badge>
                        <Badge variant="outline" className="capitalize">{resource.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{resource.description}</CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {resource.view_count}
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            {resource.download_count}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {resource.like_count}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingResource(resource);
                              setIsEditResourceOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteResource(resource.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Resource Dialog */}
        <Dialog open={isEditResourceOpen} onOpenChange={(open) => {
          setIsEditResourceOpen(open);
          if (!open) setEditingResource(null);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="edit-resource-description">
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
              <DialogDescription id="edit-resource-description">
                Modify the details of the selected resource. You can update the title, type, category, and description.
              </DialogDescription>
            </DialogHeader>
            {editingResource && (
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingResource.title}
                    onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                    placeholder="Enter resource title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-type">Resource Type</Label>
                  <Select 
                    value={editingResource.content_type} 
                    onValueChange={(value) => setEditingResource({ ...editingResource, content_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF Document</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={editingResource.category} 
                    onValueChange={(value) => setEditingResource({ ...editingResource, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guides">Guides</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingResource.description}
                    onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                    placeholder="Enter resource description"
                    rows={4}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditResourceOpen(false)}>Cancel</Button>
              <Button onClick={handleEditResource}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                  {selectedResource?.view_count} views
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  {selectedResource?.download_count} downloads
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {selectedResource?.like_count} likes
                </div>
                <Badge variant="outline" className="capitalize">
                  {selectedResource?.category}
                </Badge>
              </div>
            </DialogHeader>
            <div className="overflow-auto max-h-[calc(90vh-120px)]">
              {selectedResource && renderResourceContent(selectedResource)}
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {selectedResource?.description}
              </p>
              <Button onClick={() => selectedResource && handleDownload(selectedResource)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Floating Chatbot Widget */}
        <FloatingChatbot />
      </main>
    </div>
  );
};

export default ManageELibrary;