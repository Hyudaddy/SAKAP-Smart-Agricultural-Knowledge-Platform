import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { 
  BookOpen, 
  Award, 
  Clock, 
  MapPin,
  TrendingUp,
  Play,
  FileText,
  Headphones,
  Edit2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Lightbulb,
  Star,
  GraduationCap,
  Camera,
  Upload
} from 'lucide-react';

const PublicDashboard = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [profileData, setProfileData] = useState({
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    id: 'PUB-001-CAR',
    country: 'Philippines',
    region: 'CAR',
    province: 'Benguet',
    city: 'Baguio City',
    barangay: 'Burnham Park',
    farmType: 'Rice Farm',
    email: 'juan.delacruz@gmail.com',
    phone: '+63 918 234 5678',
    profilePicture: '',
    coverPicture: ''
  });

  // Sample events data
  const events = [
    { date: new Date(2024, 2, 20), title: 'Farming Workshop', type: 'learning' },
    { date: new Date(2024, 2, 27), title: 'Harvest Planning', type: 'planning' },
    { date: new Date(2024, 3, 3), title: 'Crop Rotation Session', type: 'learning' },
    { date: new Date(2024, 3, 12), title: 'Market Day', type: 'marketing' }
  ];

  // Sample farming tips data
  const farmingTips = [
    {
      id: 1,
      title: "Morning Harvest Tips",
      content: "Harvest vegetables early morning when temperatures are cool to maintain freshness and extend shelf life.",
      category: "Harvesting",
      priority: "high",
      featured: true
    },
    {
      id: 2,
      title: "Companion Planting",
      content: "Plant marigolds near tomatoes to naturally repel pests and improve soil health.",
      category: "Crop Planning",
      priority: "medium",
      featured: false
    },
    {
      id: 3,
      title: "Watering Schedule",
      content: "Water plants deeply but less frequently to encourage deep root growth and drought resistance.",
      category: "Water Management",
      priority: "high",
      featured: true
    },
    {
      id: 4,
      title: "Seed Storage",
      content: "Store seeds in cool, dry places with silica gel packets to maintain viability for next season.",
      category: "Storage",
      priority: "low",
      featured: false
    }
  ];

  const handleSaveProfile = () => {
    // Here you would typically save to backend/localStorage
    setIsEditingProfile(false);
  };

  // Handle file upload for profile and cover pictures
  const handleFileUpload = (field: 'profilePicture' | 'coverPicture', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload this to your server
      // For now, we'll just create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setProfileData({ ...profileData, [field]: imageUrl });
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isDateWithEvent = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.some(event => 
      event.date.getDate() === day &&
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const getEventsForDate = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => 
      event.date.getDate() === day &&
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-5"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEvent = isDateWithEvent(day);
      const isSelected = selectedDate.getDate() === day &&
                        selectedDate.getMonth() === currentDate.getMonth() &&
                        selectedDate.getFullYear() === currentDate.getFullYear();
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
          className={`h-5 w-5 flex items-center justify-center text-xs cursor-pointer rounded transition-colors relative ${
            isSelected 
              ? 'bg-primary text-primary-foreground'
              : hasEvent
              ? 'bg-accent/20 text-accent font-medium hover:bg-accent/30'
              : 'hover:bg-secondary'
          }`}
        >
          {day}
          {hasEvent && <div className="absolute w-0.5 h-0.5 bg-primary rounded-full bottom-0 right-0.5"></div>}
        </div>
      );
    }

    return days;
  };

  // Sample reading progress data for line chart
  const readingProgressData = [
    { month: 'Jan', books: 2 },
    { month: 'Feb', books: 3 },
    { month: 'Mar', books: 1 },
    { month: 'Apr', books: 4 },
    { month: 'May', books: 3 },
    { month: 'Jun', books: 5 },
    { month: 'Jul', books: 2 }
  ];

  // Training/Events data based on Dreyfus model
  const eventsAttended = 7; // Current number of events attended
  
  // Dreyfus model skill levels based on events attended
  const getSkillLevel = (events: number) => {
    if (events < 10) return { level: 'Novice', description: 'Just starting the learning journey', color: 'bg-red-500', progress: (events / 10) * 100 };
    if (events < 25) return { level: 'Advanced Beginner', description: 'Gaining practical experience', color: 'bg-orange-500', progress: ((events - 10) / 15) * 100 };
    if (events < 50) return { level: 'Competent', description: 'Can handle routine situations', color: 'bg-yellow-500', progress: ((events - 25) / 25) * 100 };
    if (events < 75) return { level: 'Proficient', description: 'Sees the bigger picture', color: 'bg-blue-500', progress: ((events - 50) / 25) * 100 };
    return { level: 'Expert', description: 'Intuitive understanding and mastery', color: 'bg-green-500', progress: 100 };
  };

  const skillLevel = getSkillLevel(eventsAttended);
  const nextLevelEvents = eventsAttended < 10 ? 10 : eventsAttended < 25 ? 25 : eventsAttended < 50 ? 50 : eventsAttended < 75 ? 75 : 100;

  const chartConfig = {
    books: {
      label: "Books Read",
      color: "hsl(var(--primary))",
    },
  };


  const recentBooks = [
    { title: 'Sustainable Rice Farming Techniques', author: 'Dr. Maria Santos', dateRead: '2 days ago', category: 'Agriculture' },
    { title: 'Organic Pest Control Methods', author: 'Juan Valdez', dateRead: '5 days ago', category: 'Pest Management' },
    { title: 'Climate-Resilient Crop Varieties', author: 'Dr. Chen Wei', dateRead: '1 week ago', category: 'Climate Science' },
  ];



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Track your agricultural learning journey</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          Farmer
        </Badge>
      </div>

      {/* Profile Card, Calendar, and Farming Tips */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="shadow-soft border-border/50 bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 h-[280px]">
          <CardContent className="p-0">
            {/* Cover Photo */}
            <div className="h-12 bg-gradient-to-r from-primary/30 to-accent/30 rounded-t-lg relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditingProfile(true)}
                className="absolute top-2 right-2 h-6 w-6 p-0 border-white/20 hover:bg-white/10"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Profile Content */}
            <div className="px-4 pb-4 -mt-6 relative">
              {/* Profile Picture */}
              <div className="flex justify-center mb-3">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src={profileData.profilePicture || "/placeholder-farmer.jpg"} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-lg font-semibold">
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Name and Badge */}
              <div className="text-center mb-3">
                <h3 className="text-lg font-semibold text-foreground mb-2">{profileData.firstName} {profileData.lastName}</h3>
                <div className="inline-block px-3 py-1 bg-primary/20 rounded-full">
                  <span className="text-xs font-medium text-primary">Farmer</span>
                </div>
              </div>
              
              {/* User Details */}
              <div className="text-center space-y-1 text-xs text-muted-foreground">
                <p>Farmer ID: {profileData.id}</p>
                <div className="flex items-center justify-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{profileData.barangay}, {profileData.city}</span>
                </div>
                <p>{profileData.farmType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Widget */}
        <Card className="shadow-soft border-border/50 h-[280px] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm">My Schedule</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="h-6 w-6 p-0"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs font-medium min-w-[100px] text-center">
                  {currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="h-6 w-6 p-0"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 flex-1 overflow-hidden">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="h-5 flex items-center justify-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
            
            {/* Events for selected date */}
            <div className="border-t pt-2">
              <h4 className="text-xs font-medium mb-1">
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} Events
              </h4>
              <div className="space-y-1 max-h-16 overflow-y-auto">
                {getEventsForDate(selectedDate.getDate()).length > 0 ? (
                  getEventsForDate(selectedDate.getDate()).map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-1 bg-secondary/30 rounded text-xs">
                      <div className="flex-1">
                        <p className="font-medium truncate">{event.title}</p>
                      </div>
                      <Badge variant="outline" className="text-xs h-3 px-1">
                        {event.type.charAt(0).toUpperCase()}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">No events</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-1 h-6 text-xs border-primary/20 hover:bg-primary/5"
              >
                <Plus className="h-2 w-2 mr-1" />
                Add Event
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Farming Tip Card */}
        <Card className="shadow-soft border-border/50 h-[280px] flex flex-col">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span className="text-sm">Farming Tip</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0 border-primary/20 hover:bg-primary/5"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {/* Featured Tip */}
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {farmingTips.find(tip => tip.featured)?.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed px-4">
                  {farmingTips.find(tip => tip.featured)?.content}
                </p>
              </div>
              <div className="flex justify-center">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {farmingTips.find(tip => tip.featured)?.category}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="bg-gradient-to-br from-primary/15 to-accent/25 border-primary/40 max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Left Column - Personal Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Personal Information</h3>
              
              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileData.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-lg font-semibold">
                      {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('profilePicture', e)}
                      className="hidden"
                      id="profile-picture-upload"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('profile-picture-upload')?.click()}
                      className="flex items-center space-x-2 h-8"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Upload Photo</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cover Picture Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Cover Picture</Label>
                <div className="space-y-2">
                  <div className="h-12 bg-gradient-to-r from-primary/30 to-accent/30 rounded-lg relative overflow-hidden">
                    {profileData.coverPicture && (
                      <img src={profileData.coverPicture} alt="Cover" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('coverPicture', e)}
                      className="hidden"
                      id="cover-picture-upload"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('cover-picture-upload')?.click()}
                      className="flex items-center space-x-2 h-8"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Photo</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">First Name</Label>
                  <Input
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Last Name</Label>
                  <Input
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className="mt-1 h-8"
                  />
                </div>
              </div>

              {/* ID - Non-editable */}
              <div>
                <Label className="text-sm font-medium text-foreground">Farmer ID</Label>
                <Input
                  value={profileData.id}
                  disabled
                  className="mt-1 h-8 bg-muted/50 text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1 italic">System assigned - cannot be edited</p>
              </div>

              {/* Farm Type */}
              <div>
                <Label className="text-sm font-medium text-foreground">Farm Type</Label>
                <Select 
                  value={profileData.farmType} 
                  onValueChange={(value) => setProfileData({...profileData, farmType: value})}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="Select farm type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rice Farm">Rice Farm</SelectItem>
                    <SelectItem value="Vegetable Farm">Vegetable Farm</SelectItem>
                    <SelectItem value="Fruit Farm">Fruit Farm</SelectItem>
                    <SelectItem value="Livestock Farm">Livestock Farm</SelectItem>
                    <SelectItem value="Mixed Farm">Mixed Farm</SelectItem>
                    <SelectItem value="Organic Farm">Organic Farm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Information */}
              <div>
                <Label className="text-sm font-medium text-foreground">Email</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="mt-1 h-8"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">Phone</Label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="mt-1 h-8"
                />
              </div>
            </div>

            {/* Right Column - Location Hierarchy */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Location Information</h3>
              
              {/* Country */}
              <div>
                <Label className="text-sm font-medium text-foreground">Country</Label>
                <Select 
                  value={profileData.country} 
                  onValueChange={(value) => setProfileData({...profileData, country: value})}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Philippines">Philippines</SelectItem>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div>
                <Label className="text-sm font-medium text-foreground">Region</Label>
                <Select 
                  value={profileData.region} 
                  onValueChange={(value) => setProfileData({...profileData, region: value})}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NCR">National Capital Region (NCR)</SelectItem>
                    <SelectItem value="CAR">Cordillera Administrative Region (CAR)</SelectItem>
                    <SelectItem value="Region I">Region I - Ilocos Region</SelectItem>
                    <SelectItem value="Region II">Region II - Cagayan Valley</SelectItem>
                    <SelectItem value="Region III">Region III - Central Luzon</SelectItem>
                    <SelectItem value="Region IV-A">Region IV-A - CALABARZON</SelectItem>
                    <SelectItem value="Region IV-B">Region IV-B - MIMAROPA</SelectItem>
                    <SelectItem value="Region V">Region V - Bicol Region</SelectItem>
                    <SelectItem value="Region VI">Region VI - Western Visayas</SelectItem>
                    <SelectItem value="Region VII">Region VII - Central Visayas</SelectItem>
                    <SelectItem value="Region VIII">Region VIII - Eastern Visayas</SelectItem>
                    <SelectItem value="Region IX">Region IX - Zamboanga Peninsula</SelectItem>
                    <SelectItem value="Region X">Region X - Northern Mindanao</SelectItem>
                    <SelectItem value="Region XI">Region XI - Davao Region</SelectItem>
                    <SelectItem value="Region XII">Region XII - SOCCSKSARGEN</SelectItem>
                    <SelectItem value="Region XIII">Region XIII - Caraga</SelectItem>
                    <SelectItem value="BARMM">BARMM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Province */}
              <div>
                <Label className="text-sm font-medium text-foreground">Province</Label>
                <Select 
                  value={profileData.province} 
                  onValueChange={(value) => setProfileData({...profileData, province: value})}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Abra">Abra</SelectItem>
                    <SelectItem value="Apayao">Apayao</SelectItem>
                    <SelectItem value="Benguet">Benguet</SelectItem>
                    <SelectItem value="Ifugao">Ifugao</SelectItem>
                    <SelectItem value="Kalinga">Kalinga</SelectItem>
                    <SelectItem value="Mountain Province">Mountain Province</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div>
                <Label className="text-sm font-medium text-foreground">City/Municipality</Label>
                <Select 
                  value={profileData.city} 
                  onValueChange={(value) => setProfileData({...profileData, city: value})}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="Select city/municipality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baguio City">Baguio City</SelectItem>
                    <SelectItem value="Atok">Atok</SelectItem>
                    <SelectItem value="Bakun">Bakun</SelectItem>
                    <SelectItem value="Bokod">Bokod</SelectItem>
                    <SelectItem value="Buguias">Buguias</SelectItem>
                    <SelectItem value="Itogon">Itogon</SelectItem>
                    <SelectItem value="Kabayan">Kabayan</SelectItem>
                    <SelectItem value="Kapangan">Kapangan</SelectItem>
                    <SelectItem value="Kibungan">Kibungan</SelectItem>
                    <SelectItem value="La Trinidad">La Trinidad</SelectItem>
                    <SelectItem value="Mankayan">Mankayan</SelectItem>
                    <SelectItem value="Sablan">Sablan</SelectItem>
                    <SelectItem value="Tuba">Tuba</SelectItem>
                    <SelectItem value="Tublay">Tublay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Barangay */}
              <div>
                <Label className="text-sm font-medium text-foreground">Barangay</Label>
                <Input
                  value={profileData.barangay}
                  onChange={(e) => setProfileData({...profileData, barangay: e.target.value})}
                  className="mt-1 h-8"
                  placeholder="Enter barangay"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Library Reading Progress */}
      <>
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Library Reading Progress</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {readingProgressData.reduce((sum, month) => sum + month.books, 0)} Books Total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[200px] w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={readingProgressData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <XAxis 
                      dataKey="month" 
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      width={30}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="books"
                      stroke="var(--color-books)"
                      strokeWidth={2}
                      dot={{
                        fill: "var(--color-books)",
                        strokeWidth: 1,
                        r: 3,
                      }}
                      activeDot={{
                        r: 4,
                        stroke: "var(--color-books)",
                        strokeWidth: 1,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reading Consistency</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="font-medium">
                  {readingProgressData[readingProgressData.length - 1].books > readingProgressData[readingProgressData.length - 2].books ? 'Improving' : 'Stable'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Training Events Statistics */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                <span>Training Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="mb-4">
                  <p className="text-3xl font-bold text-primary">{eventsAttended}</p>
                  <p className="text-sm text-muted-foreground">Events Attended</p>
                </div>
                
                {/* Skill Level Badge */}
                <div className="mb-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${skillLevel.color}`}>
                    <Star className="h-4 w-4 mr-1" />
                    {skillLevel.level}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{skillLevel.description}</p>
                </div>

                {/* Progress to Next Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progress to Next Level</span>
                    <span className="font-medium">{nextLevelEvents - eventsAttended} events remaining</span>
                  </div>
                  <Progress 
                    value={skillLevel.progress} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Library Books */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Recent Library Books</span>
                </div>
                <Button variant="outline" size="sm" className="border-primary/20">
                  View Library
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentBooks.map((book, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{book.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>by {book.author}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">{book.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{book.dateRead}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </>

      {/* Quick Actions */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20 hover:shadow-soft transition-shadow cursor-pointer">
              <BookOpen className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium mb-1">E-Library</h3>
              <p className="text-sm text-muted-foreground">Browse agricultural resources and guides</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20 hover:shadow-soft transition-shadow cursor-pointer">
              <Award className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-medium mb-1">My Certificates</h3>
              <p className="text-sm text-muted-foreground">View earned certificates and achievements</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary-glow/10 to-primary/10 rounded-lg border border-primary-glow/20 hover:shadow-soft transition-shadow cursor-pointer">
              <TrendingUp className="h-8 w-8 text-primary-glow mb-3" />
              <h3 className="font-medium mb-1">Learning Path</h3>
              <p className="text-sm text-muted-foreground">Continue your agricultural education journey</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicDashboard;