import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  MessageCircle, 
  HelpCircle, 
  Calendar,
  Newspaper,
  Users,
  LogOut,
  Menu,
  X,
  Leaf,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface NavigationProps {
  userRole: 'admin' | 'aew' | 'public' | null;
}

const Navigation = ({ userRole }: NavigationProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sakap-language') || 'en';
  });
  const location = useLocation();
  const navigate = useNavigate();

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    tl: { name: 'Tagalog', flag: '🇵🇭' },
    ceb: { name: 'Bisaya', flag: '🇵🇭' }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('sakap-language', newLanguage);
    // Trigger a storage event for components in the same tab to detect the change
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'sakap-language',
      newValue: newLanguage,
      storageArea: localStorage
    }));
  };

  // Translation function
  const t = (key: string) => {
    const translations = {
      en: {
        'nav.dashboard': 'Dashboard',
        'nav.elibrary': 'E-Library',
        'nav.chatbot': 'Chatbot',
        'nav.activities': 'Activities',
        'nav.news': 'News',
        'nav.logout': 'Log Out',
        'nav.usermanagement': 'User Management',
        'nav.chatbotqa': 'Chatbot Q&A',
        // Dashboard content translations
        'dashboard.profile': 'Profile',
        'dashboard.calendar': 'Calendar',
        'dashboard.tips': 'Tips',
        'dashboard.stats': 'Statistics',
        'dashboard.quickActions': 'Quick Actions',
        'dashboard.recentUpdates': 'Recent Updates',
        'dashboard.upcomingTrainings': 'Upcoming Trainings',
        'dashboard.analytics': 'Analytics',
        'common.active': 'Active',
        'common.edit': 'Edit',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.addEvent': 'Add Event',
        'common.viewAll': 'View All',
      },
      tl: {
        'nav.dashboard': 'Dashboard',
        'nav.elibrary': 'E-Library',
        'nav.chatbot': 'Chatbot',
        'nav.activities': 'Mga Gawain',
        'nav.news': 'Balita',
        'nav.logout': 'Mag-logout',
        'nav.usermanagement': 'Pamamahala ng User',
        'nav.chatbotqa': 'Chatbot Q&A',
        // Dashboard content translations
        'dashboard.profile': 'Profile',
        'dashboard.calendar': 'Kalendaryo',
        'dashboard.tips': 'Mga Payo',
        'dashboard.stats': 'Mga Estadistika',
        'dashboard.quickActions': 'Mabibiling Aksyon',
        'dashboard.recentUpdates': 'Kamakailang Update',
        'dashboard.upcomingTrainings': 'Paparating na Pagsasanay',
        'dashboard.analytics': 'Analytics',
        'common.active': 'Aktibo',
        'common.edit': 'I-edit',
        'common.save': 'I-save',
        'common.cancel': 'Kanselahin',
        'common.addEvent': 'Magdagdag ng Event',
        'common.viewAll': 'Tingnan Lahat',
      },
      ceb: {
        'nav.dashboard': 'Dashboard',
        'nav.elibrary': 'E-Library',
        'nav.chatbot': 'Chatbot',
        'nav.activities': 'Mga Kalihokan',
        'nav.news': 'Balita',
        'nav.logout': 'Pag-logout',
        'nav.usermanagement': 'Pagdumala sa User',
        'nav.chatbotqa': 'Chatbot Q&A',
        // Dashboard content translations
        'dashboard.profile': 'Profile',
        'dashboard.calendar': 'Kalendaryo',
        'dashboard.tips': 'Mga Tambag',
        'dashboard.stats': 'Mga Estadistika',
        'dashboard.quickActions': 'Daling mga Aksyon',
        'dashboard.recentUpdates': 'Bag-ong mga Update',
        'dashboard.upcomingTrainings': 'Umaabot nga Paghanas',
        'dashboard.analytics': 'Analytics',
        'common.active': 'Aktibo',
        'common.edit': 'I-edit',
        'common.save': 'I-save',
        'common.cancel': 'Kanselahon',
        'common.addEvent': 'Idugang og Event',
        'common.viewAll': 'Tan-awa ang Tanan',
      }
    };
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  const getNavigationItems = () => {
    const baseItems = [
      { title: t('nav.dashboard'), url: '/dashboard', icon: LayoutDashboard },
    ];

    switch (userRole) {
      case 'admin':
        return [
          ...baseItems,
          { title: t('nav.activities'), url: '/activities', icon: Calendar },
          { title: t('nav.news'), url: '/news', icon: Newspaper },
          { title: t('nav.chatbotqa'), url: '/chatbot-qa', icon: HelpCircle },
          { title: t('nav.usermanagement'), url: '/users', icon: Users },
        ];
      case 'aew':
        return [
          ...baseItems,
          { title: t('nav.elibrary'), url: '/library', icon: BookOpen },
          { title: t('nav.chatbot'), url: '/chatbot', icon: MessageCircle },
          { title: t('nav.activities'), url: '/activities', icon: Calendar },
          { title: t('nav.news'), url: '/news', icon: Newspaper },
        ];
      case 'public':
        return [
          ...baseItems,
          { title: t('nav.elibrary'), url: '/library', icon: BookOpen },
          { title: t('nav.chatbot'), url: '/chatbot', icon: MessageCircle },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    // Clear stored user role
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  if (!userRole) return null;

  return (
    <div className={cn(
      "h-screen border-r border-border transition-all duration-300 fixed left-0 top-0 z-40",
      isCollapsed ? "w-16" : "w-64"
    )} style={{ backgroundColor: '#202020' }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  SAKAP
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hover:bg-secondary"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                state={{ userRole }}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Language Selector - For All User Types */}
        <div className="p-2 border-t border-border">
          {!isCollapsed ? (
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full bg-transparent border-border text-muted-foreground hover:bg-secondary">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([code, lang]) => (
                  <SelectItem key={code} value={code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-10 text-muted-foreground hover:bg-secondary"
              title={languages[language as keyof typeof languages].name}
            >
              <Globe className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Logout */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-muted-foreground hover:bg-secondary hover:text-foreground",
              isCollapsed && "px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">{t('nav.logout')}</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;