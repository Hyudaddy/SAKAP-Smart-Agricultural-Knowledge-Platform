import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  MapPin, 
  Users, 
  BookOpen,
  Bell,
  TrendingUp,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Lightbulb,
  Star,
  Camera,
  Upload,
  Clock,
  UserPlus,
  Check,
  X,
  Search,
  Filter
} from 'lucide-react';

const AEWDashboard = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEventRegistrationOpen, setIsEventRegistrationOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [aewRegisteredEvents, setAewRegisteredEvents] = useState(new Set([1, 2])); // Mock registered events
  const [searchFarmers, setSearchFarmers] = useState('');
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sakap-language') || 'en';
  });
  const [profileData, setProfileData] = useState({
    firstName: 'Maria',
    lastName: 'Santos',
    id: 'AEW-001-NCR',
    country: 'Philippines',
    region: 'NCR',
    province: 'Metro Manila',
    city: 'Quezon City',
    barangay: 'Diliman',
    certification: 'Level 2 Certified',
    email: 'maria.santos@da.gov.ph',
    phone: '+63 917 123 4567',
    specialization: 'Rice & Vegetable Production',
    profilePicture: '',
    coverPicture: ''
  });

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
        'dashboard.title': 'AEW Dashboard',
        'dashboard.subtitle': 'Agricultural Extension Worker Portal',
        'dashboard.extensionWorker': 'Extension Worker',
        'dashboard.editProfile': 'Edit Profile',
        'dashboard.eventCalendar': 'Event Calendar',
        'dashboard.dailyTip': 'Daily Extension Tip',
        'dashboard.tipOfTheDay': 'Tip of the Day',
        'dashboard.addEvent': 'Add Event',
        'dashboard.noEvents': 'No events',
        'dashboard.quickActions': 'Quick Actions',
        'dashboard.registerFarmers': 'Register Farmers',
        'dashboard.registerFarmersDesc': 'Add farmers to training events',
        'dashboard.elibrary': 'E-Library',
        'dashboard.elibraryDesc': 'Access agricultural resources',
        'dashboard.mySchedule': 'My Schedule',
        'dashboard.myScheduleDesc': 'View training calendar',
        'dashboard.notifications': 'Notifications',
        'dashboard.notificationsDesc': 'Check latest updates',
        'dashboard.upcomingTrainings': 'Upcoming Trainings',
        'dashboard.recentUpdates': 'Recent Updates',
        'dashboard.viewAll': 'View All',
        'dashboard.viewAllUpdates': 'View All Updates',
        'dashboard.registerFarmersAction': 'Register Farmers',
        'dashboard.availableEvents': 'Available Training Events',
        'dashboard.eventRegistration': 'Event Registration',
        'dashboard.registerForEvent': 'Register for Event',
        'dashboard.registerFarmersForEvent': 'Register Farmers for Event',
        'dashboard.searchFarmers': 'Search farmers in your area...',
        'dashboard.selectedFarmers': 'Selected Farmers',
        'dashboard.registerSelected': 'Register Selected Farmers',
        'dashboard.aewMustRegisterFirst': 'You must register first before adding farmers',
        'dashboard.noFarmersFound': 'No farmers found in your location',
        'dashboard.farmersInLocation': 'Farmers in your location',
        'dashboard.eventDetails': 'Event Details',
        'dashboard.registrationDeadline': 'Registration Deadline',
        'dashboard.maxParticipants': 'Max Participants',
        'dashboard.currentRegistrations': 'Current Registrations',
        'stats.trainingsAttended': 'Trainings Attended',
        'stats.farmersRegistered': 'Farmers Registered',
        'stats.completionRate': 'Completion Rate',
        'profile.firstName': 'First Name',
        'profile.lastName': 'Last Name',
        'profile.id': 'ID',
        'profile.location': 'Location',
        'profile.certification': 'Certification',
        'profile.email': 'Email',
        'profile.phone': 'Phone',
        'profile.specialization': 'Specialization',
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
        'dashboard.title': 'AEW Dashboard',
        'dashboard.subtitle': 'Agricultural Extension Worker Portal',
        'dashboard.extensionWorker': 'Extension Worker',
        'dashboard.editProfile': 'I-edit ang Profile',
        'dashboard.eventCalendar': 'Kalendaryo ng mga Event',
        'dashboard.dailyTip': 'Araw-araw na Payo para sa Extension',
        'dashboard.tipOfTheDay': 'Payo ng Araw',
        'dashboard.addEvent': 'Magdagdag ng Event',
        'dashboard.noEvents': 'Walang mga event',
        'dashboard.quickActions': 'Mabibiling Aksyon',
        'dashboard.registerFarmers': 'Mag-rehistro ng mga Magsasaka',
        'dashboard.registerFarmersDesc': 'Idagdag ang mga magsasaka sa training events',
        'dashboard.elibrary': 'E-Library',
        'dashboard.elibraryDesc': 'Mag-access ng mga agricultural resources',
        'dashboard.mySchedule': 'Aking Schedule',
        'dashboard.myScheduleDesc': 'Tingnan ang training calendar',
        'dashboard.notifications': 'Mga Notification',
        'dashboard.notificationsDesc': 'Suriin ang pinakabagong updates',
        'dashboard.upcomingTrainings': 'Paparating na mga Pagsasanay',
        'dashboard.recentUpdates': 'Kamakailang mga Update',
        'dashboard.viewAll': 'Tingnan Lahat',
        'dashboard.viewAllUpdates': 'Tingnan ang Lahat ng Updates',
        'dashboard.registerFarmersAction': 'Mag-rehistro ng mga Magsasaka',
        'dashboard.availableEvents': 'Mga Available na Training Events',
        'dashboard.eventRegistration': 'Event Registration',
        'dashboard.registerForEvent': 'Mag-rehistro sa Event',
        'dashboard.registerFarmersForEvent': 'Mag-rehistro ng mga Magsasaka sa Event',
        'dashboard.searchFarmers': 'Maghanap ng mga magsasaka sa inyong lugar...',
        'dashboard.selectedFarmers': 'Mga Napiling Magsasaka',
        'dashboard.registerSelected': 'I-rehistro ang mga Napiling Magsasaka',
        'dashboard.aewMustRegisterFirst': 'Dapat kayo muna ang mag-rehistro bago magdagdag ng mga magsasaka',
        'dashboard.noFarmersFound': 'Walang nahanap na mga magsasaka sa inyong lokasyon',
        'dashboard.farmersInLocation': 'Mga magsasaka sa inyong lokasyon',
        'dashboard.eventDetails': 'Mga Detalye ng Event',
        'dashboard.registrationDeadline': 'Deadline ng Registration',
        'dashboard.maxParticipants': 'Maximum na Participants',
        'dashboard.currentRegistrations': 'Kasalukuyang mga Registration',
        'stats.trainingsAttended': 'Mga Pagsasanay na Dinaluhan',
        'stats.farmersRegistered': 'Mga Magsasakang Narehistro',
        'stats.completionRate': 'Completion Rate',
        'profile.firstName': 'Unang Pangalan',
        'profile.lastName': 'Apelyido',
        'profile.id': 'ID',
        'profile.location': 'Lokasyon',
        'profile.certification': 'Sertipikasyon',
        'profile.email': 'Email',
        'profile.phone': 'Telepono',
        'profile.specialization': 'Specialization',
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
        'dashboard.title': 'AEW Dashboard',
        'dashboard.subtitle': 'Agricultural Extension Worker Portal',
        'dashboard.extensionWorker': 'Extension Worker',
        'dashboard.editProfile': 'I-edit ang Profile',
        'dashboard.eventCalendar': 'Kalendaryo sa mga Event',
        'dashboard.dailyTip': 'Adlaw-adlaw nga Tambag para sa Extension',
        'dashboard.tipOfTheDay': 'Tambag sa Adlaw',
        'dashboard.addEvent': 'Idugang og Event',
        'dashboard.noEvents': 'Walay mga event',
        'dashboard.quickActions': 'Daling mga Aksyon',
        'dashboard.registerFarmers': 'Magparehistro og mga Mag-uuma',
        'dashboard.registerFarmersDesc': 'Idugang ang mga mag-uuma sa training events',
        'dashboard.elibrary': 'E-Library',
        'dashboard.elibraryDesc': 'Pag-access sa mga agricultural resources',
        'dashboard.mySchedule': 'Akong Schedule',
        'dashboard.myScheduleDesc': 'Tan-awa ang training calendar',
        'dashboard.notifications': 'Mga Notification',
        'dashboard.notificationsDesc': 'Susiha ang pinakabag-o nga updates',
        'dashboard.upcomingTrainings': 'Umaabot nga mga Paghanas',
        'dashboard.recentUpdates': 'Bag-ong mga Update',
        'dashboard.viewAll': 'Tan-awa ang Tanan',
        'dashboard.viewAllUpdates': 'Tan-awa ang Tanan nga Updates',
        'dashboard.registerFarmersAction': 'Magparehistro og mga Mag-uuma',
        'dashboard.availableEvents': 'Mga Available nga Training Events',
        'dashboard.eventRegistration': 'Event Registration',
        'dashboard.registerForEvent': 'Magparehistro sa Event',
        'dashboard.registerFarmersForEvent': 'Magparehistro og mga Mag-uuma sa Event',
        'dashboard.searchFarmers': 'Pangita og mga mag-uuma sa inyong lugar...',
        'dashboard.selectedFarmers': 'Mga Napiling Mag-uuma',
        'dashboard.registerSelected': 'I-rehistro ang mga Napiling Mag-uuma',
        'dashboard.aewMustRegisterFirst': 'Kinahanglan mo una ang magparehistro sa dili pa magdugang og mga mag-uuma',
        'dashboard.noFarmersFound': 'Walay nakit-an nga mga mag-uuma sa inyong lokasyon',
        'dashboard.farmersInLocation': 'Mga mag-uuma sa inyong lokasyon',
        'dashboard.eventDetails': 'Mga Detalye sa Event',
        'dashboard.registrationDeadline': 'Deadline sa Registration',
        'dashboard.maxParticipants': 'Maximum nga Participants',
        'dashboard.currentRegistrations': 'Karon nga mga Registration',
        'stats.trainingsAttended': 'Mga Paghanas nga Gitambungan',
        'stats.farmersRegistered': 'Mga Mag-uumang Narehistro',
        'stats.completionRate': 'Completion Rate',
        'profile.firstName': 'Una nga Ngalan',
        'profile.lastName': 'Apelyido',
        'profile.id': 'ID',
        'profile.location': 'Lokasyon',
        'profile.certification': 'Sertipikasyon',
        'profile.email': 'Email',
        'profile.phone': 'Telepono',
        'profile.specialization': 'Specialization',
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
    { date: new Date(2024, 2, 18), title: 'Farmer Training Session', type: 'training' },
    { date: new Date(2024, 2, 25), title: 'Field Visit - Rice Farm', type: 'fieldwork' },
    { date: new Date(2024, 3, 2), title: 'Regional Meeting', type: 'meeting' },
    { date: new Date(2024, 3, 8), title: 'Crop Assessment', type: 'assessment' }
  ];

  // Admin-created events that AEWs can register for
  const adminEvents = [
    {
      id: 1,
      title: 'Sustainable Rice Farming Workshop',
      description: 'Learn modern techniques for sustainable rice production, including water management and pest control.',
      type: 'Workshop',
      startDate: '2024-03-15',
      endDate: '2024-03-17',
      registrationEnd: '2024-03-10',
      location: 'Loreto Agricultural Center',
      province: 'Agusan del Sur',
      municipality: 'Loreto',
      maxParticipants: 50,
      aewsRegistered: 8,
      publicRegistered: 27,
      registeredCount: 35,
      status: 'registration-open',
      instructor: 'Dr. Maria Santos',
      requiresAEWFirst: true
    },
    {
      id: 2,
      title: 'Organic Farming Seminar',
      description: 'Introduction to organic farming methods, certification process, and market opportunities.',
      type: 'Seminar',
      startDate: '2024-03-22',
      endDate: '2024-03-22',
      registrationEnd: '2024-03-18',
      location: 'Prosperidad Training Hall',
      province: 'Agusan del Sur',
      municipality: 'Prosperidad',
      maxParticipants: 100,
      aewsRegistered: 15,
      publicRegistered: 63,
      registeredCount: 78,
      status: 'registration-open',
      instructor: 'Prof. Juan Cruz',
      requiresAEWFirst: true
    },
    {
      id: 3,
      title: 'Climate-Smart Agriculture Training',
      description: 'Training on climate adaptation strategies and resilient farming practices.',
      type: 'Training',
      startDate: '2024-04-05',
      endDate: '2024-04-07',
      registrationEnd: '2024-04-01',
      location: 'Bunawan Municipal Hall',
      province: 'Agusan del Sur',
      municipality: 'Bunawan',
      maxParticipants: 75,
      aewsRegistered: 5,
      publicRegistered: 12,
      registeredCount: 17,
      status: 'registration-open',
      instructor: 'Dr. Ana Villanueva',
      requiresAEWFirst: true
    }
  ];

  // Location-based farmers (filtered by AEW's location)
  const getLocationBasedFarmers = (aewLocation) => {
    // Mock farmers data - in real app this would come from an API
    const allFarmers = [
      {
        id: 'USR-001',
        name: 'Juan Miguel Dela Cruz',
        email: 'juan.delacruz@email.com',
        municipality: 'Loreto',
        province: 'Agusan del Sur',
        barangay: 'Poblacion',
        farmType: 'Rice Farm',
        status: 'active',
        trainingsAttended: 15
      },
      {
        id: 'USR-002',
        name: 'Pedro Emmanuel Garcia',
        email: 'pedro.garcia@email.com',
        municipality: 'Loreto',
        province: 'Agusan del Sur',
        barangay: 'San Roque',
        farmType: 'Vegetable Farm',
        status: 'active',
        trainingsAttended: 22
      },
      {
        id: 'USR-003',
        name: 'Carmen Luz Torres',
        email: 'carmen.torres@email.com',
        municipality: 'Loreto',
        province: 'Agusan del Sur',
        barangay: 'Upper Taguibo',
        farmType: 'Mixed Farm',
        status: 'active',
        trainingsAttended: 8
      },
      {
        id: 'USR-004',
        name: 'Roberto Santos Mendoza',
        email: 'roberto.mendoza@email.com',
        municipality: 'Loreto',
        province: 'Agusan del Sur',
        barangay: 'Lower Taguibo',
        farmType: 'Livestock Farm',
        status: 'active',
        trainingsAttended: 31
      },
      {
        id: 'USR-005',
        name: 'Elena Grace Morales',
        email: 'elena.morales@email.com',
        municipality: 'Prosperidad',
        province: 'Agusan del Sur',
        barangay: 'Centro',
        farmType: 'Organic Farm',
        status: 'active',
        trainingsAttended: 18
      }
    ];

    // Filter farmers based on AEW's location (municipality)
    return allFarmers.filter(farmer => 
      farmer.municipality === aewLocation.city && 
      farmer.province === aewLocation.province
    );
  };

  // Get farmers for current AEW's location
  const availableFarmers = getLocationBasedFarmers(profileData);

  // Random daily tips for AEW in multiple languages
  const getDailyTips = (lang: string) => {
    const tips = {
      en: [
        "Use visual aids and demonstrations during farmer training sessions",
        "Schedule field visits during cool morning or late afternoon hours",
        "Document farmer feedback and crop performance for program improvement",
        "Use local dialect when explaining technical concepts to farmers",
        "Coordinate with local leaders to increase farmer participation",
        "Prepare backup activities for weather-dependent outdoor training",
        "Follow up with farmers after training to assess knowledge retention",
        "Share success stories to motivate other farmers in the community"
      ],
      tl: [
        "Gumamit ng mga visual aids at demonstrations sa farmer training sessions",
        "Mag-iskedyul ng field visits sa malamig na umaga o hapon",
        "I-document ang feedback ng mga magsasaka at crop performance para sa program improvement",
        "Gamitin ang lokal na wika kapag nagpapaliwanag ng technical concepts sa mga magsasaka",
        "Makipag-coordinate sa mga local leaders para madagdagan ang participation ng mga magsasaka",
        "Maghanda ng backup activities para sa weather-dependent outdoor training",
        "Mag-follow up sa mga magsasaka pagkatapos ng training para ma-assess ang knowledge retention",
        "Magbahagi ng mga success stories para ma-motivate ang ibang magsasaka sa komunidad"
      ],
      ceb: [
        "Gamita ang mga visual aids ug demonstrations sa farmer training sessions",
        "Mag-iskedyul og field visits sa bugnaw nga buntag o hapon",
        "I-document ang feedback sa mga mag-uuma ug crop performance para sa program improvement",
        "Gamita ang lokal nga pinulongan kung magpasabot og technical concepts sa mga mag-uuma",
        "Makig-coordinate sa mga local leaders para madugangan ang participation sa mga mag-uuma",
        "Pag-andam og backup activities para sa weather-dependent outdoor training",
        "Mag-follow up sa mga mag-uuma human sa training para ma-assess ang knowledge retention",
        "Ipaambit ang mga success stories para ma-motivate ang ubang mag-uuma sa komunidad"
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

  // Event registration handlers
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventRegistrationOpen(true);
    setSelectedFarmers([]);
    setSearchFarmers('');
  };

  const handleAEWRegistration = (eventId) => {
    setAewRegisteredEvents(new Set([...aewRegisteredEvents, eventId]));
    // In a real app, this would make an API call
    console.log(`AEW registered for event ${eventId}`);
  };

  const handleFarmerSelection = (farmer) => {
    const isSelected = selectedFarmers.find(f => f.id === farmer.id);
    if (isSelected) {
      setSelectedFarmers(selectedFarmers.filter(f => f.id !== farmer.id));
    } else {
      setSelectedFarmers([...selectedFarmers, farmer]);
    }
  };

  const handleRegisterFarmers = () => {
    if (selectedEvent && selectedFarmers.length > 0) {
      // In a real app, this would make an API call to register farmers
      console.log(`Registering ${selectedFarmers.length} farmers for event ${selectedEvent.id}:`, selectedFarmers);
      setIsEventRegistrationOpen(false);
      setSelectedFarmers([]);
      // Show success message
      alert(`Successfully registered ${selectedFarmers.length} farmer(s) for ${selectedEvent.title}`);
    }
  };

  const filteredFarmers = availableFarmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchFarmers.toLowerCase()) ||
    farmer.barangay.toLowerCase().includes(searchFarmers.toLowerCase())
  );

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
              ? 'bg-accent text-accent-foreground'
              : hasEvent
              ? 'bg-primary/20 text-primary font-medium hover:bg-primary/30'
              : 'hover:bg-secondary'
          }`}
        >
          {day}
          {hasEvent && <div className="absolute w-0.5 h-0.5 bg-accent rounded-full bottom-0 right-0.5"></div>}
        </div>
      );
    }

    return days;
  };
  const upcomingEvents = [
    { title: 'Rice Production Seminar', date: 'March 15, 2024', registered: 45, status: 'Active' },
    { title: 'Organic Farming Workshop', date: 'March 22, 2024', registered: 23, status: 'Registration Open' },
    { title: 'Pest Management Training', date: 'April 5, 2024', registered: 12, status: 'Registration Open' },
  ];

  const trainingStats = [
    { title: t('stats.trainingsAttended'), count: 12, icon: BookOpen },
    { title: t('stats.farmersRegistered'), count: 89, icon: Users },
    { title: t('stats.completionRate'), count: '94%', icon: TrendingUp },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
          {t('dashboard.extensionWorker')}
        </Badge>
      </div>

      {/* Profile Card, Calendar, and Farming Tips */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="shadow-soft border-border/50 bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 h-[280px]">
          <CardContent className="p-0">
            {/* Cover Photo */}
            <div className="h-12 bg-gradient-to-r from-accent/30 to-primary/30 rounded-t-lg relative">
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
                  <AvatarImage src={profileData.profilePicture || "/placeholder-aew.jpg"} />
                  <AvatarFallback className="bg-gradient-to-br from-accent/20 to-primary/20 text-accent text-lg font-semibold">
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Name and Badge */}
              <div className="text-center mb-3">
                <h3 className="text-lg font-semibold text-foreground mb-2">{profileData.firstName} {profileData.lastName}</h3>
                <div className="inline-block px-3 py-1 bg-accent/20 rounded-full">
                  <span className="text-xs font-medium text-accent">{profileData.certification}</span>
                </div>
              </div>
              
              {/* User Details */}
              <div className="text-center space-y-1 text-xs text-muted-foreground">
                <p>ID: {profileData.id}</p>
                <div className="flex items-center justify-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{profileData.barangay}, {profileData.city}</span>
                </div>
                <p>{profileData.specialization}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Widget */}
        <Card className="shadow-soft border-border/50 h-[280px] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-accent" />
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
                  <p className="text-xs text-muted-foreground italic">{t('dashboard.noEvents')}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-1 h-6 text-xs border-accent/20 hover:bg-accent/5"
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
              <Lightbulb className="h-4 w-4 text-accent" />
              <span className="text-sm">{t('dashboard.dailyTip')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {/* Today's Tip */}
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-accent mb-6">{t('dashboard.tipOfTheDay')}</h3>
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

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="bg-gradient-to-br from-primary/15 to-accent/25 border-accent/40 max-w-4xl w-full">
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
                    <AvatarFallback className="bg-gradient-to-br from-accent/20 to-primary/20 text-accent text-lg font-semibold">
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
                  <div className="h-12 bg-gradient-to-r from-accent/30 to-primary/30 rounded-lg relative overflow-hidden">
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

              {/* Certification */}
              <div>
                <Label className="text-sm font-medium text-foreground">{t('profile.certification')}</Label>
                <Select 
                  value={profileData.certification} 
                  onValueChange={(value) => setProfileData({...profileData, certification: value})}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="Select certification level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Level 1 Certified">Level 1 Certified</SelectItem>
                    <SelectItem value="Level 2 Certified">Level 2 Certified</SelectItem>
                    <SelectItem value="Level 3 Certified">Level 3 Certified</SelectItem>
                    <SelectItem value="Senior AEW">Senior AEW</SelectItem>
                    <SelectItem value="Master Trainer">Master Trainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specialization */}
              <div>
                <Label className="text-sm font-medium text-foreground">{t('profile.specialization')}</Label>
                <Select 
                  value={profileData.specialization} 
                  onValueChange={(value) => setProfileData({...profileData, specialization: value})}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rice & Vegetable Production">Rice & Vegetable Production</SelectItem>
                    <SelectItem value="Livestock Management">Livestock Management</SelectItem>
                    <SelectItem value="Crop Protection">Crop Protection</SelectItem>
                    <SelectItem value="Organic Farming">Organic Farming</SelectItem>
                    <SelectItem value="Climate-Smart Agriculture">Climate-Smart Agriculture</SelectItem>
                    <SelectItem value="Farm Mechanization">Farm Mechanization</SelectItem>
                  </SelectContent>
                </Select>
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
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90">
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Available Training Events */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-accent" />
            <span>{t('dashboard.availableEvents')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminEvents.map((event) => {
              const isAEWRegistered = aewRegisteredEvents.has(event.id);
              const canRegisterFarmers = isAEWRegistered;
              
              return (
                <Card 
                  key={event.id} 
                  className={`hover:shadow-lg transition-shadow cursor-pointer border-2 ${
                    isAEWRegistered ? 'border-accent/30 bg-accent/5' : 'border-border hover:border-primary/30'
                  }`}
                  onClick={() => handleEventClick(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={event.status === 'registration-open' ? 'default' : 'secondary'}>
                        {event.type}
                      </Badge>
                      {isAEWRegistered && (
                        <div className="flex items-center text-accent text-sm">
                          <Check className="h-4 w-4 mr-1" />
                          <span>Registered</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{event.registeredCount}/{event.maxParticipants} registered</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Deadline: {new Date(event.registrationEnd).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>AEWs: {event.aewsRegistered}</span>
                        <span>Public: {event.publicRegistered}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Registration Dialog */}
      <Dialog open={isEventRegistrationOpen} onOpenChange={setIsEventRegistrationOpen}>
        <DialogContent className="bg-gradient-to-br from-primary/15 to-accent/25 border-accent/40 max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedEvent ? `${t('dashboard.eventRegistration')} - ${selectedEvent.title}` : t('dashboard.eventRegistration')}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              {/* Event Details */}
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">{t('dashboard.eventDetails')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Date:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {selectedEvent.location}</p>
                    <p><strong>Instructor:</strong> {selectedEvent.instructor}</p>
                  </div>
                  <div>
                    <p><strong>{t('dashboard.registrationDeadline')}:</strong> {new Date(selectedEvent.registrationEnd).toLocaleDateString()}</p>
                    <p><strong>{t('dashboard.maxParticipants')}:</strong> {selectedEvent.maxParticipants}</p>
                    <p><strong>{t('dashboard.currentRegistrations')}:</strong> {selectedEvent.registeredCount}</p>
                  </div>
                </div>
              </div>
              
              {/* AEW Registration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">1. {t('dashboard.registerForEvent')}</h3>
                  {aewRegisteredEvents.has(selectedEvent.id) ? (
                    <div className="flex items-center text-accent">
                      <Check className="h-5 w-5 mr-2" />
                      <span>You are registered</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleAEWRegistration(selectedEvent.id)}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      Register as AEW
                    </Button>
                  )}
                </div>
                
                {!aewRegisteredEvents.has(selectedEvent.id) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      {t('dashboard.aewMustRegisterFirst')}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Farmer Registration */}
              {aewRegisteredEvents.has(selectedEvent.id) && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">2. {t('dashboard.registerFarmersForEvent')}</h3>
                  
                  {/* Search Farmers */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('dashboard.searchFarmers')}
                      value={searchFarmers}
                      onChange={(e) => setSearchFarmers(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Available Farmers */}
                  <div className="border rounded-lg">
                    <div className="p-3 border-b bg-muted/50">
                      <h4 className="font-medium">{t('dashboard.farmersInLocation')} ({availableFarmers.length})</h4>
                      <p className="text-sm text-muted-foreground">
                        Showing farmers from {profileData.city}, {profileData.province}
                      </p>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {filteredFarmers.length > 0 ? (
                        filteredFarmers.map((farmer) => {
                          const isSelected = selectedFarmers.find(f => f.id === farmer.id);
                          
                          return (
                            <div 
                              key={farmer.id}
                              className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors ${
                                isSelected ? 'bg-accent/10 border-accent/30' : ''
                              }`}
                              onClick={() => handleFarmerSelection(farmer)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                      isSelected ? 'bg-accent border-accent text-white' : 'border-muted-foreground'
                                    }`}>
                                      {isSelected && <Check className="h-3 w-3" />}
                                    </div>
                                    <div>
                                      <p className="font-medium">{farmer.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {farmer.barangay}, {farmer.municipality} • {farmer.farmType}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {farmer.trainingsAttended} trainings
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          {searchFarmers ? (
                            <p>No farmers found matching "{searchFarmers}"</p>
                          ) : (
                            <p>{t('dashboard.noFarmersFound')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Selected Farmers Summary */}
                  {selectedFarmers.length > 0 && (
                    <div className="bg-accent/10 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">{t('dashboard.selectedFarmers')} ({selectedFarmers.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedFarmers.map((farmer) => (
                          <div key={farmer.id} className="inline-flex items-center bg-white rounded-full px-3 py-1 text-sm border">
                            <span>{farmer.name}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFarmerSelection(farmer);
                              }}
                              className="ml-2 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setIsEventRegistrationOpen(false)}>
              {t('common.cancel')}
            </Button>
            {selectedEvent && aewRegisteredEvents.has(selectedEvent.id) && selectedFarmers.length > 0 && (
              <Button 
                onClick={handleRegisterFarmers}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t('dashboard.registerSelected')} ({selectedFarmers.length})
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainingStats.map((stat) => (
            <Card key={stat.title} className="shadow-soft border-border/50 hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.count}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar Widget */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>{t('dashboard.upcomingTrainings')}</span>
                </div>
                <Button variant="outline" size="sm" className="border-primary/20">
                  {t('dashboard.viewAll')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                    <p className="text-xs text-muted-foreground">{event.registered} farmers registered</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={event.status === 'Active' ? 'default' : 'outline'} className="mb-2">
                      {event.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="block border-accent/20 hover:bg-accent/5">
                      {t('dashboard.registerFarmersAction')}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent News & Updates */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-accent" />
                <span>{t('dashboard.recentUpdates')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-primary pl-4 py-2">
                <p className="font-medium text-sm">New Rice Production Guidelines Released</p>
                <p className="text-xs text-muted-foreground">Updated protocols for sustainable rice farming - March 10, 2024</p>
              </div>
              <div className="border-l-4 border-accent pl-4 py-2">
                <p className="font-medium text-sm">Climate-Smart Agriculture Policy Update</p>
                <p className="text-xs text-muted-foreground">New incentives for climate-resilient farming practices - March 8, 2024</p>
              </div>
              <div className="border-l-4 border-primary-glow pl-4 py-2">
                <p className="font-medium text-sm">Digital Agricultural Tools Training</p>
                <p className="text-xs text-muted-foreground">Mandatory training for all AEWs on digital platforms - March 5, 2024</p>
              </div>
              <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                {t('dashboard.viewAllUpdates')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </>

      {/* Quick Actions */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle>{t('dashboard.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20 hover:shadow-soft transition-shadow cursor-pointer">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium mb-1">{t('dashboard.registerFarmers')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.registerFarmersDesc')}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20 hover:shadow-soft transition-shadow cursor-pointer">
              <BookOpen className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-medium mb-1">{t('dashboard.elibrary')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.elibraryDesc')}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary-glow/10 to-primary/10 rounded-lg border border-primary-glow/20 hover:shadow-soft transition-shadow cursor-pointer">
              <Calendar className="h-8 w-8 text-primary-glow mb-3" />
              <h3 className="font-medium mb-1">{t('dashboard.mySchedule')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.myScheduleDesc')}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-accent/10 to-primary-glow/10 rounded-lg border border-accent/20 hover:shadow-soft transition-shadow cursor-pointer">
              <Bell className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-medium mb-1">{t('dashboard.notifications')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.notificationsDesc')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AEWDashboard;