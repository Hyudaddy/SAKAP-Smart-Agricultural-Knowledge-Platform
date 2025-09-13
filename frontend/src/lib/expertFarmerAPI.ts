// API service for expert farmers
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ExpertFarmer {
  id: string;
  name: string;
  location: string;
  specialization: string;
  achievement: string;
  profilePicture?: string;
  eventsAttended: number;
  yearsExperience: number;
  quote?: string;
  featured: boolean;
  featuredAt?: Date;
  clickCount?: number;
  impressions?: number;
}

export const expertFarmerAPI = {
  // Get featured expert farmers for landing page
  async getFeaturedExperts(): Promise<ExpertFarmer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/featured/experts`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured experts');
      }
      const data = await response.json();
      return data.data?.featuredExperts || [];
    } catch (error) {
      console.error('Error fetching featured experts:', error);
      // Return mock data as fallback
      return getMockExpertFarmers();
    }
  },

  // Update featured status (admin only)
  async updateFeaturedStatus(farmerId: string, featured: boolean, achievement?: string, quote?: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${farmerId}/featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header
        },
        body: JSON.stringify({ featured, achievement, quote })
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating featured status:', error);
      return false;
    }
  },

  // Track farmer engagement (views/clicks)
  async trackEngagement(farmerId: string, type: 'view' | 'click'): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/users/${farmerId}/engagement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type })
      });
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  }
};

// Mock data for fallback
function getMockExpertFarmers(): ExpertFarmer[] {
  return [
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
}