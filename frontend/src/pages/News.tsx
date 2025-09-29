import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';
import { Calendar, User, Plus, Edit, Trash2, Search, Eye, MessageSquare, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { newsService } from '@/services/newsService';
import type { News as NewsType } from '@/services/newsService';

const News = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = location.state?.userRole || sessionStorage.getItem('userRole') || 'public';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsType | null>(null);
  const [isArticleOpen, setIsArticleOpen] = useState(false);
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news from the database
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = await newsService.getAllNews();
        setNews(newsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Handle article click
  const handleArticleClick = (article: NewsType) => {
    setSelectedArticle(article);
    setIsArticleOpen(true);
  };

  // Navigate between articles
  const navigateArticle = (direction: 'prev' | 'next') => {
    if (!selectedArticle) return;
    
    const currentIndex = news.findIndex(article => article.id === selectedArticle.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : news.length - 1;
    } else {
      newIndex = currentIndex < news.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedArticle(news[newIndex]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'policy':
        return 'bg-blue-100 text-blue-800';
      case 'technology':
        return 'bg-purple-100 text-purple-800';
      case 'training':
        return 'bg-green-100 text-green-800';
      case 'announcement':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background w-full">
        <Navigation userRole={userRole} />
        <main className="flex-1 overflow-auto ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          </div>
        </main>
        <FloatingChatbot />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background w-full">
        <Navigation userRole={userRole} />
        <main className="flex-1 overflow-auto ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </div>
        </main>
        <FloatingChatbot />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Navigation userRole={userRole} />
      <main className="flex-1 overflow-auto ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {userRole === 'admin' ? 'News Management' : 'Agricultural News & Updates'}
              </h1>
              <p className="text-muted-foreground">
                {userRole === 'admin' 
                  ? 'Publish and manage news articles, policy updates, and announcements'
                  : 'Stay updated with the latest agricultural policies, technologies, and training opportunities'
                }
              </p>
            </div>
            {userRole === 'admin' && (
              <Button onClick={() => navigate('/news/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Article
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="policy">Policy Updates</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="announcement">Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured Article */}
          {filteredNews.length > 0 && (
            <Card 
              className="mb-8 border-2 border-primary/20 cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => handleArticleClick(filteredNews[0])}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Featured</Badge>
                  <Badge className={getCategoryColor(filteredNews[0].category)}>
                    {filteredNews[0].category}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{filteredNews[0].title}</CardTitle>
                <CardDescription className="text-base">
                  {filteredNews[0].summary || filteredNews[0].content.substring(0, 150) + '...'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {filteredNews[0].published_at 
                        ? new Date(filteredNews[0].published_at).toLocaleDateString()
                        : new Date(filteredNews[0].created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {filteredNews[0].author_name}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      0 views
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      0 comments
                    </div>
                    {userRole === 'admin' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* News Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.slice(1).map((article) => (
              <Card 
                key={article.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleArticleClick(article)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(article.category)}>
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.summary || article.content.substring(0, 100) + '...'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.published_at 
                        ? new Date(article.published_at).toLocaleDateString()
                        : new Date(article.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author_name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        0 views
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        0 comments
                      </div>
                    </div>
                    
                    {userRole === 'admin' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-xs text-primary font-medium hover:underline">
                      Click to read full article
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No news articles found matching your search.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Full Article Dialog */}
      <Dialog open={isArticleOpen} onOpenChange={setIsArticleOpen}>
        <DialogContent className="bg-gradient-to-br from-primary/15 to-accent/25 border-accent/40 max-w-4xl w-full max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b border-accent/20 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={selectedArticle ? getCategoryColor(selectedArticle.category) : 'bg-gray-100 text-gray-800'}>
                  {selectedArticle?.category || 'Article'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedArticle && (selectedArticle.published_at 
                    ? new Date(selectedArticle.published_at).toLocaleDateString()
                    : new Date(selectedArticle.created_at).toLocaleDateString())}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigateArticle('prev')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigateArticle('next')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold mt-4">
              {selectedArticle?.title}
            </DialogTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {selectedArticle?.author_name}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                0 views
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                0 comments
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-lg max-w-none">
              {selectedArticle?.content && (
                <div className="whitespace-pre-line text-base leading-relaxed">
                  {selectedArticle.content}
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-accent/20 pt-4 px-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Article {news.findIndex(article => article.id === selectedArticle?.id) + 1} of {news.length}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Share Article
                </Button>
                {userRole === 'admin' && (
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <FloatingChatbot />
    </div>
  );
};

export default News;