import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ExpertFarmerManagement from '@/components/ExpertFarmerManagement';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  BookOpen,
  Activity,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Lightbulb,
  Star,
  MapPin,
  Award,
  Camera,
  Upload
} from 'lucide-react';
import { authService } from '@/services/authService';
import { User } from '@shared/types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sakap-language') || 'en';
  });
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    id: 'ATI-ADMIN-001',
    organization: 'Agricultural Training Institute',
    country: 'Philippines',
    region: 'NCR',
    province: 'Metro Manila',
    city: 'Quezon City',
    barangay: 'Barangay',
    email: 'admin@ati.gov.ph',
    phone: '+63 2 8928 8741',
    profilePicture: '',
    coverPicture: ''
  });

  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = () => {
      const userData = authService.getUserData();
      if (userData) {
        // Parse the user's full name
        const nameParts = userData.name?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Update profile data with actual user information
        setProfileData({
          firstName: firstName || 'Admin',
          lastName: lastName || 'User',
          id: userData.id || 'ATI-ADMIN-001',
          organization: userData.organization || 'Agricultural Training Institute',
          country: 'Philippines', // Default value
          region: 'NCR', // Default value
          province: userData.province || userData.location?.province || 'Metro Manila',
          city: userData.municipality || userData.location?.municipality || 'Quezon City',
          barangay: userData.barangay || userData.location?.barangay || 'Barangay',
          email: userData.email || 'admin@ati.gov.ph',
          phone: userData.phone || '+63 2 8928 8741',
          profilePicture: userData.profilePicture || '',
          coverPicture: userData.coverPhoto || ''
        });
      }
    };

    loadUserData();
  }, []);

  // Listen for language changes from localStorage
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLanguage = localStorage.getItem('sakap-language') || 'en';
      setLanguage(newLanguage);
    };

    // Listen for storage events (when localStorage changes in other tabs/components)
    window.addEventListener('storage', handleLanguageChange);
    
    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(handleLanguageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleLanguageChange);
      clearInterval(interval);
    };
  }, []);

  // Translation function
  const t = (key: string) => {
    const translations = {
      en: {
        'dashboard.title': 'ATI Admin Dashboard',
        'dashboard.subtitle': 'Manage the SAKAP platform and monitor agricultural activities',
        'dashboard.administrator': 'Administrator',
        'dashboard.overview': 'Overview',
        'dashboard.expertFarmers': 'Expert Farmers',
        'dashboard.editProfile': 'Edit Profile',
        'dashboard.eventCalendar': 'Event Calendar',
        'dashboard.dailyTip': 'Daily Admin Tip',
        'dashboard.tipOfTheDay': 'Tip of the Day',
        'dashboard.addEvent': 'Add Event',
        'dashboard.noEvents': 'No events',
        'dashboard.quickActions': 'Quick Actions',
        'dashboard.manageUsers': 'Manage Users',
        'dashboard.manageUsersDesc': 'Add, edit, or remove user accounts',
        'dashboard.createTraining': 'Create Training',
        'dashboard.createTrainingDesc': 'Schedule new agricultural training events',
        'dashboard.manageQA': 'Manage Q&A',
        'dashboard.manageQADesc': 'Update chatbot knowledge base',
        'dashboard.manageLibrary': 'Manage E-Library',
        'dashboard.manageLibraryDesc': 'Add and organize educational resources',
        'stats.activeAEWs': 'Active AEWs',
        'stats.monthlyUsers': 'Monthly Users',
        'stats.trainingsCreated': 'Trainings Created',
        'stats.totalUsers': 'Total Users',
        'profile.firstName': 'First Name',
        'profile.lastName': 'Last Name',
        'profile.id': 'ID',
        'profile.organization': 'Organization',
        'profile.location': 'Location',
        'profile.email': 'Email',
        'profile.phone': 'Phone',
        'profile.profilePicture': 'Profile Picture',
        'profile.coverPicture': 'Cover Picture',
        'profile.uploadPhoto': 'Upload Photo',
        'profile.country': 'Country',
        'profile.region': 'Region',
        'profile.province': 'Province',
        'profile.city': 'City',
        'profile.barangay': 'Barangay',
        'profile.idNotEditable': 'System assigned - cannot be edited',
        'common.active': 'Active',
        'common.save': 'Save Changes',
        'common.cancel': 'Cancel',
      },
      tl: {
        'dashboard.title': 'ATI Admin Dashboard',
        'dashboard.subtitle': 'Pamahalaan ang SAKAP platform at subaybayan ang mga agricultural activities',
        'dashboard.administrator': 'Administrator',
        'dashboard.overview': 'Overview',
        'dashboard.expertFarmers': 'Expert na mga Magsasaka',
        'dashboard.editProfile': 'I-edit ang Profile',
        'dashboard.eventCalendar': 'Kalendaryo ng mga Event',
        'dashboard.dailyTip': 'Araw-araw na Payo para sa Admin',
        'dashboard.tipOfTheDay': 'Payo ng Araw',
        'dashboard.addEvent': 'Magdagdag ng Event',
        'dashboard.noEvents': 'Walang mga event',
        'dashboard.quickActions': 'Mabibiling Aksyon',
        'dashboard.manageUsers': 'Pamahalaan ang mga User',
        'dashboard.manageUsersDesc': 'Magdagdag, i-edit, o tanggalin ang mga user accounts',
        'dashboard.createTraining': 'Gumawa ng Training',
        'dashboard.createTrainingDesc': 'Mag-iskedyul ng bagong agricultural training events',
        'dashboard.manageQA': 'Pamahalaan ang Q&A',
        'dashboard.manageQADesc': 'I-update ang chatbot knowledge base',
        'dashboard.manageLibrary': 'Pamahalaan ang E-Library',
        'dashboard.manageLibraryDesc': 'Magdagdag at ayusin ang mga edukasyonal na resources',
        'stats.activeAEWs': 'Aktibong mga AEW',
        'stats.monthlyUsers': 'Buwanang mga User',
        'stats.trainingsCreated': 'Mga Training na Ginawa',
        'stats.totalUsers': 'Kabuuang mga User',
        'profile.firstName': 'Unang Pangalan',
        'profile.lastName': 'Apelyido',
        'profile.id': 'ID',
        'profile.organization': 'Organisasyon',
        'profile.location': 'Lokasyon',
        'profile.email': 'Email',
        'profile.phone': 'Telepono',
        'profile.profilePicture': 'Larawan ng Profile',
        'profile.coverPicture': 'Cover Photo',
        'profile.uploadPhoto': 'Mag-upload ng Larawan',
        'profile.country': 'Bansa',
        'profile.region': 'Rehiyon',
        'profile.province': 'Probinsya',
        'profile.city': 'Lungsod',
        'profile.barangay': 'Barangay',
        'profile.idNotEditable': 'Itinalaga ng sistema - hindi maaaring baguhin',
        'common.active': 'Aktibo',
        'common.save': 'I-save ang mga Pagbabago',
        'common.cancel': 'Kanselahin',
      },
      ceb: {
        'dashboard.title': 'ATI Admin Dashboard',
        'dashboard.subtitle': 'Pagdumala sa SAKAP platform ug pagsubay sa mga agricultural activities',
        'dashboard.administrator': 'Administrator',
        'dashboard.overview': 'Overview',
        'dashboard.expertFarmers': 'Expert nga mga Mag-uuma',
        'dashboard.editProfile': 'I-edit ang Profile',
        'dashboard.eventCalendar': 'Kalendaryo sa mga Event',
        'dashboard.dailyTip': 'Adlaw-adlaw nga Tambag para sa Admin',
        'dashboard.tipOfTheDay': 'Tambag sa Adlaw',
        'dashboard.addEvent': 'Idugang og Event',
        'dashboard.noEvents': 'Walay mga event',
        'dashboard.quickActions': 'Daling mga Aksyon',
        'dashboard.manageUsers': 'Pagdumala sa mga User',
        'dashboard.manageUsersDesc': 'Idugang, i-edit, o tangtangon ang mga user accounts',
        'dashboard.createTraining': 'Paghimo og Training',
        'dashboard.createTrainingDesc': 'Pag-iskedyul og bag-ong agricultural training events',
        'dashboard.manageQA': 'Pagdumala sa Q&A',
        'dashboard.manageQADesc': 'I-update ang chatbot knowledge base',
        'dashboard.manageLibrary': 'Pagdumala sa E-Library',
        'dashboard.manageLibraryDesc': 'Idugang ug ayuson ang mga edukasyonal nga resources',
        'stats.activeAEWs': 'Aktibong mga AEW',
        'stats.monthlyUsers': 'Binulanong mga User',
        'stats.trainingsCreated': 'Mga Training nga Nahimo',
        'stats.totalUsers': 'Tibuok nga mga User',
        'profile.firstName': 'Una nga Ngalan',
        'profile.lastName': 'Apelyido',
        'profile.id': 'ID',
        'profile.organization': 'Organisasyon',
        'profile.location': 'Lokasyon',
        'profile.email': 'Email',
        'profile.phone': 'Telepono',
        'profile.profilePicture': 'Profile Picture',
        'profile.coverPicture': 'Cover Photo',
        'profile.uploadPhoto': 'Pag-upload og Hulagway',
        'profile.country': 'Nasud',
        'profile.region': 'Rehiyon',
        'profile.province': 'Probinsya',
        'profile.city': 'Dakbayan',
        'profile.barangay': 'Barangay',
        'profile.idNotEditable': 'Gi-assign sa sistema - dili mausab',
        'common.active': 'Aktibo',
        'common.save': 'I-save ang mga Kausaban',
        'common.cancel': 'Kanselahon',
      }
    };
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  // Sample events data
  const events = [
    { date: new Date(2024, 2, 15), title: 'Rice Production Seminar', type: 'training' },
    { date: new Date(2024, 2, 22), title: 'Climate-Smart Agriculture', type: 'workshop' },
    { date: new Date(2024, 3, 5), title: 'Organic Farming Workshop', type: 'training' },
    { date: new Date(2024, 2, 28), title: 'Monthly Review Meeting', type: 'meeting' },
    { date: new Date(2024, 3, 10), title: 'Farmer Training Assessment', type: 'assessment' }
  ];

  // Random daily tips for admin in multiple languages
  const getDailyTips = (lang: string) => {
    const tips = {
      en: [
        "Monitor farmer registration trends to identify peak training periods",
        "Review AEW performance metrics weekly for program optimization",
        "Update Q&A database based on most frequent farmer queries",
        "Schedule field visits during harvest season for impact assessment",
        "Coordinate with regional offices for resource distribution planning",
        "Analyze weather patterns to adjust training schedules accordingly",
        "Ensure digital platform accessibility across all rural areas",
        "Maintain updated contact lists for emergency agricultural alerts"
      ],
      tl: [
        "Subaybayan ang mga trend sa rehistrasyon ng mga magsasaka para makita ang peak training periods",
        "I-review ang AEW performance metrics bawat linggo para sa program optimization",
        "I-update ang Q&A database base sa mga pinaka-frequent na queries ng mga magsasaka",
        "Mag-iskedyul ng field visits sa harvest season para sa impact assessment",
        "Makipag-coordinate sa mga regional offices para sa resource distribution planning",
        "I-analyze ang weather patterns para ma-adjust ang training schedules nang naaayon",
        "Siguraduhin ang digital platform accessibility sa lahat ng rural areas",
        "Panatilihin ang updated na contact lists para sa emergency agricultural alerts"
      ],
      ceb: [
        "Bantayi ang mga trend sa rehistrasyon sa mga mag-uuma para makita ang peak training periods",
        "I-review ang AEW performance metrics matag semana para sa program optimization",
        "I-update ang Q&A database base sa mga pinaka-frequent nga queries sa mga mag-uuma",
        "Pag-iskedyul og field visits sa harvest season para sa impact assessment",
        "Makig-coordinate sa mga regional offices para sa resource distribution planning",
        "I-analyze ang weather patterns para ma-adjust ang training schedules nga angay",
        "Siguruha ang digital platform accessibility sa tanan nga rural areas",
        "Hupti ang updated nga contact lists para sa emergency agricultural alerts"
      ]
    };
    return tips[lang as keyof typeof tips] || tips.en;
  };

  // Get today's tip (simple rotation based on day)
  const getTodaysTip = () => {
    const today = new Date().getDate();
    const tips = getDailyTips(language);
    return tips[today % tips.length];
  };

  const handleSaveProfile = async () => {
    try {
      // In a real application, you would save to backend
      // For now, we'll update localStorage
      const userData = authService.getUserData();
      if (userData) {
        // Update the user data with the new profile information
        const updatedUserData = {
          ...userData,
          name: `${profileData.firstName} ${profileData.lastName}`,
          email: profileData.email,
          phone: profileData.phone,
          organization: profileData.organization,
          profilePicture: profileData.profilePicture,
          coverPhoto: profileData.coverPicture,
          location: {
            province: profileData.province,
            municipality: profileData.city,
            barangay: profileData.barangay
          }
        };
        
        // Update localStorage
        authService.updateUserData(updatedUserData);
      }
      
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
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
  
  const stats = [
    { title: t('stats.activeAEWs'), value: '247', change: '+12%', icon: Users, color: 'text-primary' },
    { title: t('stats.monthlyUsers'), value: '5,840', change: '+23%', icon: Activity, color: 'text-accent' },
    { title: t('stats.trainingsCreated'), value: '89', change: '+8%', icon: Calendar, color: 'text-primary-glow' },
    { title: t('stats.totalUsers'), value: '12,450', change: '+15%', icon: TrendingUp, color: 'text-accent' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          {t('dashboard.administrator')}
        </Badge>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">{t('dashboard.overview')}</TabsTrigger>
            <TabsTrigger value="experts" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>{t('dashboard.expertFarmers')}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Profile Card, Calendar, and Daily Tips */}
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
                      <AvatarImage src={profileData.profilePicture || "/placeholder-admin.jpg"} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-lg font-semibold">
                        {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Name and Badge */}
                  <div className="text-center mb-3">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{profileData.firstName} {profileData.lastName}</h3>
                    <div className="inline-block px-3 py-1 bg-primary/20 rounded-full">
                      <span className="text-xs font-medium text-primary">{t('dashboard.administrator')}</span>
                    </div>
                  </div>
                  
                  {/* User Details */}
                  <div className="text-center space-y-1 text-xs text-muted-foreground">
                    <p>ID: {profileData.id}</p>
                    <div className="flex items-center justify-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{profileData.barangay}, {profileData.city}, {profileData.province}</span>
                    </div>
                    <p>{profileData.organization}</p>
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
                    <span className="text-sm">{t('dashboard.eventCalendar')}</span>
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
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="h-5 flex items-center justify-center text-xs font-medium text-muted-foreground">
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
                      <p className="text-xs text-muted-foreground italic">{t('dashboard.noEvents')}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-1 h-6 text-xs border-primary/20 hover:bg-primary/5"
                  >
                    <Plus className="h-2 w-2 mr-1" />
                    {t('dashboard.addEvent')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Daily Tip Card */}
            <Card className="shadow-soft border-border/50 h-[280px] flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="text-sm">{t('dashboard.dailyTip')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                {/* Today's Tip */}
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-6">{t('dashboard.tipOfTheDay')}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed px-4">
                      {getTodaysTip()}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title} className="shadow-soft border-border/50 hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className={`text-sm ${stat.color} font-medium`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div 
                  className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20 hover:shadow-soft transition-shadow cursor-pointer"
                  onClick={() => navigate('/users')}
                >
                  <Users className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-medium mb-1">{t('dashboard.manageUsers')}</h3>
                  <p className="text-sm text-muted-foreground">{t('dashboard.manageUsersDesc')}</p>
                </div>
                <div 
                  className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20 hover:shadow-soft transition-shadow cursor-pointer"
                  onClick={() => navigate('/activities')}
                >
                  <Calendar className="h-8 w-8 text-accent mb-3" />
                  <h3 className="font-medium mb-1">{t('dashboard.createTraining')}</h3>
                  <p className="text-sm text-muted-foreground">{t('dashboard.createTrainingDesc')}</p>
                </div>
                <div 
                  className="p-4 bg-gradient-to-br from-primary-glow/10 to-primary/10 rounded-lg border border-primary-glow/20 hover:shadow-soft transition-shadow cursor-pointer"
                  onClick={() => navigate('/manage-library')}
                >
                  <BookOpen className="h-8 w-8 text-primary-glow mb-3" />
                  <h3 className="font-medium mb-1">{t('dashboard.manageLibrary')}</h3>
                  <p className="text-sm text-muted-foreground">{t('dashboard.manageLibraryDesc')}</p>
                </div>
                <div 
                  className="p-4 bg-gradient-to-br from-primary-glow/10 to-primary/10 rounded-lg border border-primary-glow/20 hover:shadow-soft transition-shadow cursor-pointer"
                  onClick={() => navigate('/chatbot-qa')}
                >
                  <BookOpen className="h-8 w-8 text-primary-glow mb-3" />
                  <h3 className="font-medium mb-1">{t('dashboard.manageQA')}</h3>
                  <p className="text-sm text-muted-foreground">{t('dashboard.manageQADesc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experts">
          <ExpertFarmerManagement />
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="bg-gradient-to-br from-primary/15 to-accent/25 border-primary/40 max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t('dashboard.editProfile')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Left Column - Personal Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Personal Information</h3>
              
              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">{t('profile.profilePicture')}</Label>
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
                      <span>{t('profile.uploadPhoto')}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cover Picture Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">{t('profile.coverPicture')}</Label>
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
                      <span>{t('profile.uploadPhoto')}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">{t('profile.firstName')}</Label>
                  <Input
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">{t('profile.lastName')}</Label>
                  <Input
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className="mt-1 h-8"
                  />
                </div>
              </div>

              {/* ID - Non-editable */}
              <div>
                <Label className="text-sm font-medium text-foreground">{t('profile.id')}</Label>
                <Input
                  value={profileData.id}
                  disabled
                  className="mt-1 h-8 bg-muted/50 text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1 italic">{t('profile.idNotEditable')}</p>
              </div>

              {/* Organization */}
              <div>
                <Label className="text-sm font-medium text-foreground">{t('profile.organization')}</Label>
                <Input
                  value={profileData.organization}
                  onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                  className="mt-1 h-8"
                />
              </div>

              {/* Contact Information */}
              <div>
                <Label className="text-sm font-medium text-foreground">{t('profile.email')}</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="mt-1 h-8"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">{t('profile.phone')}</Label>
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
                <Label className="text-sm font-medium text-foreground">{t('profile.country')}</Label>
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
                <Label className="text-sm font-medium text-foreground">{t('profile.region')}</Label>
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
                <Label className="text-sm font-medium text-foreground">{t('profile.province')}</Label>
                <Select 
                  value={profileData.province} 
                  onValueChange={(value) => setProfileData({...profileData, province: value})}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Metro Manila">Metro Manila</SelectItem>
                    <SelectItem value="Laguna">Laguna</SelectItem>
                    <SelectItem value="Cavite">Cavite</SelectItem>
                    <SelectItem value="Rizal">Rizal</SelectItem>
                    <SelectItem value="Batangas">Batangas</SelectItem>
                    <SelectItem value="Quezon">Quezon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div>
                <Label className="text-sm font-medium text-foreground">{t('profile.city')}</Label>
                <Select 
                  value={profileData.city} 
                  onValueChange={(value) => setProfileData({...profileData, city: value})}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quezon City">Quezon City</SelectItem>
                    <SelectItem value="Manila">Manila</SelectItem>
                    <SelectItem value="Makati">Makati</SelectItem>
                    <SelectItem value="Pasig">Pasig</SelectItem>
                    <SelectItem value="Taguig">Taguig</SelectItem>
                    <SelectItem value="Marikina">Marikina</SelectItem>
                    <SelectItem value="Mandaluyong">Mandaluyong</SelectItem>
                    <SelectItem value="San Juan">San Juan</SelectItem>
                    <SelectItem value="Caloocan">Caloocan</SelectItem>
                    <SelectItem value="Malabon">Malabon</SelectItem>
                    <SelectItem value="Navotas">Navotas</SelectItem>
                    <SelectItem value="Valenzuela">Valenzuela</SelectItem>
                    <SelectItem value="Las Piñas">Las Piñas</SelectItem>
                    <SelectItem value="Muntinlupa">Muntinlupa</SelectItem>
                    <SelectItem value="Parañaque">Parañaque</SelectItem>
                    <SelectItem value="Pasay">Pasay</SelectItem>
                    <SelectItem value="Pateros">Pateros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Barangay */}
              <div>
                <Label className="text-sm font-medium text-foreground">{t('profile.barangay')}</Label>
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
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;