import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityService } from '@/services/activityService';
import { authService } from '@/services/authService';

const CreateActivity = () => {
  const navigate = useNavigate();
  const userRole = (sessionStorage.getItem('userRole') || 'admin') as 'admin' | 'aew' | 'public';
  
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    type: 'workshop',
    maxParticipants: 50,
    startDate: '',
    endDate: '',
    location: '',
    webinarLink: '' // Added for webinar activities
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        throw new Error('You must be logged in to create activities. Please log in again.');
      }
      
      // Get user data
      const userData = authService.getUserData();
      if (!userData) {
        throw new Error('Unable to get user information. Please log in again.');
      }

      const activityData = {
        title: newActivity.title,
        description: newActivity.description,
        date: newActivity.startDate,
        location: newActivity.location,
        organizer: userData.name || 'Unknown Organizer',
        organizer_id: userData.id,
        capacity: newActivity.maxParticipants,
        status: 'upcoming' as const,
        registered_count: 0,
        webinar_link: newActivity.type === 'webinar' ? newActivity.webinarLink : undefined // Only include for webinars
      };

      await ActivityService.createActivity(activityData);
      
      setSuccess(true);
      // Reset form
      setNewActivity({
        title: '',
        description: '',
        type: 'workshop',
        maxParticipants: 50,
        startDate: '',
        endDate: '',
        location: '',
        webinarLink: '' // Reset webinar link
      });
      
      // Show success message and redirect after a short delay
      setTimeout(() => {
        navigate('/activities');
      }, 2000);
    } catch (err) {
      console.error('Error creating activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to create activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/activities');
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Navigation userRole={userRole} />
      <main className="flex-1 overflow-auto ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create New Activity
              </h1>
              <p className="text-muted-foreground">
                Fill in the details to create a new training activity
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity Details</CardTitle>
              <CardDescription>
                Provide information about the training activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  Activity created successfully! Redirecting to activities page...
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleCreateActivity} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Activity Title *</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter activity title" 
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the activity" 
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                      required
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select 
                      value={newActivity.type} 
                      onValueChange={(value) => setNewActivity({...newActivity, type: value})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="max-participants">Max Participants</Label>
                    <Input 
                      id="max-participants" 
                      type="number" 
                      placeholder="50" 
                      value={newActivity.maxParticipants || ''}
                      onChange={(e) => setNewActivity({...newActivity, maxParticipants: parseInt(e.target.value) || 0})}
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="start-date">Start Date *</Label>
                    <Input 
                      id="start-date" 
                      type="date" 
                      value={newActivity.startDate}
                      onChange={(e) => setNewActivity({...newActivity, startDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input 
                      id="end-date" 
                      type="date" 
                      value={newActivity.endDate}
                      onChange={(e) => setNewActivity({...newActivity, endDate: e.target.value})}
                    />
                  </div>
                  
                  {/* Webinar Link Field - Only show for webinar type */}
                  {newActivity.type === 'webinar' && (
                    <div className="md:col-span-2">
                      <Label htmlFor="webinar-link">Webinar Link *</Label>
                      <Input 
                        id="webinar-link" 
                        placeholder="https://example.com/webinar-link" 
                        value={newActivity.webinarLink}
                        onChange={(e) => setNewActivity({...newActivity, webinarLink: e.target.value})}
                        required={newActivity.type === 'webinar'}
                      />
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input 
                      id="location" 
                      placeholder="Enter location" 
                      value={newActivity.location}
                      onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Activity'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
};

export default CreateActivity;