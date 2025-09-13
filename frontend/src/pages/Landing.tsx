import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { expertFarmerAPI, ExpertFarmer } from '@/lib/expertFarmerAPI';
import { 
  Leaf, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Landing = () => {
  const [currentExpertIndex, setCurrentExpertIndex] = useState(0);
  const [expertFarmers, setExpertFarmers] = useState<ExpertFarmer[]>([]);

  // Count-up animation hook
  const useCountUp = (end: number, duration = 2000, delay = 0) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const countRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isVisible) {
              setIsVisible(true);
            }
          });
        },
        { threshold: 0.3 }
      );

      if (countRef.current) {
        observer.observe(countRef.current);
      }

      return () => {
        if (countRef.current) {
          observer.unobserve(countRef.current);
        }
      };
    }, [isVisible]);

    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(() => {
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }, delay);

        return () => clearTimeout(timer);
      }
    }, [isVisible, end, duration, delay]);

    return { count, ref: countRef };
  };

  // Total active users count (mockup data)
  const totalActiveUsers = 16531; // 12,847 + 3,256 + 428
  const { count: activeUsersCount, ref: usersCountRef } = useCountUp(totalActiveUsers, 3000);

  // Load expert farmers from API
  useEffect(() => {
    const loadExpertFarmers = async () => {
      try {
        const farmers = await expertFarmerAPI.getFeaturedExperts();
        setExpertFarmers(farmers);
      } catch (error) {
        console.error('Failed to load expert farmers:', error);
        // Use fallback mockup data with provided farmer photos
        const mockFarmers: ExpertFarmer[] = [
          {
            id: '1',
            name: 'Charlie Lerio',
            location: 'Nueva Ecija',
            specialization: 'Rice Farming',
            achievement: 'Increased yield by 40% using sustainable methods',
            profilePicture: '/images/farmer 1.jpg',
            eventsAttended: 85,
            yearsExperience: 15,
            quote: 'SAKAP helped me learn modern techniques while preserving traditional wisdom.',
            featured: true,
            featuredAt: new Date('2024-01-01'),
            clickCount: 245,
            impressions: 1250
          },
          {
            id: '2',
            name: 'Luiz Sedillo',
            location: 'Ilocos Sur',
            specialization: 'Organic Vegetables',
            achievement: 'Successfully transitioned to 100% organic farming',
            profilePicture: '/images/farmer 2.jpg',
            eventsAttended: 92,
            yearsExperience: 12,
            quote: 'The knowledge I gained here transformed my farm and my family\'s future.',
            featured: true,
            featuredAt: new Date('2024-01-15'),
            clickCount: 189,
            impressions: 890
          },
          {
            id: '3',
            name: 'John Belar',
            location: 'Laguna',
            specialization: 'Aquaponics',
            achievement: 'Pioneer in sustainable aquaponics systems',
            profilePicture: '/images/farmer 3.jpg',
            eventsAttended: 78,
            yearsExperience: 8,
            quote: 'Innovation meets tradition - that\'s what SAKAP taught me.',
            featured: true,
            featuredAt: new Date('2024-01-20'),
            clickCount: 67,
            impressions: 340
          },
          {
            id: '4',
            name: 'Era Rodriguez',
            location: 'Davao',
            specialization: 'Fruit Cultivation',
            achievement: 'Developed drought-resistant mango varieties',
            profilePicture: '/images/farmer 4.jpg',
            eventsAttended: 95,
            yearsExperience: 20,
            quote: 'Research and practice go hand in hand for agricultural success.',
            featured: true,
            featuredAt: new Date('2024-01-25'),
            clickCount: 134,
            impressions: 670
          }
        ];
        setExpertFarmers(mockFarmers);
      }
    };
    
    loadExpertFarmers();
  }, []);

  // Auto-rotate expert farmers every 5 seconds
  useEffect(() => {
    if (expertFarmers.length > 1) {
      const interval = setInterval(() => {
        setCurrentExpertIndex((prev) => (prev + 1) % expertFarmers.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [expertFarmers.length]);

  const currentExpert = expertFarmers[currentExpertIndex];

  const nextExpert = () => {
    setCurrentExpertIndex((prev) => (prev + 1) % expertFarmers.length);
    // Track engagement
    if (currentExpert) {
      expertFarmerAPI.trackEngagement(currentExpert.id, 'click');
    }
  };

  const prevExpert = () => {
    setCurrentExpertIndex((prev) => (prev - 1 + expertFarmers.length) % expertFarmers.length);
    // Track engagement
    if (currentExpert) {
      expertFarmerAPI.trackEngagement(currentExpert.id, 'click');
    }
  };

  // Track view when expert changes
  useEffect(() => {
    if (currentExpert) {
      expertFarmerAPI.trackEngagement(currentExpert.id, 'view');
    }
  }, [currentExpert]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-[#202020] backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5DD62C] to-[#5DD62C] rounded-xl flex items-center justify-center shadow-medium">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#5DD62C]">
                  SAKAP
                </h1>
                <p className="text-xs text-gray-300">Smart Agricultural Knowledge Access Platform</p>
              </div>
            </div>
            <Link to="/login">
              <Button className="bg-[#5DD62C] text-white hover:bg-[#5DD62C]/90">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-sm font-medium text-primary">🌾 Empowering Filipino Farmers</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Smart Agricultural
                  <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Knowledge Access Platform
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Access comprehensive agricultural resources, connect with extension workers, 
                  and get intelligent chatbot assistance for better farming practices.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent hover:shadow-strong transition-all duration-300 text-primary-foreground"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary/20 hover:bg-primary/5"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Free Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Expert Guidance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Expert Farmer Full Image Showcase */}
            <div className="relative">
              {expertFarmers.length > 0 && currentExpert ? (
                <div className="relative">
                  {/* Full Image with Overlay */}
                  <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-strong">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url('${currentExpert.profilePicture}')` }}
                    />
                    
                    {/* Top Vignette */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
                    
                    {/* Bottom Vignette */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
                    
                    {/* Expert Badge */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-gradient-to-r from-primary to-accent px-3 py-1.5 rounded-full text-white shadow-lg">
                      <Award className="h-3 w-3" />
                      <span className="text-xs font-medium">Expert Farmer</span>
                    </div>

                    {/* Top Content - Congratulations */}
                    <div className="absolute top-4 left-4 right-20 text-white">
                      <h2 className="text-lg font-bold mb-1">
                        🎉 Congratulations to:
                      </h2>
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {currentExpert.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        {currentExpert.location} • {currentExpert.specialization}
                      </p>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      {/* Achievement */}
                      <div className="mb-3">
                        <div className="bg-black/30 rounded-lg p-3 border border-white/20">
                          <h4 className="text-sm font-semibold mb-1 text-primary">
                            🏆 Outstanding Achievement
                          </h4>
                          <p className="text-sm font-medium">
                            {currentExpert.achievement}
                          </p>
                        </div>
                      </div>

                      {/* Quote */}
                      {currentExpert.quote && (
                        <div className="bg-black/30 rounded-lg p-3 border border-white/20 mb-3">
                          <p className="text-sm italic text-center">
                            "{currentExpert.quote}"
                          </p>
                        </div>
                      )}

                      {/* Stats Bar */}
                      <div className="flex items-center justify-center space-x-6 text-center">
                        <div>
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-lg font-bold text-primary">{currentExpert.eventsAttended}</span>
                          </div>
                          <p className="text-xs opacity-90">Events</p>
                        </div>
                        <div className="w-px h-6 bg-white/30"></div>
                        <div>
                          <p className="text-lg font-bold text-primary">{currentExpert.yearsExperience}+</p>
                          <p className="text-xs opacity-90">Years</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  {expertFarmers.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevExpert}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-white/90 hover:bg-white border-primary/20 shadow-lg"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextExpert}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-white/90 hover:bg-white border-primary/20 shadow-lg"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}

                  {/* Indicators */}
                  {expertFarmers.length > 1 && (
                    <div className="flex justify-center space-x-3 mt-6">
                      {expertFarmers.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentExpertIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentExpertIndex 
                              ? 'bg-gradient-to-r from-primary to-accent shadow-lg scale-125' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Fallback to placeholder when no expert farmers available
                <div className="relative rounded-3xl overflow-hidden shadow-strong">
                  <div className="h-[500px] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="text-xl text-muted-foreground">Expert farmers showcase coming soon</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Comprehensive tools designed for farmers, extension workers, and agricultural administrators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-medium transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-3">E-Library</h3>
                <p className="text-sm text-muted-foreground">
                  Access thousands of agricultural resources including PDFs, videos, and audio content
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-3">AI Chatbot</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant answers to farming questions with voice support and resource references
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Training Events</h3>
                <p className="text-sm text-muted-foreground">
                  Register for seminars, webinars, and training programs organized by ATI
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4">
                Join the Future of{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Philippine Agriculture
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Whether you're a dedicated farmer seeking to enhance your practices or a passionate 
                student researcher exploring agricultural innovations, SAKAP is your gateway to 
                knowledge, community, and success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* For Farmers */}
              <Card className="p-8 text-center hover:shadow-strong transition-all duration-300 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">For Farmers</h3>
                <p className="text-muted-foreground mb-6">
                  Transform your farming practices with expert guidance, modern techniques, 
                  and a supportive community. Your success story starts here.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Access to expert agricultural knowledge</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Connect with extension workers</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Join training programs and events</span>
                  </div>
                </div>
              </Card>

              {/* For Researchers */}
              <Card className="p-8 text-center hover:shadow-strong transition-all duration-300 border-primary/20 bg-gradient-to-br from-accent/5 to-primary/5">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">For Student Researchers</h3>
                <p className="text-muted-foreground mb-6">
                  Dive deep into agricultural research, access comprehensive resources, 
                  and contribute to the advancement of Philippine agriculture.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Comprehensive research database</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Connect with agricultural experts</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Participate in research initiatives</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main CTA */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">
                Ready to make a difference in Philippine agriculture?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent hover:shadow-strong transition-all duration-300 text-primary-foreground px-8 py-3 text-lg"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary/30 hover:bg-primary/5 px-8 py-3 text-lg"
                >
                  Explore Resources
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Join thousands of farmers and researchers already transforming Philippine agriculture
              </p>
              
              {/* Active Users Statistics */}
              <div className="mt-12 pt-8 border-t border-primary/20">
                <h4 className="text-lg font-semibold mb-6 text-muted-foreground">
                  Join our growing community of agricultural innovators
                </h4>
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center" ref={usersCountRef}>
                    <div className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                      {activeUsersCount.toLocaleString()}+
                    </div>
                    <div className="text-xl text-muted-foreground font-medium">
                      Active Users
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Farmers, Researchers & Extension Workers
                    </div>
                  </div>
                  
                  {/* Live indicator */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live count - Growing every day!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-[#202020] border-t border-gray-600 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-[#5DD62C] rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-[#5DD62C]">
                  SAKAP
                </span>
                <p className="text-sm text-gray-300">Smart Agricultural Knowledge Access Platform</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 text-center md:text-right">
              © 2024 Agricultural Training Institute. Empowering Filipino agriculture through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;