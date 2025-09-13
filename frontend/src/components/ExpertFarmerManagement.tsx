import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { expertFarmerAPI, ExpertFarmer } from '@/lib/expertFarmerAPI';
import { 
  Star, 
  Award, 
  Edit, 
  Trash2, 
  Plus, 
  Upload, 
  Eye,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

interface FarmerFormData {
  name: string;
  location: string;
  specialization: string;
  achievement: string;
  quote: string;
  eventsAttended: number;
  yearsExperience: number;
  profilePicture?: string;
}

const ExpertFarmerManagement: React.FC = () => {
  const [farmers, setFarmers] = useState<ExpertFarmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<ExpertFarmer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FarmerFormData>({
    name: '',
    location: '',
    specialization: '',
    achievement: '',
    quote: '',
    eventsAttended: 0,
    yearsExperience: 0
  });

  // Load farmers from API
  useEffect(() => {
    const loadFarmers = async () => {
      try {
        // In a real implementation, this would fetch all farmers, not just featured ones
        const featuredFarmers = await expertFarmerAPI.getFeaturedExperts();
        // For demo, we'll add some non-featured farmers to the list
        const allFarmers = [
          ...featuredFarmers,
          {
            id: '5',
            name: 'Carlos Reyes',
            location: 'Davao',
            specialization: 'Fruit Cultivation',
            achievement: 'Developed drought-resistant mango varieties',
            profilePicture: '/images/farmer 4.jpg',
            eventsAttended: 95,
            yearsExperience: 20,
            quote: 'Research and practice go hand in hand for agricultural success.',
            featured: false,
            clickCount: 134,
            impressions: 670
          },
          {
            id: '6',
            name: 'Ana Torres',
            location: 'Bohol',
            specialization: 'Coconut Farming',
            achievement: 'Sustainable coconut oil production pioneer',
            profilePicture: '/images/farmer 3.jpg',
            eventsAttended: 68,
            yearsExperience: 18,
            quote: 'Traditional methods with modern innovation create the best results.',
            featured: false,
            clickCount: 89,
            impressions: 456
          }
        ];
        setFarmers(allFarmers);
      } catch (error) {
        console.error('Failed to load farmers:', error);
      }
    };
    
    loadFarmers();
  }, []);

  const handleToggleFeatured = async (farmerId: string) => {
    const farmer = farmers.find(f => f.id === farmerId);
    if (!farmer) return;
    
    const newFeaturedStatus = !farmer.featured;
    
    try {
      const success = await expertFarmerAPI.updateFeaturedStatus(
        farmerId, 
        newFeaturedStatus,
        farmer.achievement,
        farmer.quote
      );
      
      if (success) {
        setFarmers(prev => prev.map(farmer => 
          farmer.id === farmerId 
            ? { 
                ...farmer, 
                featured: newFeaturedStatus,
                featuredAt: newFeaturedStatus ? new Date() : farmer.featuredAt
              }
            : farmer
        ));
      } else {
        alert('Failed to update featured status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status. Please try again.');
    }
  };

  const handleEditFarmer = (farmer: ExpertFarmer) => {
    setSelectedFarmer(farmer);
    setFormData({
      name: farmer.name,
      location: farmer.location,
      specialization: farmer.specialization,
      achievement: farmer.achievement,
      quote: farmer.quote || '',
      eventsAttended: farmer.eventsAttended,
      yearsExperience: farmer.yearsExperience,
      profilePicture: farmer.profilePicture
    });
    setIsEditDialogOpen(true);
  };

  const handleAddFarmer = () => {
    setFormData({
      name: '',
      location: '',
      specialization: '',
      achievement: '',
      quote: '',
      eventsAttended: 0,
      yearsExperience: 0
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveFarmer = () => {
    if (selectedFarmer) {
      // Update existing farmer
      setFarmers(prev => prev.map(farmer => 
        farmer.id === selectedFarmer.id 
          ? { ...farmer, ...formData }
          : farmer
      ));
      setIsEditDialogOpen(false);
    } else {
      // Add new farmer
      const newFarmer: ExpertFarmer = {
        id: Date.now().toString(),
        ...formData,
        featured: false,
        clickCount: 0,
        impressions: 0
      };
      setFarmers(prev => [...prev, newFarmer]);
      setIsAddDialogOpen(false);
    }
    setSelectedFarmer(null);
  };

  const handleDeleteFarmer = (farmerId: string) => {
    setFarmers(prev => prev.filter(farmer => farmer.id !== farmerId));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, profilePicture: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const featuredFarmers = farmers.filter(f => f.featured);
  const totalEngagement = farmers.reduce((sum, f) => sum + (f.clickCount || 0), 0);
  const totalImpressions = farmers.reduce((sum, f) => sum + (f.impressions || 0), 0);

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{featuredFarmers.length}</p>
                <p className="text-sm text-muted-foreground">Featured Farmers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{farmers.length}</p>
                <p className="text-sm text-muted-foreground">Total Experts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalImpressions}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{totalEngagement}</p>
                <p className="text-sm text-muted-foreground">Engagements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="farmers" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="farmers">Expert Farmers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <Button onClick={handleAddFarmer} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Expert Farmer</span>
          </Button>
        </div>

        <TabsContent value="farmers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {farmers.map((farmer) => (
              <Card key={farmer.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={farmer.profilePicture} />
                        <AvatarFallback>
                          {farmer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{farmer.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{farmer.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={farmer.featured ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleFeatured(farmer.id)}
                        className="h-8"
                      >
                        <Star className={`h-3 w-3 ${farmer.featured ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditFarmer(farmer)}
                        className="h-8"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFarmer(farmer.id)}
                        className="h-8 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Badge variant="secondary">{farmer.specialization}</Badge>
                    {farmer.featured && (
                      <Badge variant="default" className="ml-2">
                        <Award className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium">{farmer.achievement}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Events:</span> {farmer.eventsAttended}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Experience:</span> {farmer.yearsExperience}+ years
                    </div>
                    <div>
                      <span className="text-muted-foreground">Views:</span> {farmer.impressions || 0}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Clicks:</span> {farmer.clickCount || 0}
                    </div>
                  </div>
                  {farmer.quote && (
                    <blockquote className="text-sm italic text-muted-foreground border-l-4 border-primary pl-3">
                      "{farmer.quote}"
                    </blockquote>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Farmers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {farmers
                    .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
                    .slice(0, 5)
                    .map((farmer, index) => (
                      <div key={farmer.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={farmer.profilePicture} />
                            <AvatarFallback className="text-xs">
                              {farmer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{farmer.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {farmer.clickCount} clicks
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Farmers Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featuredFarmers.map((farmer) => (
                    <div key={farmer.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={farmer.profilePicture} />
                          <AvatarFallback className="text-xs">
                            {farmer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{farmer.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {farmer.impressions} views
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit/Add Dialog */}
      <Dialog open={isEditDialogOpen || isAddDialogOpen} onOpenChange={() => {
        setIsEditDialogOpen(false);
        setIsAddDialogOpen(false);
        setSelectedFarmer(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedFarmer ? 'Edit Expert Farmer' : 'Add Expert Farmer'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={formData.profilePicture} />
                  <AvatarFallback>
                    {formData.name.split(' ').map(n => n[0]).join('') || 'FF'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-upload"
                  />
                  <Label htmlFor="profile-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Farmer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specialization</Label>
              <Select value={formData.specialization} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, specialization: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rice Farming">Rice Farming</SelectItem>
                  <SelectItem value="Organic Vegetables">Organic Vegetables</SelectItem>
                  <SelectItem value="Aquaponics">Aquaponics</SelectItem>
                  <SelectItem value="Fruit Cultivation">Fruit Cultivation</SelectItem>
                  <SelectItem value="Livestock">Livestock</SelectItem>
                  <SelectItem value="Sustainable Agriculture">Sustainable Agriculture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Achievement</Label>
              <Input
                value={formData.achievement}
                onChange={(e) => setFormData(prev => ({ ...prev, achievement: e.target.value }))}
                placeholder="Notable achievement"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Events Attended</Label>
                <Input
                  type="number"
                  value={formData.eventsAttended}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventsAttended: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quote/Testimonial</Label>
              <Textarea
                value={formData.quote}
                onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                placeholder="Personal quote or testimonial about SAKAP"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setIsAddDialogOpen(false);
                setSelectedFarmer(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSaveFarmer}>
                {selectedFarmer ? 'Update' : 'Add'} Farmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertFarmerManagement;