import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, ArrowLeft, Facebook, Chrome, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CARAGA_REGION_DATA } from '@shared/constants';
import { authService, RegisterData, LoginCredentials } from '@/services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [province, setProvince] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Caraga Region provinces and municipalities
  const provinces = Object.keys(CARAGA_REGION_DATA);
  const municipalities = province ? CARAGA_REGION_DATA[province as keyof typeof CARAGA_REGION_DATA] || [] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      // Handle sign up
      setIsLoading(true);
      const requiresAccessCode = userType === 'admin' || userType === 'aew';
      
      if (firstName && lastName && email && password && userType && province && municipality && (!requiresAccessCode || accessCode)) {
        // Validate access code for admin and AEW roles
        if (requiresAccessCode) {
          const validAccessCodes = {
            admin: 'ATI2024ADMIN',
            aew: 'AEW2024ACCESS'
          };
          
          if (accessCode !== validAccessCodes[userType as keyof typeof validAccessCodes]) {
            toast({
              title: "Sign Up Failed",
              description: "Invalid access code for this role",
              variant: "destructive"
            });
            setIsLoading(false);
            return;
          }
        }
        
        // Prepare registration data
        const registerData: RegisterData = {
          name: `${firstName} ${lastName}`,
          email,
          password,
          role: userType as 'admin' | 'aew' | 'public'
        };
        
        // Add location data to the request
        const registrationPayload = {
          ...registerData,
          province,
          municipality,
          barangay: '' // We don't collect barangay in the form, so send empty string
        };
        
        try {
          const response = await authService.register(registrationPayload);
          
          if (response.success) {
            toast({
              title: "Account Created Successfully",
              description: `Welcome to SAKAP, ${firstName} ${lastName}!`,
            });
            // Switch to login view
            setIsSignUp(false);
            setFirstName('');
            setLastName('');
            setAccessCode('');
            setMunicipality('');
            setPhone('');
          } else {
            toast({
              title: "Sign Up Failed",
              description: response.message || response.error || "An error occurred during registration",
              variant: "destructive"
            });
          }
        } catch (error) {
          toast({
            title: "Sign Up Failed",
            description: "An error occurred during registration",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        let missingField = 'Please fill in all required fields';
        if (requiresAccessCode && !accessCode) {
          missingField = 'Access code is required for this role';
        } else if (!province) {
          missingField = 'Please select your province';
        } else if (!municipality) {
          missingField = 'Please select your municipality';
        }
        toast({
          title: "Sign Up Failed",
          description: missingField,
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } else {
      // Handle login
      setIsLoading(true);
      if (email && password && userType) {
        // Prepare login credentials
        const credentials: LoginCredentials = {
          email,
          password
        };
        
        try {
          const response = await authService.login(credentials);
          
          if (response.success && response.data) {
            // Store user role in sessionStorage for persistence across navigation
            sessionStorage.setItem('userRole', userType);
            toast({
              title: "Login Successful",
              description: `Welcome to SAKAP as ${userType}!`,
            });
            navigate('/dashboard', { state: { userRole: userType } });
          } else {
            toast({
              title: "Login Failed",
              description: response.message || response.error || "Invalid credentials",
              variant: "destructive"
            });
          }
        } catch (error) {
          toast({
            title: "Login Failed",
            description: "An error occurred during login",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Please fill in all fields",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Clear form when switching but keep form visible
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setAccessCode('');
    setUserType('');
    setProvince('');
    setMunicipality('');
    setPhone('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#202020' }}>
      {/* Main Container - Compact Card */}
      <div className="w-full max-w-4xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Sliding Container */}
        <div className={`flex h-full transition-transform duration-700 ease-in-out ${
          isSignUp ? '-translate-x-1/2' : 'translate-x-0'
        }`} style={{ width: '200%' }}>
          
          {/* Sign-In Layout (Default Position) */}
          <div className="w-1/2 flex h-full">
            {/* Welcome Panel */}
            <div className="w-1/2 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-16 left-16 w-24 h-24 bg-white rounded-full"></div>
                <div className="absolute bottom-20 right-12 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 h-full">
                {/* Logo */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">SAKAP</span>
                </div>
                
                <h1 className="text-3xl font-bold mb-4 leading-tight text-white">
                  Welcome Back!
                </h1>
                <p className="text-base mb-8 max-w-xs text-white/90">
                  To keep connected with us please login with your personal info
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={toggleMode}
                    variant="outline" 
                    className="px-6 py-2 text-sm transition-all duration-300 transform hover:scale-105 border-white/30 text-white hover:bg-white/10 bg-white text-primary hover:bg-white/90"
                  >
                    SIGN UP
                  </Button>
                </div>
              </div>
            </div>

            {/* Sign-In Form Panel */}
            <div className="w-1/2 bg-white">
              <div className="flex items-center justify-center h-full p-8">
                <div className="w-full max-w-sm">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-3 text-primary">
                      Sign In
                    </h2>
                    
                    {/* Social Login Buttons */}
                    <div className="flex justify-center space-x-3 mb-4">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-8 h-8 rounded-full transition-all duration-300 hover:scale-110 border-gray-200 hover:bg-gray-50 text-gray-600"
                      >
                        <Facebook className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-8 h-8 rounded-full transition-all duration-300 hover:scale-110 border-gray-200 hover:bg-gray-50 text-gray-600"
                      >
                        <Chrome className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-8 h-8 rounded-full transition-all duration-300 hover:scale-110 border-gray-200 hover:bg-gray-50 text-gray-600"
                      >
                        <Linkedin className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      or use your email for login:
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Select value={userType} onValueChange={setUserType} required>
                        <SelectTrigger className="h-10 rounded-lg text-sm border-gray-200 focus:border-primary bg-white">
                          <SelectValue placeholder="👤 Select your role" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="admin">ATI Administrator</SelectItem>
                          <SelectItem value="aew">Agricultural Extension Worker</SelectItem>
                          <SelectItem value="public">Farmer / Researcher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="📧 Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-10 rounded-lg text-sm border-gray-200 focus:border-primary bg-white"
                      />
                    </div>

                    <div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="🔒 Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-10 rounded-lg text-sm border-gray-200 focus:border-primary bg-white"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-10 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-primary to-accent text-white"
                    >
                      {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                    </Button>
                  </form>

                  <div className="text-center text-xs mt-4 text-gray-500">
                    <p>Demo: Use any email/password with your role</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign-Up Layout (Hidden by default, slides in) */}
          <div className="w-1/2 flex h-full">
            {/* Welcome Panel */}
            <div className="w-1/2 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-16 left-16 w-24 h-24 bg-white rounded-full"></div>
                <div className="absolute bottom-20 right-12 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
                {/* Logo */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">SAKAP</span>
                </div>
                
                <h1 className="text-3xl font-bold mb-6 leading-tight">
                  Join SAKAP<br />Caraga Region
                </h1>
                
                <div className="space-y-4 mb-8">
                  <p className="text-white/90 text-sm">
                    🌾 Connect with agricultural experts
                  </p>
                  <p className="text-white/90 text-sm">
                    📚 Access farming resources and guides
                  </p>
                  <p className="text-white/90 text-sm">
                    🤝 Join a community of farmers and researchers
                  </p>
                  <p className="text-white/90 text-sm">
                    📍 Covering all 5 provinces of Caraga Region
                  </p>
                </div>
                
                <div className="mt-8">
                  <Button 
                    onClick={toggleMode}
                    variant="outline" 
                    className="px-6 py-2 text-sm bg-white text-primary hover:bg-white/90 border-white"
                  >
                    Already have an account? Sign In
                  </Button>
                </div>
              </div>
            </div>

            {/* Sign-Up Form Panel */}
            <div className="w-1/2 bg-white">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="px-8 pt-8 pb-4">
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    Let's get started
                  </h2>
                  <p className="text-sm text-gray-600">
                    Create your SAKAP account to access agricultural resources
                  </p>
                </div>

                {/* Form Container */}
                <div className="flex-1 overflow-y-auto px-8 pb-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Selection */}
                    <div>
                      <Label htmlFor="userType" className="text-sm font-medium text-gray-700 mb-1 block">
                        User Type
                      </Label>
                      <Select value={userType} onValueChange={setUserType} required>
                        <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white">
                          <SelectValue placeholder="Select your role" />
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
                          placeholder="Enter your first name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
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
                          placeholder="Enter your last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
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
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white"
                      />
                    </div>

                    {/* Location Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="province" className="text-sm font-medium text-gray-700 mb-1 block">
                          Province
                        </Label>
                        <Select value={province} onValueChange={(value) => {
                          setProvince(value);
                          setMunicipality(''); // Clear municipality when province changes
                        }} required>
                          <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200 max-h-48 overflow-y-auto">
                            {provinces.map((prov) => (
                              <SelectItem key={prov} value={prov}>
                                {prov}
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
                          value={municipality} 
                          onValueChange={setMunicipality} 
                          required
                          disabled={!province}
                        >
                          <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white disabled:bg-gray-50 disabled:text-gray-400">
                            <SelectValue placeholder={province ? "Select municipality" : "Select province first"} />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200 max-h-48 overflow-y-auto">
                            {municipalities.map((muni) => (
                              <SelectItem key={muni} value={muni}>
                                {muni}
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
                          required
                          className="h-11 rounded-lg border-gray-300 focus:border-primary bg-white"
                        />
                      </div>
                    </div>

                    {/* Access Code Field - Only for Admin and AEW roles */}
                    {(userType === 'admin' || userType === 'aew') && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <Label htmlFor="accessCode" className="text-sm font-medium text-blue-900 mb-1 block">
                          Access Code
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="accessCode"
                          type="password"
                          placeholder="Enter your access code"
                          value={accessCode}
                          onChange={(e) => setAccessCode(e.target.value)}
                          required
                          className="h-11 rounded-lg border-blue-300 focus:border-blue-500 bg-white"
                        />
                        <p className="text-xs text-blue-700 mt-2">
                          {userType === 'admin' ? 'ATI Administrators require a valid access code' : 'AEWs require a valid access code'}
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 rounded-lg text-sm font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white transition-all duration-300"
                      >
                        {isLoading ? 'CREATING ACCOUNT...' : 'GET STARTED →'}
                      </Button>
                    </div>
                  </form>

                  {/* Demo Information */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Demo Access Codes:</p>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>• ATI Administrator: <code className="bg-white px-1 rounded">ATI2024ADMIN</code></p>
                        <p>• AEW: <code className="bg-white px-1 rounded">AEW2024ACCESS</code></p>
                      </div>
                      {(userType === 'admin' || userType === 'aew') && (
                        <p className="text-xs text-amber-600 mt-2 font-medium">⚠️ Access code required for this role</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home - Floating */}
      <Link to="/" className="absolute top-4 left-4 z-20">
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/80 backdrop-blur-sm border-gray-200 text-gray-600 hover:bg-white/90 transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="h-3 w-3 mr-1" />
          Home
        </Button>
      </Link>
    </div>
  );
};

export default Login;