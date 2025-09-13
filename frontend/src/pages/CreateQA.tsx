import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  X, 
  Tag, 
  Link, 
  BookOpen, 
  Play, 
  Headphones,
  Eye,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const CreateQA = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = location.state?.userRole || sessionStorage.getItem('userRole') || 'public';
  
  // Form state
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    topic: '',
    keywords: '',
    linkedResources: []
  });
  
  // UI state
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResources, setSelectedResources] = useState(new Set());

  // Mock E-Library resources (same as ELibrary.tsx)
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

  const topics = [
    'Disease Management',
    'Organic Farming',
    'Water Management',
    'Livestock Care',
    'Soil Management',
    'Pest Control',
    'Crop Nutrition',
    'Harvesting',
    'Post-Harvest',
    'Market Information'
  ];

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <BookOpen className="h-4 w-4" />;
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'audio':
        return <Headphones className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleResourceToggle = (resourceId: number) => {
    const newSelected = new Set(selectedResources);
    if (newSelected.has(resourceId)) {
      newSelected.delete(resourceId);
    } else {
      newSelected.add(resourceId);
    }
    setSelectedResources(newSelected);
  };

  const handleResourcesConfirm = () => {
    const selectedResourcesList = mockResources.filter(resource => 
      selectedResources.has(resource.id)
    );
    setFormData(prev => ({
      ...prev,
      linkedResources: selectedResourcesList
    }));
    setIsResourceDialogOpen(false);
  };

  const removeLinkedResource = (resourceId: number) => {
    setFormData(prev => ({
      ...prev,
      linkedResources: prev.linkedResources.filter(resource => resource.id !== resourceId)
    }));
  };

  const handleSave = () => {
    // Validation
    if (!formData.question.trim()) {
      toast({
        title: "Error",
        description: "Question is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.answer.trim()) {
      toast({
        title: "Error",
        description: "Answer is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.topic) {
      toast({
        title: "Error",
        description: "Topic is required",
        variant: "destructive"
      });
      return;
    }

    // Here you would save to your backend
    console.log('Saving Q&A:', formData);
    
    toast({
      title: "Success",
      description: "Q&A entry saved successfully"
    });

    // Navigate back to ChatbotQA page
    navigate('/chatbot-qa', { state: { userRole } });
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    toast({
      title: "Draft Saved",
      description: "Your Q&A entry has been saved as draft"
    });
  };

  const ResourceCard = ({ resource, isSelected }) => (
    <Card className={`cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleResourceToggle(resource.id)}
            />
            <Badge variant="secondary" className="w-fit">
              {getTypeIcon(resource.type)}
              <span className="ml-2">{resource.type}</span>
            </Badge>
          </div>
          <Badge variant="outline" className="capitalize">{resource.category}</Badge>
        </div>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-3">{resource.description}</CardDescription>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {resource.views}
          </div>
          <div className="flex items-center">
            <Download className="h-3 w-3 mr-1" />
            {resource.likes}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Navigation userRole={userRole} />
      <main className="flex-1 overflow-auto ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/chatbot-qa', { state: { userRole } })}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Q&A Management
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Create Q&A Entry
                </h1>
                <p className="text-muted-foreground">
                  Create a new knowledge base entry for the rule-based chatbot
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Question & Answer</CardTitle>
                  <CardDescription>
                    Create the question and provide a comprehensive answer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question *</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter the question farmers might ask..."
                      value={formData.question}
                      onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                      className="min-h-20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="answer">Answer *</Label>
                    <Textarea
                      id="answer"
                      placeholder="Provide a comprehensive, detailed answer..."
                      value={formData.answer}
                      onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                      className="min-h-32"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Categorization</CardTitle>
                  <CardDescription>
                    Help organize and filter this Q&A entry
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Topic *</Label>
                    <Select value={formData.topic} onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map(topic => (
                          <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="rice, disease, pest management, fungicide (comma-separated)"
                      value={formData.keywords}
                      onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separate keywords with commas. These help users find relevant answers.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Linked Resources</CardTitle>
                  <CardDescription>
                    Link relevant E-Library resources that users can reference
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Link className="h-4 w-4 mr-2" />
                        Select E-Library Resources
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle>Select Resources from E-Library</DialogTitle>
                        <DialogDescription>
                          Choose relevant resources that users can reference for this Q&A
                        </DialogDescription>
                      </DialogHeader>
                      
                      {/* Resource Search and Filter */}
                      <div className="flex gap-4 mb-4">
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
                          <SelectTrigger className="w-48">
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

                      {/* Resource List */}
                      <div className="overflow-auto max-h-[400px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredResources.map(resource => (
                            <div key={resource.id} onClick={() => handleResourceToggle(resource.id)}>
                              <ResourceCard 
                                resource={resource} 
                                isSelected={selectedResources.has(resource.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dialog Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          {selectedResources.size} resource(s) selected
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleResourcesConfirm}>
                            Confirm Selection
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Selected Resources Display */}
                  {formData.linkedResources.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Selected Resources:</h4>
                      {formData.linkedResources.map(resource => (
                        <div key={resource.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {getTypeIcon(resource.type)}
                              <span className="ml-1">{resource.type}</span>
                            </Badge>
                            <div>
                              <p className="font-medium text-sm">{resource.title}</p>
                              <p className="text-xs text-muted-foreground">{resource.category}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeLinkedResource(resource.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleSave} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Q&A Entry
                  </Button>
                  <Button variant="outline" onClick={handleSaveDraft} className="w-full">
                    Save as Draft
                  </Button>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    How this will appear to users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.question && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Question:</p>
                      <p className="text-sm">{formData.question}</p>
                    </div>
                  )}
                  {formData.answer && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Answer:</p>
                      <p className="text-sm">{formData.answer.substring(0, 100)}...</p>
                    </div>
                  )}
                  {formData.topic && (
                    <div>
                      <Badge variant="outline">{formData.topic}</Badge>
                    </div>
                  )}
                  {formData.linkedResources.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Linked Resources: {formData.linkedResources.length}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Help */}
              <Card>
                <CardHeader>
                  <CardTitle>Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Write clear, specific questions that farmers would actually ask</p>
                  <p>• Provide comprehensive answers with actionable steps</p>
                  <p>• Use relevant keywords for better search results</p>
                  <p>• Link to resources that provide additional information</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
};

export default CreateQA;