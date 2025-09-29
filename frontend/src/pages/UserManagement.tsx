import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';
import { Search, Plus, Edit, Trash2, Filter, Download, User, MapPin, Calendar, Shield, Star, GraduationCap, FileSpreadsheet, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CARAGA_REGION_DATA } from '@shared/constants';
import { userService } from '@/services/userService';
import { User as UserType } from '@shared/types';

const UserManagement = () => {
  const location = useLocation();
  const userRole = location.state?.userRole || sessionStorage.getItem('userRole') || 'public';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedMunicipality, setSelectedMunicipality] = useState('all');
  const [selectedUserLevel, setSelectedUserLevel] = useState('all');
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Caraga Region Provinces and Municipalities
  const caragaData = CARAGA_REGION_DATA;

  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const usersData = await userService.getAllUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  // Function to calculate user skill level based on trainings attended
  const getUserLevel = (trainingsAttended: number) => {
    if (trainingsAttended < 10) return { level: 'Novice', color: 'bg-red-100 text-red-800', progress: (trainingsAttended / 10) * 100 };
    if (trainingsAttended < 25) return { level: 'Advanced Beginner', color: 'bg-orange-100 text-orange-800', progress: ((trainingsAttended - 10) / 15) * 100 };
    if (trainingsAttended < 50) return { level: 'Competent', color: 'bg-yellow-100 text-yellow-800', progress: ((trainingsAttended - 25) / 25) * 100 };
    if (trainingsAttended < 75) return { level: 'Proficient', color: 'bg-blue-100 text-blue-800', progress: ((trainingsAttended - 50) / 25) * 100 };
    return { level: 'Expert', color: 'bg-green-100 text-green-800', progress: 100 };
  };

  const provinces = Object.keys(caragaData);
  const municipalities = selectedProvince === 'all' 
    ? Object.values(caragaData).flat()
    : caragaData[selectedProvince as keyof typeof caragaData] || [];
  const userLevels = ['Novice', 'Advanced Beginner', 'Competent', 'Proficient', 'Expert'];

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'aew':
        return 'bg-blue-100 text-blue-800';
      case 'public':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.location?.municipality || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUserType = selectedUserType === 'all' || user.role === selectedUserType;
    const matchesProvince = selectedProvince === 'all' || (user.location?.province || '') === selectedProvince;
    const matchesMunicipality = selectedMunicipality === 'all' || (user.location?.municipality || '') === selectedMunicipality;
    const matchesUserLevel = selectedUserLevel === 'all' || getUserLevel(user.trainingsAttended || 0).level === selectedUserLevel;
    return matchesSearch && matchesUserType && matchesProvince && matchesMunicipality && matchesUserLevel;
  });

  // Export functionality
  const exportToCSV = () => {
    const headers = [
      'User ID',
      'Name', 
      'Email',
      'User Type',
      'Province',
      'Municipality',
      'Join Date',
      'Last Login',
      'Status',
      'Trainings Attended',
      'Skill Level',
      'Progress to Next Level'
    ];

    const csvData = filteredUsers.map(user => {
      const userLevel = getUserLevel(user.trainingsAttended || 0);
      return [
        user.id,
        user.name,
        user.email,
        user.role.toUpperCase(),
        user.location?.province || '',
        user.location?.municipality || '',
        new Date(user.createdAt).toLocaleDateString(),
        new Date(user.updatedAt).toLocaleDateString(),
        user.isActive ? 'active' : 'inactive',
        user.trainingsAttended || 0,
        user.role === 'public' ? userLevel.level : 'N/A',
        user.role === 'public' ? `${userLevel.progress.toFixed(0)}%` : 'N/A'
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `caraga-users-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // Create Excel-compatible CSV with UTF-8 BOM
    const headers = [
      'User ID',
      'Name', 
      'Email',
      'User Type',
      'Province',
      'Municipality',
      'Join Date',
      'Last Login',
      'Status',
      'Trainings Attended',
      'Skill Level',
      'Progress to Next Level'
    ];

    const csvData = filteredUsers.map(user => {
      const userLevel = getUserLevel(user.trainingsAttended || 0);
      return [
        user.id,
        user.name,
        user.email,
        user.role.toUpperCase(),
        user.location?.province || '',
        user.location?.municipality || '',
        new Date(user.createdAt).toLocaleDateString(),
        new Date(user.updatedAt).toLocaleDateString(),
        user.isActive ? 'active' : 'inactive',
        user.trainingsAttended || 0,
        user.role === 'public' ? userLevel.level : 'N/A',
        user.role === 'public' ? `${userLevel.progress.toFixed(0)}%` : 'N/A'
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Add UTF-8 BOM for proper Excel encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `caraga-users-${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate level distribution for public users
  const publicUsers = users.filter(user => user.role === 'public');
  const levelDistribution = userLevels.reduce((acc, level) => {
    acc[level] = publicUsers.filter(user => getUserLevel(user.trainingsAttended || 0).level === level).length;
    return acc;
  }, {} as Record<string, number>);

  const CreateUserForm = () => {
    const [selectedUserType, setSelectedUserType] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedProvinceForm, setSelectedProvinceForm] = useState('');
    const [selectedMunicipalityForm, setSelectedMunicipalityForm] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    
    const municipalitiesForm = selectedProvinceForm ? caragaData[selectedProvinceForm as keyof typeof caragaData] || [] : [];
    
    const handleCreateUser = async () => {
      try {
        // Validation logic here
        console.log('Creating user with:', {
          userType: selectedUserType,
          firstName,
          lastName,
          email,
          province: selectedProvinceForm,
          municipality: selectedMunicipalityForm,
          phone,
          password,
          accessCode
        });
        
        // Close the dialog after creating user
        // In a real implementation, you would call the userService.createUser method
      } catch (error) {
        console.error('Error creating user:', error);
      }
    };
    
    return (
      <div className="space-y-4">
        {/* Role Selection */}
        <div>
          <Label htmlFor="userType" className="text-sm font-medium text-gray-700 mb-1 block">
            User Type
          </Label>
          <Select value={selectedUserType} onValueChange={setSelectedUserType}>
            <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white">
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="admin">ATI Administrator</SelectItem>
              <SelectItem value="aew">Agricultural Extension Worker</SelectItem>
              <SelectItem value="public">Farmer / Researcher</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-1 block">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white"
            />
          </div>
          
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-1 block">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white"
          />
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="province" className="text-sm font-medium text-gray-700 mb-1 block">
              Province
            </Label>
            <Select value={selectedProvinceForm} onValueChange={(value) => {
              setSelectedProvinceForm(value);
              setSelectedMunicipalityForm(''); // Clear municipality when province changes
            }}>
              <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 max-h-48 overflow-y-auto">
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="municipality" className="text-sm font-medium text-gray-700 mb-1 block">
              Municipality/City
            </Label>
            <Select 
              value={selectedMunicipalityForm} 
              onValueChange={setSelectedMunicipalityForm}
              disabled={!selectedProvinceForm}
            >
              <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white disabled:bg-gray-50 disabled:text-gray-400">
                <SelectValue placeholder={selectedProvinceForm ? "Select municipality" : "Select province first"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 max-h-48 overflow-y-auto">
                {municipalitiesForm.map((municipality) => (
                  <SelectItem key={municipality} value={municipality}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Phone and Password */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 block">
              Phone Number
              <span className="text-gray-400 font-normal"> (Optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+63 912 345 6789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white"
            />
          </div>
        </div>

        {/* Access Code Field - Only for Admin and AEW roles */}
        {(selectedUserType === 'admin' || selectedUserType === 'aew') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Label htmlFor="accessCode" className="text-sm font-medium text-blue-900 mb-1 block">
              Access Code
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="accessCode"
              type="password"
              placeholder="Enter access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="h-11 rounded-lg border-blue-300 focus:border-blue-500 bg-white"
            />
            <p className="text-xs text-blue-700 mt-2">
              {selectedUserType === 'admin' ? 'ATI Administrators require a valid access code' : 'AEWs require a valid access code'}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            onClick={handleCreateUser}
            className="w-full h-12 rounded-lg text-sm font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white transition-all duration-300"
          >
            Create User Account
          </Button>
        </div>

        {/* Demo Information */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Demo Access Codes:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>• ATI Administrator: <code className="bg-white px-1 rounded">ATI2024ADMIN</code></p>
              <p>• AEW: <code className="bg-white px-1 rounded">AEW2024ACCESS</code></p>
            </div>
            {(selectedUserType === 'admin' || selectedUserType === 'aew') && (
              <p className="text-xs text-amber-600 mt-2 font-medium">⚠️ Access code required for this role</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background w-full">
        <Navigation userRole={userRole} />
        <main className="flex-1 overflow-auto ml-64 p-8">
          <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
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
              <h1 className="text-3xl font-bold text-foreground mb-2">User Management - Caraga Region</h1>
              <p className="text-muted-foreground">
                Manage user accounts across the five provinces of Caraga Region: Agusan del Norte, Agusan del Sur, Dinagat Islands, Surigao del Norte, and Surigao del Sur
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New User - Caraga Region</DialogTitle>
                    <DialogDescription>
                      Add a new user account to the SAKAP platform for Caraga Region.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateUserForm />
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export ({filteredUsers.length} users)
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Statistics Cards - Caraga Region Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/10">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{users.length}</div>
                <p className="text-xs text-muted-foreground">Total Users in Caraga</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-700">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <p className="text-xs text-muted-foreground">ATI Admins</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-700">
                  {users.filter(u => u.role === 'aew').length}
                </div>
                <p className="text-xs text-muted-foreground">AEWs</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-700">
                  {users.filter(u => u.role === 'public').length}
                </div>
                <p className="text-xs text-muted-foreground">Public Users</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-amber-700">
                  {publicUsers.filter(u => getUserLevel(u.trainingsAttended || 0).level === 'Expert').length}
                </div>
                <p className="text-xs text-muted-foreground">Expert Farmers</p>
              </CardContent>
            </Card>
          </div>

          {/* Province Distribution Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Caraga Region - Province Distribution</span>
              </CardTitle>
              <CardDescription>
                User distribution across the five provinces of Caraga Region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {provinces.map((province) => {
                  const provinceUsers = users.filter(user => (user.location?.province || '') === province);
                  return (
                    <div key={province} className="text-center p-4 rounded-lg border border-border/50 hover:shadow-soft transition-shadow bg-gradient-to-br from-primary/5 to-accent/5">
                      <div className="text-2xl font-bold text-primary mb-2">{provinceUsers.length}</div>
                      <p className="text-xs font-medium text-foreground mb-1">{province}</p>
                      <p className="text-xs text-muted-foreground">
                        {caragaData[province as keyof typeof caragaData].length} municipalities
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* User Level Distribution Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span>Public User Skill Level Distribution</span>
              </CardTitle>
              <CardDescription>
                Track the learning progress and skill development of public users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {userLevels.map((level) => {
                  const levelInfo = getUserLevel(level === 'Novice' ? 5 : level === 'Advanced Beginner' ? 15 : 
                                                  level === 'Competent' ? 30 : level === 'Proficient' ? 60 : 80);
                  return (
                    <div key={level} className="text-center p-4 rounded-lg border border-border/50 hover:shadow-soft transition-shadow">
                      <div className="mb-2">
                        <Badge className={levelInfo.color}>
                          <Star className="h-3 w-3 mr-1" />
                          {level}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">{levelDistribution[level]}</div>
                      <p className="text-xs text-muted-foreground">users</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, ID, or municipality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedUserType} onValueChange={setSelectedUserType}>
              <SelectTrigger className="w-full md:w-48">
                <Shield className="h-4 w-4 mr-2" />
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All User Types</SelectItem>
                <SelectItem value="admin">ATI Admins</SelectItem>
                <SelectItem value="aew">AEWs</SelectItem>
                <SelectItem value="public">Public Users</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedProvince} onValueChange={(value) => {
              setSelectedProvince(value);
              setSelectedMunicipality('all'); // Reset municipality when province changes
            }}>
              <SelectTrigger className="w-full md:w-48">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {provinces.map(province => (
                  <SelectItem key={province} value={province}>{province}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
              <SelectTrigger className="w-full md:w-48">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Municipality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Municipalities</SelectItem>
                {municipalities.map(municipality => (
                  <SelectItem key={municipality} value={municipality}>{municipality}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedUserLevel} onValueChange={setSelectedUserLevel}>
              <SelectTrigger className="w-full md:w-48">
                <GraduationCap className="h-4 w-4 mr-2" />
                <SelectValue placeholder="User Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {userLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Manage and view all registered users with their skill levels on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trainings</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const userLevel = getUserLevel(user.trainingsAttended || 0);
                    return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.id}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getUserTypeColor(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{user.location?.province || ''}</div>
                        <div className="text-xs text-primary">{user.location?.municipality || ''}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.updatedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.isActive)}>
                          {user.isActive ? 'active' : 'inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center text-sm font-medium">
                          {user.trainingsAttended || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.role === 'public' ? (
                          <div className="flex flex-col items-center space-y-1">
                            <Badge className={userLevel.color}>
                              <Star className="h-3 w-3 mr-1" />
                              {userLevel.level}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {userLevel.progress.toFixed(0)}% to next
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground text-center">
                            N/A
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
};

export default UserManagement;