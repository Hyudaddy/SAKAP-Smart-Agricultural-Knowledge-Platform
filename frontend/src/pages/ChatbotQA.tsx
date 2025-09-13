import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';
import { Search, Edit, Trash2, Tag, Link, Filter, ExternalLink, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const ChatbotQA = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = location.state?.userRole || sessionStorage.getItem('userRole') || 'public';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedKeyword, setSelectedKeyword] = useState('all');

  const mockQAData = [
    {
      id: 1,
      question: 'How do I manage rice blast disease?',
      answer: 'Rice blast disease can be managed through integrated approaches: 1) Use resistant varieties, 2) Apply balanced fertilization (avoid excessive nitrogen), 3) Maintain proper water management, 4) Use fungicides when necessary, 5) Practice crop rotation.',
      keywords: ['rice', 'disease', 'pest management', 'fungicide'],
      topic: 'Disease Management',
      linkedResources: [
        { title: 'Rice Farming Best Practices Guide', type: 'PDF', url: '/library' },
        { title: 'Crop Disease Identification Audio Guide', type: 'Audio', url: '/library' }
      ],
      createdDate: '2024-01-08',
      lastModified: '2024-01-08',
      usage: 156
    },
    {
      id: 2,
      question: 'What are the benefits of organic farming?',
      answer: 'Organic farming offers multiple benefits: 1) Environmental protection through reduced chemical use, 2) Improved soil health and biodiversity, 3) Higher market prices for certified organic products, 4) Reduced input costs over time, 5) Better long-term sustainability.',
      keywords: ['organic', 'sustainable', 'environment', 'certification'],
      topic: 'Organic Farming',
      linkedResources: [
        { title: 'Organic Farming Research Study', type: 'PDF', url: '/library' },
        { title: 'Sustainable Agriculture Webinar Series', type: 'Video', url: '/library' }
      ],
      createdDate: '2024-01-05',
      lastModified: '2024-01-06',
      usage: 234
    },
    {
      id: 3,
      question: 'How often should I irrigate my crops?',
      answer: 'Irrigation frequency depends on several factors: 1) Crop type and growth stage, 2) Soil type and drainage, 3) Weather conditions, 4) Season. Generally, check soil moisture at root level - irrigate when top 2-3 inches are dry. Most crops need 1-2 inches of water per week.',
      keywords: ['irrigation', 'water management', 'soil moisture', 'scheduling'],
      topic: 'Water Management',
      linkedResources: [
        { title: 'Water Management Training Video', type: 'Video', url: '/library' }
      ],
      createdDate: '2024-01-03',
      lastModified: '2024-01-04',
      usage: 189
    },
    {
      id: 4,
      question: 'What vaccinations do livestock need?',
      answer: 'Essential livestock vaccinations include: 1) Core vaccines (required): FMD, Rabies, Anthrax, 2) Risk-based vaccines: BVD, IBR, Leptospirosis, 3) Follow veterinarian recommendations, 4) Maintain vaccination records, 5) Consider regional disease prevalence.',
      keywords: ['livestock', 'vaccination', 'animal health', 'veterinary'],
      topic: 'Livestock Care',
      linkedResources: [
        { title: 'Livestock Care Handbook', type: 'PDF', url: '/library' }
      ],
      createdDate: '2024-01-01',
      lastModified: '2024-01-02',
      usage: 98
    },
    {
      id: 5,
      question: 'How do I improve soil fertility naturally?',
      answer: 'Natural soil fertility improvement methods: 1) Add organic matter (compost, manure), 2) Practice crop rotation with nitrogen-fixing plants, 3) Use cover crops to prevent erosion, 4) Minimize tillage, 5) Apply organic fertilizers, 6) Test soil pH and adjust naturally.',
      keywords: ['soil fertility', 'organic matter', 'compost', 'cover crops', 'rotation'],
      topic: 'Soil Management',
      linkedResources: [
        { title: 'Organic Farming Research Study', type: 'PDF', url: '/library' },
        { title: 'Sustainable Agriculture Webinar Series', type: 'Video', url: '/library' }
      ],
      createdDate: '2023-12-28',
      lastModified: '2023-12-30',
      usage: 142
    }
  ];

  const allTopics = [...new Set(mockQAData.map(qa => qa.topic))];
  const allKeywords = [...new Set(mockQAData.flatMap(qa => qa.keywords))];

  const filteredQA = mockQAData.filter(qa => {
    const matchesSearch = qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qa.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qa.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTopic = selectedTopic === 'all' || qa.topic === selectedTopic;
    const matchesKeyword = selectedKeyword === 'all' || qa.keywords.includes(selectedKeyword);
    return matchesSearch && matchesTopic && matchesKeyword;
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
                Chatbot Q&A Management
              </h1>
              <p className="text-muted-foreground">
                Manage the knowledge base for the SAKAP chatbot system
              </p>
            </div>
            <Button
              onClick={() => navigate('/create-qa', { state: { userRole } })}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Q&A
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions, answers, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {allTopics.map(topic => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                <SelectTrigger className="w-full md:w-48">
                  <Tag className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Keyword" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Keywords</SelectItem>
                  {allKeywords.map(keyword => (
                    <SelectItem key={keyword} value={keyword}>{keyword}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{mockQAData.length}</div>
                <p className="text-xs text-muted-foreground">Total Q&As</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{allTopics.length}</div>
                <p className="text-xs text-muted-foreground">Topics</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{allKeywords.length}</div>
                <p className="text-xs text-muted-foreground">Keywords</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {mockQAData.reduce((sum, qa) => sum + qa.usage, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total Usage</p>
              </CardContent>
            </Card>
          </div>

          {/* Q&A Entries */}
          <div className="space-y-6">
            {filteredQA.map((qa) => (
              <Card key={qa.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{qa.topic}</Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Used {qa.usage} times
                      </span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{qa.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{qa.answer}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {qa.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  {qa.linkedResources.length > 0 && (
                    <div>
                      <Separator className="my-3" />
                      <h4 className="text-sm font-medium mb-2">Linked Resources:</h4>
                      <div className="space-y-1">
                        {qa.linkedResources.map((resource, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="text-xs">
                              {resource.type}
                            </Badge>
                            <span className="flex-1">{resource.title}</span>
                            <Button size="sm" variant="ghost" className="h-6 px-2">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Created: {new Date(qa.createdDate).toLocaleDateString()}</span>
                    <span>Modified: {new Date(qa.lastModified).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredQA.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No Q&A entries found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
};

export default ChatbotQA;