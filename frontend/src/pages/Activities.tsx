import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, UserPlus, Filter, Check, X, Search, Link } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ActivityService } from '@/services/activityService';
import { Activity as ActivityType } from '@shared/types';

const Activities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.userRole || sessionStorage.getItem('userRole') || 'public';
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // AEW Event Registration State
  const [isEventRegistrationOpen, setIsEventRegistrationOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [aewRegisteredEvents, setAewRegisteredEvents] = useState<Set<string>>(new Set(['1', '2'])); // Mock registered events
  const [searchFarmers, setSearchFarmers] = useState('');
  const [selectedFarmers, setSelectedFarmers] = useState<any[]>([]);
  
  // Mock AEW profile data for location filtering
  const aewProfile = {
    city: 'Loreto',
    province: 'Agusan del Sur',
    region: 'Caraga'
  };

  // Fetch activities from the backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const fetchedActivities = await ActivityService.getAllActivities();
        setActivities(fetchedActivities);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Location-based farmers (filtered by AEW's location)
  const getLocationBasedFarmers = (aewLocation: any) => {
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
  const availableFarmers = getLocationBasedFarmers(aewProfile);

  // Event registration handlers
  const handleEventClick = (event: any) => {
    if (userRole === 'aew') {
      setSelectedEvent(event);
      setIsEventRegistrationOpen(true);
      setSelectedFarmers([]);
      setSearchFarmers('');
    }
  };

  const handleAEWRegistration = (eventId: string) => {
    setAewRegisteredEvents(new Set([...aewRegisteredEvents, eventId]));
    // In a real app, this would make an API call
    console.log(`AEW registered for event ${eventId}`);
  };

  const handleFarmerSelection = (farmer: any) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Remove the handleCreateActivity function as it's moved to the CreateActivity page

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background w-full">
        <Navigation userRole={userRole} />
        <main className="flex-1 overflow-auto ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <p>Loading activities...</p>
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
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div>
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {userRole === 'admin' ? 'Activity Management' : 'Training Activities'}
              </h1>
              <p className="text-muted-foreground">
                {userRole === 'admin' 
                  ? 'Create and manage training activities, workshops, and seminars'
                  : 'Browse and register for agricultural training activities'
                }
              </p>
            </div>
            {userRole === 'admin' && (
              <Button onClick={() => navigate('/create-activity')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Activity
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search-activities" className="sr-only">Search Activities</Label>
              <Input
                id="search-activities"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status-filter" className="sr-only">Status Filter</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48" id="status-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredActivities.map((activity) => {
              const isAEWRegistered = userRole === 'aew' && aewRegisteredEvents.has(activity.id);
              
              return (
                <Card 
                  key={activity.id} 
                  className={`hover:shadow-lg transition-shadow ${
                    userRole === 'aew' ? 'cursor-pointer' : ''
                  } ${
                    isAEWRegistered ? 'border-2 border-accent/30 bg-accent/5' : ''
                  }`}
                  onClick={() => userRole === 'aew' ? handleEventClick(activity) : undefined}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{activity.type || 'Activity'}</Badge>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      {isAEWRegistered && (
                        <div className="flex items-center text-accent text-sm">
                          <Check className="h-4 w-4 mr-1" />
                          <span>Registered</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{activity.title}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{activity.registered_count || 0}/{activity.capacity || 'Unlimited'} registered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>By {activity.organizer}</span>
                      </div>
                      {/* Webinar Link - Only show for webinar type activities */}
                      {activity.type === 'webinar' && activity.webinarLink && (
                        <div className="flex items-center gap-2 md:col-span-2">
                          <Link className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={activity.webinarLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Join Webinar
                          </a>
                        </div>
                      )}
                    </div>

                    {userRole === 'admin' && (
                      <div className="pt-4 border-t">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Users className="h-4 w-4 mr-2" />
                            Attendees
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {userRole === 'aew' && (
                      <div className="pt-4 border-t">
                        <div className="space-y-2">
                          {!isAEWRegistered ? (
                            <Button 
                              className="w-full" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAEWRegistration(activity.id);
                              }}
                            >
                              Register as AEW
                            </Button>
                          ) : (
                            <div className="text-center text-sm text-accent">
                              ✓ You are registered. Click to manage farmer registrations.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {userRole === 'public' && (
                      <div className="pt-4 border-t">
                        <Button className="w-full" disabled={activity.status === 'completed'}>
                          {activity.status === 'completed' ? 'Completed' : 'Register for Activity'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      
      {/* Event Registration Dialog for AEW */}
      {userRole === 'aew' && (
        <Dialog open={isEventRegistrationOpen} onOpenChange={setIsEventRegistrationOpen}>
          <DialogContent className="bg-gradient-to-br from-primary/15 to-accent/25 border-accent/40 max-w-2xl w-full max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-foreground text-lg">
                {selectedEvent ? `Event Registration - ${selectedEvent.title}` : 'Event Registration'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {selectedEvent && (
                <>
                  {/* Event Details - Compact */}
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-3 rounded-lg">
                    <h3 className="font-semibold text-base mb-2">Event Details</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                        <p><strong>Location:</strong> {selectedEvent.location}</p>
                        <p><strong>Instructor:</strong> {selectedEvent.organizer}</p>
                      </div>
                      <div className="space-y-1">
                        <p><strong>Capacity:</strong> {selectedEvent.registered_count || 0}/{selectedEvent.capacity || 'Unlimited'}</p>
                        <p><strong>Status:</strong> {selectedEvent.status.replace('-', ' ')}</p>
                      </div>
                      {/* Webinar Link - Only show for webinar type events */}
                      {selectedEvent.type === 'webinar' && selectedEvent.webinarLink && (
                        <div className="space-y-1 md:col-span-2">
                          <p><strong>Webinar Link:</strong> 
                            <a 
                              href={selectedEvent.webinarLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline ml-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Join Webinar
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* AEW Registration - Compact */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base">1. AEW Registration</h3>
                      {aewRegisteredEvents.has(selectedEvent.id) ? (
                        <div className="flex items-center text-accent text-sm">
                          <Check className="h-4 w-4 mr-1" />
                          <span>Registered</span>
                        </div>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleAEWRegistration(selectedEvent.id)}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                        >
                          Register as AEW
                        </Button>
                      )}
                    </div>
                    
                    {!aewRegisteredEvents.has(selectedEvent.id) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                        <p className="text-xs text-yellow-800">
                          Register as AEW first to enable farmer registration.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Farmer Registration - Compact */}
                  {aewRegisteredEvents.has(selectedEvent.id) && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-base">2. Register Farmers</h3>
                      
                      {/* Search Farmers */}
                      <div className="relative">
                        <Label htmlFor="search-farmers" className="sr-only">Search Farmers</Label>
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          id="search-farmers"
                          placeholder="Search farmers..."
                          value={searchFarmers}
                          onChange={(e) => setSearchFarmers(e.target.value)}
                          className="pl-8 h-8 text-sm"
                        />
                      </div>
                      
                      {/* Farmers List Header */}
                      <div className="bg-muted/30 p-2 rounded text-xs">
                        <span className="font-medium">Available Farmers ({availableFarmers.length}) - {aewProfile.city}, {aewProfile.province}</span>
                      </div>
                      
                      {/* Available Farmers - Compact */}
                      <div className="border rounded max-h-48 overflow-y-auto">
                        {filteredFarmers.length > 0 ? (
                          filteredFarmers.map((farmer) => {
                            const isSelected = selectedFarmers.find(f => f.id === farmer.id);
                            
                            return (
                              <div 
                                key={farmer.id}
                                className={`p-2 border-b last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors ${
                                  isSelected ? 'bg-accent/10 border-accent/30' : ''
                                }`}
                                onClick={() => handleFarmerSelection(farmer)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 flex-1">
                                    <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                                      isSelected ? 'bg-accent border-accent text-white' : 'border-muted-foreground'
                                    }`}>
                                      {isSelected && <Check className="h-2 w-2" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">{farmer.name}</p>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {farmer.barangay} • {farmer.farmType}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {farmer.trainingsAttended}T
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-4 text-center text-muted-foreground text-sm">
                            {searchFarmers ? `No farmers found matching "${searchFarmers}"` : 'No farmers found'}
                          </div>
                        )}
                      </div>
                      
                      {/* Selected Farmers Summary - Compact */}
                      {selectedFarmers.length > 0 && (
                        <div className="bg-accent/10 p-2 rounded">
                          <h4 className="font-medium text-sm mb-1">Selected ({selectedFarmers.length})</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedFarmers.map((farmer) => (
                              <div key={farmer.id} className="inline-flex items-center bg-white rounded px-2 py-1 text-xs border">
                                <span className="truncate max-w-20">{farmer.name}</span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFarmerSelection(farmer);
                                  }}
                                  className="ml-1 text-muted-foreground hover:text-foreground"
                                >
                                  <X className="h-2 w-2" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            
            <DialogFooter className="flex-shrink-0 space-x-2 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsEventRegistrationOpen(false)}>
                Cancel
              </Button>
              {selectedEvent && aewRegisteredEvents.has(selectedEvent.id) && selectedFarmers.length > 0 && (
                <Button 
                  size="sm"
                  onClick={handleRegisterFarmers}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Register ({selectedFarmers.length})
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <FloatingChatbot />
    </div>
  );
};

export default Activities;