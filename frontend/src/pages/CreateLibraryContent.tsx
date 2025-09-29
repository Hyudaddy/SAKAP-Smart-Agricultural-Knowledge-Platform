import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, BookOpen, Play, Headphones } from 'lucide-react';

const CreateLibraryContent = () => {
  const navigate = useNavigate();
  const userRole = (sessionStorage.getItem('userRole') || 'admin') as 'admin' | 'aew' | 'public';
  
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'PDF',
    category: 'guides',
    description: '',
    file: null as File | null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!newResource.title || !newResource.file) {
      setError('Please provide a title and select a file');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', newResource.file);
      formData.append('title', newResource.title);
      formData.append('description', newResource.description);
      formData.append('content_type', newResource.type.toLowerCase());
      formData.append('category', newResource.category);

      // Get the authentication token
      const token = localStorage.getItem('authToken');

      const response = await fetch('/api/content/library', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
        // Reset form
        setNewResource({
          title: '',
          type: 'PDF',
          category: 'guides',
          description: '',
          file: null
        });
        
        // Show success message and redirect after a short delay
        setTimeout(() => {
          navigate('/manage-library');
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to create content');
      }
    } catch (err) {
      console.error('Error creating content:', err);
      setError(err instanceof Error ? err.message : 'Failed to create content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewResource({ ...newResource, file: e.target.files[0] });
    }
  };

  const handleCancel = () => {
    navigate('/manage-library');
  };

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

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Navigation userRole={userRole} />
      <main className="flex-1 overflow-auto ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Add New Library Content
              </h1>
              <p className="text-muted-foreground">
                Upload and manage agricultural resources for farmers and AEWs
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>
                Provide information about the library content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  Content created successfully! Redirecting to library management page...
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleCreateContent} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter content title" 
                      value={newResource.title}
                      onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Content Type *</Label>
                    <Select 
                      value={newResource.type} 
                      onValueChange={(value) => setNewResource({...newResource, type: value})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">
                          <div className="flex items-center">
                            {getTypeIcon('pdf')}
                            <span className="ml-2">PDF Document</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Video">
                          <div className="flex items-center">
                            {getTypeIcon('video')}
                            <span className="ml-2">Video</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Audio">
                          <div className="flex items-center">
                            {getTypeIcon('audio')}
                            <span className="ml-2">Audio</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={newResource.category} 
                      onValueChange={(value) => setNewResource({...newResource, category: value})}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guides">Guides</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the content" 
                      value={newResource.description}
                      onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                      rows={4}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="file">Upload File *</Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-border">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="flex text-sm text-muted-foreground">
                          <label className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:text-primary/80">
                            <span>Upload a file</span>
                            <input 
                              id="file" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleFileChange}
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {newResource.file ? newResource.file.name : 'PDF, MP4, MP3 up to 10MB'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Content'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
};

export default CreateLibraryContent;