import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  List, 
  Link,
  Quote,
  Heading1,
  Heading2,
  Type,
  Calendar,
  Tag,
  Globe,
  FileText,
  Trash2,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const CreateArticle = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [articleData, setArticleData] = useState({
    title: '',
    subtitle: '',
    category: '',
    content: '',
    featuredImage: null as File | null,
    featuredImageUrl: '',
    publishDate: new Date().toISOString().split('T')[0],
    author: 'ATI Admin',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published',
    isPublic: true,
    allowComments: true,
    seoTitle: '',
    seoDescription: '',
  });

  const [newTag, setNewTag] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{id: string, url: string, name: string}>>([]);

  const categories = [
    { value: 'policy', label: 'Policy Updates' },
    { value: 'technology', label: 'Technology & Innovation' },
    { value: 'training', label: 'Training & Education' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'research', label: 'Research & Development' },
    { value: 'market', label: 'Market Updates' },
    { value: 'weather', label: 'Weather & Climate' },
    { value: 'sustainability', label: 'Sustainability' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setArticleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setArticleData(prev => ({
        ...prev,
        featuredImage: file,
        featuredImageUrl: imageUrl
      }));
    }
  };

  const handleContentImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive"
        });
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      const newImage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        name: file.name
      };
      setUploadedImages(prev => [...prev, newImage]);
    });
  };

  const insertImageIntoContent = (imageUrl: string) => {
    const imageMarkdown = `\n\n![Image](${imageUrl})\n\n`;
    setArticleData(prev => ({
      ...prev,
      content: prev.content + imageMarkdown
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !articleData.tags.includes(newTag.trim())) {
      setArticleData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setArticleData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Draft saved",
        description: "Your article has been saved as draft"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!articleData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your article",
        variant: "destructive"
      });
      return;
    }

    if (!articleData.content.trim()) {
      toast({
        title: "Content required",
        description: "Please add content to your article",
        variant: "destructive"
      });
      return;
    }

    if (!articleData.category) {
      toast({
        title: "Category required",
        description: "Please select a category for your article",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setArticleData(prev => ({ ...prev, status: 'published' }));
      toast({
        title: "Article published",
        description: "Your article has been published successfully"
      });
      
      // Navigate back to news page after successful publish
      setTimeout(() => {
        navigate('/news', { state: { userRole: 'admin' } });
      }, 1000);
    } finally {
      setIsSaving(false);
    }
  };

  const formatText = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'list':
        formattedText = `- ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      default:
        return;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);
    
    setArticleData(prev => ({ ...prev, content: newContent }));
  };

  const PreviewContent = () => (
    <div className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-bold mb-2">{articleData.title || 'Article Title'}</h1>
      {articleData.subtitle && (
        <p className="text-xl text-muted-foreground mb-6">{articleData.subtitle}</p>
      )}
      
      {articleData.featuredImageUrl && (
        <img 
          src={articleData.featuredImageUrl} 
          alt="Featured" 
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
        <span>By {articleData.author}</span>
        <span>•</span>
        <span>{new Date(articleData.publishDate).toLocaleDateString()}</span>
        {articleData.category && (
          <>
            <span>•</span>
            <Badge>{categories.find(c => c.value === articleData.category)?.label}</Badge>
          </>
        )}
      </div>
      
      <div className="whitespace-pre-wrap">
        {articleData.content || 'Article content will appear here...'}
      </div>
      
      {articleData.tags.length > 0 && (
        <div className="mt-8 pt-4 border-t">
          <p className="text-sm font-medium mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {articleData.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation userRole="admin" />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/news', { state: { userRole: 'admin' } })}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to News
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold">Create New Article</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Globe className="h-4 w-4 mr-2" />
                {isSaving ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isPreviewMode ? (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <PreviewContent />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Main Editor */}
              <div className="xl:col-span-3 space-y-6">
                {/* Title and Subtitle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Article Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={articleData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter article title..."
                        className="text-lg font-medium h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={articleData.subtitle}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        placeholder="Enter article subtitle (optional)..."
                        className="h-8"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Featured Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {articleData.featuredImageUrl ? (
                      <div className="space-y-4">
                        <img 
                          src={articleData.featuredImageUrl} 
                          alt="Featured" 
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-8"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Change Image
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setArticleData(prev => ({ 
                              ...prev, 
                              featuredImage: null, 
                              featuredImageUrl: '' 
                            }))}
                            className="h-8"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">Click to upload featured image</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </CardContent>
                </Card>

                {/* Content Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Type className="h-5 w-5" />
                        Article Content
                      </div>
                      
                      {/* Formatting Toolbar */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText('bold')}
                          title="Bold"
                          className="h-8 w-8 p-0"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText('italic')}
                          title="Italic"
                          className="h-8 w-8 p-0"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText('h1')}
                          title="Heading 1"
                          className="h-8 w-8 p-0"
                        >
                          <Heading1 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText('h2')}
                          title="Heading 2"
                          className="h-8 w-8 p-0"
                        >
                          <Heading2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText('quote')}
                          title="Quote"
                          className="h-8 w-8 p-0"
                        >
                          <Quote className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText('list')}
                          title="List"
                          className="h-8 w-8 p-0"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText('link')}
                          title="Link"
                          className="h-8 w-8 p-0"
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      id="content-editor"
                      value={articleData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Write your article content here... You can use Markdown formatting."
                      className="min-h-96 resize-none font-mono text-sm"
                    />
                    
                    {/* Content Images */}
                    {uploadedImages.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label>Uploaded Images (click to insert)</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {uploadedImages.map(image => (
                            <div
                              key={image.id}
                              className="relative cursor-pointer group"
                              onClick={() => insertImageIntoContent(image.url)}
                            >
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-20 object-cover rounded border group-hover:opacity-80 transition-opacity"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus className="h-6 w-6 text-white bg-primary rounded-full p-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.multiple = true;
                          input.onchange = (event) => {
                            // Convert native DOM event to React-compatible event
                            const target = event.target as HTMLInputElement;
                            const reactEvent = {
                              target,
                              currentTarget: target,
                            } as React.ChangeEvent<HTMLInputElement>;
                            handleContentImageUpload(reactEvent);
                          };
                          input.click();
                        }}
                        className="h-8"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add Images to Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publishing Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Publishing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={articleData.category}
                        onValueChange={(value) => handleInputChange('category', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="publishDate">Publish Date</Label>
                      <Input
                        id="publishDate"
                        type="date"
                        value={articleData.publishDate}
                        onChange={(e) => handleInputChange('publishDate', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={articleData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isPublic">Public Article</Label>
                        <Switch
                          id="isPublic"
                          checked={articleData.isPublic}
                          onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="allowComments">Allow Comments</Label>
                        <Switch
                          id="allowComments"
                          checked={articleData.allowComments}
                          onCheckedChange={(checked) => handleInputChange('allowComments', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag..."
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="h-8"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addTag}
                        className="h-8"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {articleData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {articleData.tags.map(tag => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* SEO Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="seoTitle">SEO Title</Label>
                      <Input
                        id="seoTitle"
                        value={articleData.seoTitle}
                        onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                        placeholder="SEO optimized title..."
                        className="h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="seoDescription">SEO Description</Label>
                      <Textarea
                        id="seoDescription"
                        value={articleData.seoDescription}
                        onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                        placeholder="Brief description for search engines..."
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateArticle;