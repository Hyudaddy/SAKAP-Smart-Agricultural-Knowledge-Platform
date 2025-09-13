import React, { useState } from 'react';
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

const News = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = location.state?.userRole || sessionStorage.getItem('userRole') || 'public';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleOpen, setIsArticleOpen] = useState(false);

  const mockNews = [
    {
      id: 1,
      title: 'New Agricultural Subsidy Program Launched',
      content: 'The Department of Agriculture announces a new subsidy program for small-scale farmers, providing financial assistance for organic farming transitions and equipment upgrades.',
      fullContent: `The Department of Agriculture (DA) has officially launched a comprehensive subsidy program aimed at supporting small-scale farmers across the Philippines. This groundbreaking initiative provides substantial financial assistance for farmers looking to transition to organic farming practices and upgrade their agricultural equipment.

Key Features of the Subsidy Program:

• Financial support up to ₱50,000 per qualified farmer
• Technical assistance and training programs
• Equipment upgrade subsidies covering up to 70% of costs
• Organic certification support and guidance
• Market linkage opportunities for organic produce

Eligibility Requirements:

• Must be a registered small-scale farmer with land ownership or legal tenure
• Farm size should not exceed 3 hectares
• Must commit to organic farming practices for minimum 3 years
• Participation in mandatory training programs
• Compliance with environmental and safety standards

Application Process:

Interested farmers can apply through their local Municipal Agriculture Office or visit the DA regional offices. The application period runs from January 15 to March 31, 2024. Required documents include farm ownership papers, barangay certification, and completion certificate from basic agricultural training.

Expected Impact:

The program aims to benefit approximately 10,000 small-scale farmers nationwide, promoting sustainable agriculture while improving farmers' income and food security. This initiative aligns with the government's commitment to environmental sustainability and rural development.`,
      category: 'policy',
      author: 'ATI Admin',
      publishDate: '2024-01-08',
      views: 1247,
      comments: 23,
      status: 'published'
    },
    {
      id: 2,
      title: 'Climate-Resilient Rice Varieties Now Available',
      content: 'Research institutions have developed new rice varieties that can withstand extreme weather conditions. Seeds are now available for distribution through authorized dealers.',
      fullContent: `After years of extensive research and field testing, Philippine research institutions have successfully developed climate-resilient rice varieties that demonstrate exceptional tolerance to extreme weather conditions, marking a significant breakthrough in agricultural science.

New Rice Varieties:

• NSIC Rc 27 (Salinas 1) - Drought and salt-tolerant variety
• NSIC Rc 28 (Sahod Ulan 18) - Flood-tolerant with high yield potential
• NSIC Rc 29 (Tubigan 25) - Heat-tolerant variety suitable for dry season
• NSIC Rc 30 (Katihan 8) - Multi-stress tolerant with premium grain quality

Key Characteristics:

• 20-30% higher yield compared to traditional varieties
• Shorter maturity period (105-115 days)
• Enhanced resistance to major rice diseases
• Superior grain quality and milling recovery
• Adaptable to various ecosystems and growing conditions

Availability and Distribution:

Seeds are now available through the Philippine Seed Board-accredited seed growers and the Philippine Rice Research Institute (PhilRice) stations nationwide. The DA has allocated ₱200 million for seed multiplication and distribution to ensure widespread access.

Farmer Training Programs:

Comprehensive training programs are being conducted to educate farmers on proper cultivation techniques, water management, and integrated pest management specific to these new varieties.

Testing Results:

Field trials conducted across different regions showed consistent performance even under severe weather stress, with some varieties showing 40% better survival rates during drought conditions compared to conventional varieties.`,
      category: 'technology',
      author: 'ATI Admin',
      publishDate: '2024-01-05',
      views: 892,
      comments: 15,
      status: 'published'
    },
    {
      id: 3,
      title: 'Updated Guidelines for Organic Certification',
      content: 'The Bureau of Agriculture and Fisheries Standards has released updated guidelines for organic certification, streamlining the process for farmers seeking organic certification.',
      fullContent: `The Bureau of Agriculture and Fisheries Standards (BAFS) has released comprehensive updated guidelines for organic certification, significantly streamlining the process and making it more accessible for Filipino farmers interested in organic agriculture.

Major Updates Include:

• Simplified application procedures with reduced documentation requirements
• Digital submission options through the BAFS online portal
• Faster processing time: reduced from 90 to 45 working days
• Lower certification fees for small-scale farmers
• Enhanced support for transition period farmers

New Certification Categories:

• Individual Producer Certification
• Group Certification for farmer cooperatives
• Processor and Handler Certification
• Input Material Certification
• Import Certification for organic products

Key Requirements:

• Minimum 3-year transition period for conventional farms
• Detailed organic system plan submission
• Annual inspection by accredited certification bodies
• Proper record-keeping and documentation
• Compliance with National Organic Standards

Support Services:

• Free consultation services for first-time applicants
• Training workshops on organic farming standards
• Technical assistance during transition period
• Market linkage programs for certified organic farmers
• Financial assistance through partner lending institutions

Implementation Timeline:

The new guidelines take effect immediately, with a 6-month grace period for existing applicants to comply with updated requirements. BAFS regional offices are conducting orientation sessions for farmers and certification bodies.

Expected Benefits:

The streamlined process is expected to increase organic certification participation by 50% and support the government's goal of expanding organic agriculture to 5% of total agricultural land by 2028.`,
      category: 'policy',
      author: 'ATI Admin',
      publishDate: '2024-01-03',
      views: 654,
      comments: 8,
      status: 'published'
    },
    {
      id: 4,
      title: 'Integrated Pest Management Workshop Series',
      content: 'A nationwide workshop series on Integrated Pest Management will be conducted starting February 2024. Registration is open for all agricultural extension workers and farmers.',
      fullContent: `The Department of Agriculture, in partnership with the Agricultural Training Institute, announces a comprehensive nationwide workshop series on Integrated Pest Management (IPM) scheduled to begin in February 2024.

Workshop Objectives:

• Promote sustainable pest control methods
• Reduce dependency on chemical pesticides
• Enhance crop productivity and quality
• Protect environmental and human health
• Build local expertise in IPM techniques

Program Coverage:

• Biological pest control methods
• Cultural management practices
• Proper use of biopesticides and organic inputs
• Pest monitoring and identification techniques
• Economic threshold determination
• Record-keeping and evaluation methods

Target Participants:

• Agricultural Extension Workers (AEWs)
• Farmer leaders and cooperative members
• Agricultural technicians and researchers
• Private sector stakeholders
• Students and academic staff

Workshop Schedule:

• February 2024: Luzon regions (NCR, CAR, Regions I-V)
• March 2024: Visayas regions (Regions VI-VIII)
• April 2024: Mindanao regions (Regions IX-XIII, BARMM)
• May 2024: Follow-up and advanced sessions

Registration Information:

• Online registration through DA-ATI website
• Registration fee: ₱500 for farmers, ₱1,000 for others
• Includes training materials, meals, and certificate
• Limited slots: 50 participants per session
• Priority given to registered farmers and cooperatives

Resource Persons:

• International and local IPM experts
• University researchers and professors
• Successful IPM practitioner farmers
• DA technical specialists

Expected Outcomes:

Participants will receive hands-on training, demonstration materials, and ongoing technical support to implement IPM in their respective areas, contributing to sustainable agriculture development nationwide.`,
      category: 'training',
      author: 'ATI Admin',
      publishDate: '2024-01-01',
      views: 543,
      comments: 12,
      status: 'published'
    },
    {
      id: 5,
      title: 'Digital Agriculture Platform Beta Testing',
      content: 'The Department of Agriculture invites farmers to participate in beta testing of the new digital agriculture platform, featuring crop monitoring and market price updates.',
      fullContent: `The Department of Agriculture proudly invites progressive farmers and agricultural stakeholders to participate in the beta testing phase of the revolutionary Digital Agriculture Platform, a cutting-edge technology solution designed to modernize Philippine agriculture.

Platform Features:

• Real-time crop monitoring using satellite imagery
• Weather forecasting and climate data integration
• Market price tracking and trends analysis
• Pest and disease alert system
• Digital farm record management
• Direct market linkage opportunities
• Agricultural advisory and consultation services

Key Components:

• Mobile application for smartphones and tablets
• Web-based dashboard for detailed analytics
• SMS-based alerts for areas with limited internet
• Integration with existing DA programs and services
• Multi-language support (English, Filipino, major regional languages)

Beta Testing Requirements:

• Active farmers with smartphone or computer access
• Willingness to provide feedback and suggestions
• Commitment to use platform for minimum 3 months
• Participation in training sessions and surveys
• Basic digital literacy skills

Benefits for Beta Testers:

• Free access to premium platform features
• Priority technical support and assistance
• Direct input in platform development
• Recognition as pioneer digital farmers
• Networking opportunities with tech-savvy farmers

Testing Schedule:

• Phase 1 (January-March 2024): Core functionality testing
• Phase 2 (April-June 2024): Advanced features and integration
• Phase 3 (July-September 2024): Performance optimization
• Official Launch: October 2024

How to Apply:

• Submit application through DA regional offices
• Online registration via official DA website
• Nomination by agricultural extension workers
• Endorsement by farmer associations or cooperatives

Technical Support:

Dedicated help desk and technical team available 24/7 during testing period, with regular training sessions and user guides provided in multiple formats.

Future Vision:

The platform aims to transform Philippine agriculture into a data-driven, efficient, and profitable sector, supporting the country's food security and farmers' livelihood goals.`,
      category: 'technology',
      author: 'ATI Admin',
      publishDate: '2023-12-28',
      views: 778,
      comments: 19,
      status: 'published'
    }
  ];

  // Handle article click
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsArticleOpen(true);
  };

  // Navigate between articles
  const navigateArticle = (direction) => {
    const currentIndex = mockNews.findIndex(article => article.id === selectedArticle.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : mockNews.length - 1;
    } else {
      newIndex = currentIndex < mockNews.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedArticle(mockNews[newIndex]);
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

  const filteredNews = mockNews.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                  {filteredNews[0].content}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(filteredNews[0].publishDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {filteredNews[0].author}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {filteredNews[0].views} views
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {filteredNews[0].comments} comments
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
                    {article.content}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.publishDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {article.comments}
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
                  {selectedArticle && new Date(selectedArticle.publishDate).toLocaleDateString()}
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
                {selectedArticle?.author}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {selectedArticle?.views} views
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {selectedArticle?.comments} comments
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-lg max-w-none">
              {selectedArticle?.fullContent && (
                <div className="whitespace-pre-line text-base leading-relaxed">
                  {selectedArticle.fullContent}
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-accent/20 pt-4 px-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Article {mockNews.findIndex(article => article.id === selectedArticle?.id) + 1} of {mockNews.length}
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