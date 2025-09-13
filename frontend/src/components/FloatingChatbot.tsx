import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Bot, User, ExternalLink, Pause, Square, MicOff, MessageCircle, X, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  references?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

interface FloatingChatbotProps {
  className?: string;
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sakap-language') || 'en';
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
  // Function to get welcome message in selected language
  const getWelcomeMessage = (lang: string) => {
    const messages = {
      en: "Hello! I'm SAKAP Agricultural Expert with 25+ years of farming experience. I can help you with crop production, farm management, livestock care, pest control, irrigation, organic farming, and agricultural business planning. What farming challenge can I help you solve today?",
      tl: "Kumusta! Ako si SAKAP Agricultural Expert na may 25+ taong karanasan sa farming. Makakatulong ako sa produksyon ng pananim, farm management, pag-aalaga ng hayop, pest control, irigasyon, organic farming, at agricultural business planning. Anong farming challenge ang matutulong ko sa inyo ngayon?",
      ceb: "Kumusta! Ako si SAKAP Agricultural Expert nga naa 25+ ka tuig nga kasinatian sa farming. Makatabang ko sa produksyon sa tanom, farm management, pag-atiman sa hayop, pest control, irigasyon, organic farming, ug agricultural business planning. Unsa nga farming challenge ang makatabang nako karon?"
    };
    return messages[lang as keyof typeof messages] || messages.en;
  };

  const [messages, setMessages] = useState<Message[]>([]);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([{
      id: 1,
      text: getWelcomeMessage(language),
      sender: 'bot',
      timestamp: new Date(),
    }]);
  }, [language]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const initializeSpeechRecognition = async () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        console.log('Speech Recognition API available');
        setSpeechSupported(true);
        
        // Check microphone permission
        try {
          if (navigator.permissions) {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            setMicPermission(permissionStatus.state);
            
            permissionStatus.onchange = () => {
              setMicPermission(permissionStatus.state);
            };
          }
        } catch (error) {
          console.log('Permission API not available, will check during usage');
        }
        
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';
        recognitionInstance.maxAlternatives = 1;

        recognitionInstance.onstart = () => {
          console.log('🎤 Speech recognition started');
          setIsListening(true);
        };

        recognitionInstance.onresult = (event: any) => {
          console.log('📝 Speech recognition result received:', event);
          if (event.results && event.results.length > 0) {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            console.log(`Transcript: "${transcript}" (confidence: ${confidence})`);
            setInputMessage(transcript);
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('❌ Speech recognition error:', event.error);
          setIsListening(false);
          
          let errorMessage = '';
          switch (event.error) {
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please allow microphone permissions in your browser settings.';
              setMicPermission('denied');
              break;
            case 'no-speech':
              errorMessage = 'No speech detected. Please try speaking more clearly.';
              break;
            case 'audio-capture':
              errorMessage = 'No microphone found. Please check your microphone connection.';
              break;
            case 'network':
              errorMessage = 'Network error occurred. Please check your internet connection.';
              break;
            case 'aborted':
              return;
            default:
              errorMessage = `Speech recognition error: ${event.error}`;
          }
          
          if (errorMessage) {
            alert(errorMessage);
          }
        };

        recognitionInstance.onend = () => {
          console.log('🔚 Speech recognition ended');
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        console.warn('❌ Speech recognition not supported in this browser');
        setSpeechSupported(false);
      }
    };
    
    initializeSpeechRecognition();
  }, []);

  const predefinedResponses: Record<string, { text: string; references?: Array<{title: string; url: string; type: string}> }> = {
    'rice': {
      text: "Rice farming requires proper water management, pest control, and nutrient management. Key practices include maintaining 2-5cm water depth during vegetative growth, using certified seeds, and integrated pest management. Here are some helpful resources:",
      references: [
        { title: "Rice Farming Best Practices Guide", url: "/library", type: "PDF" },
        { title: "Water Management Training Video", url: "/library", type: "Video" }
      ]
    },
    'pest': {
      text: "Integrated Pest Management (IPM) is crucial for sustainable farming. This includes biological control, cultural practices, and selective pesticide use. Monitor your crops regularly and identify pests early for effective control.",
      references: [
        { title: "Crop Disease Identification Audio Guide", url: "/library", type: "Audio" },
        { title: "Rice Farming Best Practices Guide", url: "/library", type: "PDF" }
      ]
    },
    'organic': {
      text: "Organic farming focuses on natural methods without synthetic chemicals. Key principles include composting, crop rotation, biological pest control, and maintaining soil health through natural fertilizers.",
      references: [
        { title: "Organic Farming Research Study", url: "/library", type: "PDF" },
        { title: "Sustainable Agriculture Webinar Series", url: "/library", type: "Video" }
      ]
    },
    'irrigation': {
      text: "Efficient irrigation systems save water and improve crop yields. Consider drip irrigation for water conservation, proper scheduling based on crop needs, and soil moisture monitoring.",
      references: [
        { title: "Water Management Training Video", url: "/library", type: "Video" },
        { title: "Rice Farming Best Practices Guide", url: "/library", type: "PDF" }
      ]
    },
    'livestock': {
      text: "Proper livestock management includes regular health checkups, balanced nutrition, clean housing, and vaccination schedules. Disease prevention is more cost-effective than treatment.",
      references: [
        { title: "Livestock Care Handbook", url: "/library", type: "PDF" }
      ]
    }
  };
  
  const formatGeminiResponse = (text: string): string => {
    return text
      // Convert **bold** to proper format for display
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Add proper line breaks after sections
      .replace(/\* \*\*(.*?)\*\*/g, '\n• $1')
      // Format bullet points
      .replace(/\* /g, '• ')
      // Add spacing after numbered sections
      .replace(/(\d+\.\s)/g, '\n$1')
      // Clean up multiple line breaks
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim();
  };

  // Function to check if the question is agriculture-related
  const isAgricultureRelated = (message: string): boolean => {
    const agricultureKeywords = [
      'farm', 'farming', 'agriculture', 'agricultural', 'crop', 'crops', 'plant', 'plants', 'seed', 'seeds',
      'rice', 'corn', 'wheat', 'vegetable', 'fruit', 'harvest', 'planting', 'irrigation', 'water',
      'soil', 'fertilizer', 'compost', 'organic', 'pest', 'disease', 'livestock', 'cattle', 'pig',
      'chicken', 'goat', 'animal', 'feed', 'nutrition', 'weather', 'season', 'climate', 'greenhouse',
      'tractor', 'tool', 'equipment', 'machinery', 'cultivation', 'rotation', 'yield', 'production',
      'sustainable', 'ecology', 'environment', 'pesticide', 'herbicide', 'fungicide', 'insecticide',
      'biosecurity', 'quarantine', 'veterinary', 'breeding', 'genetics', 'variety', 'hybrid',
      'extension', 'aew', 'agricultural extension worker', 'farmer', 'rural', 'agribusiness',
      'cooperative', 'market', 'price', 'subsidy', 'loan', 'credit', 'insurance', 'sakap'
    ];
    
    const lowerMessage = message.toLowerCase();
    return agricultureKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Function to get non-agricultural response in selected language
  const getNonAgricultureResponse = (lang: string) => {
    const responses = {
      en: "I'm SAKAP Assistant, specialized in agricultural topics. I can only help with farming, livestock, crops, irrigation, pest management, soil health, and other agricultural questions. Please ask me something related to agriculture!",
      tl: "Ako si SAKAP Assistant, dalubhasa sa mga paksa ng agrikultura. Makakatulong lang ako sa farming, livestock, mga pananim, irigasyon, pest management, kalusugan ng lupa, at iba pang tanong tungkol sa agrikultura. Magtanong po kayo tungkol sa agrikultura!",
      ceb: "Ako si SAKAP Assistant, eksperto sa mga butang mahitungod sa agrikultura. Makatabang ra ko sa farming, livestock, mga tanom, irigasyon, pest management, kahimsog sa yuta, ug uban pang pangutana mahitungod sa agrikultura. Pangutana mo ko mahitungod sa agrikultura!"
    };
    return responses[lang as keyof typeof responses] || responses.en;
  };

  const getBotResponse = async (userMessage: string): Promise<{ text: string; references?: Array<{title: string; url: string; type: string}> }> => {
    // Check if the question is agriculture-related first
    if (!isAgricultureRelated(userMessage)) {
      return {
        text: getNonAgricultureResponse(language),
        references: [
          { title: "Agricultural Resources in E-Library", url: "/library", type: "Info" }
        ]
      };
    }

    // Add thinking delay (minimum 1 second, maximum 3 seconds based on mode)
    const thinkingDelay = isOnlineMode ? 2000 + Math.random() * 1000 : 1000 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, thinkingDelay));
    
    if (isOnlineMode) {
      // Enhanced Gemini API integration with Expert Farmer personality
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = import.meta.env.VITE_GEMINI_API_URL;
        
        if (!apiKey || apiKey === 'your_api_key_here') {
          throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
        }
        
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              // Build conversation history for context
              ...messages
                .filter(msg => msg.text !== "thinking" && msg.sender !== 'bot' || (msg.sender === 'bot' && msg.text !== "thinking"))
                .slice(-6) // Keep last 6 messages (3 user + 3 bot pairs) for context
                .map(msg => ({
                  role: msg.sender === 'user' ? 'user' : 'model',
                  parts: [{ text: msg.text }]
                })),
              // Enhanced system prompt with expert farmer personality
              {
                role: 'user',
                parts: [{
                  text: `You are SAKAP Agricultural Expert, a seasoned Filipino farmer and agricultural manager with 25+ years of hands-on experience. You combine traditional farming wisdom with modern agricultural science to help farmers, Agricultural Extension Workers (AEW), and ATI administrators succeed.

🌾 YOUR EXPERTISE INCLUDES:
• **Farming Operations**: Crop production, livestock management, soil health, irrigation, pest control
• **Farm Management**: Business planning, resource optimization, cost management, profit maximization  
• **Technology Integration**: Modern equipment, digital tools, precision agriculture
• **Sustainability**: Organic farming, climate adaptation, environmental conservation
• **Market Intelligence**: Pricing, marketing strategies, value chains, cooperatives
• **Problem Solving**: Practical solutions for real-world farming challenges
• **Extension Services**: Training, capacity building, knowledge transfer

🎯 YOUR COMMUNICATION STYLE:
• Share practical, actionable advice based on real experience
• Use Filipino farming examples and local context
• Offer both traditional and modern solutions
• Provide step-by-step guidance
• Include cost considerations and resource requirements
• Suggest alternative approaches when possible
• Be encouraging and supportive

🌱 TARGET AUDIENCE AWARENESS:
• **Farmers**: Focus on practical implementation, cost-effectiveness, yield improvement
• **AEWs**: Provide extension-ready information, training materials, community solutions
• **ATI Admins**: Include policy implications, scaling strategies, program development

IMPORTANT RULES:
✅ ONLY respond to agriculture, farming, livestock, rural development, and related topics
✅ Pay attention to conversation history for context
✅ Provide specific, actionable recommendations
✅ Include local Filipino farming practices when relevant
✅ Suggest both immediate and long-term solutions
❌ Politely decline non-agricultural questions and redirect to farming topics

Please respond in ${language === 'tl' ? 'Tagalog' : language === 'ceb' ? 'Cebuano' : 'English'}.

User question: ${userMessage}`
                }]
              }
            ],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.9,
              maxOutputTokens: 1024
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Gemini API Response:', data);
        
        // Extract response from Gemini
        const rawBotText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
          "I'm having trouble generating a response right now. Please try again.";

        // Format the response for better readability
        const formattedText = formatGeminiResponse(rawBotText);

        return {
          text: formattedText,
          references: [
            { title: "Expert Agricultural Guidance", url: "/library", type: "Expert" },
            { title: "SAKAP Resources & Training", url: "/library", type: "Training" }
          ]
        };
      } catch (error) {
        console.error('Gemini API Error:', error);
        
        let errorMessage = "I'm having trouble connecting to the AI service. ";
        
        if (error instanceof Error) {
          if (error.message.includes('401')) {
            errorMessage += "Invalid API key. Please check your Gemini API configuration.";
          } else if (error.message.includes('400')) {
            errorMessage += "Invalid request format. Please try rephrasing your question.";
          } else if (error.message.includes('403')) {
            errorMessage += "API access denied. Please check your API key permissions.";
          } else if (error.message.includes('429')) {
            errorMessage += "API rate limit exceeded. Please try again in a moment.";
          } else if (error.message.includes('not configured')) {
            errorMessage = error.message;
          } else {
            errorMessage += "Please check your internet connection or try again later.";
          }
        }
        
        return {
          text: errorMessage
        };
      }
    } else {
      // Enhanced offline responses with expert farmer knowledge
      const message = userMessage.toLowerCase();
      
      // Enhanced predefined responses with expert farmer advice
      const expertResponses: Record<string, { text: string; references?: Array<{title: string; url: string; type: string}> }> = {
        'rice': {
          text: `🌾 **Rice Farming Expert Advice:**

**For Small-Scale Farmers (1-3 hectares):**
• Use certified seeds (RC222, PSB RC18) - invest ₱3,000-4,000/ha for 20% yield boost
• Maintain 2-5cm water depth during vegetative stage, drain during flowering
• Apply fertilizer in 3 splits: basal (14-14-14), tillering (urea), panicle initiation (complete)

**Management Tips:**
• Scout fields weekly for pests (stem borer, brown planthopper)
• Use light traps to monitor pest population
• Practice direct seeding to reduce labor costs by 30%
• Form cooperatives for bulk input purchasing (save 15-20% on costs)

**Expected Returns:** ₱40,000-60,000 net income per hectare with proper management.`,
          references: [
            { title: "Rice Production Guide", url: "/library", type: "Manual" },
            { title: "Integrated Pest Management", url: "/library", type: "Training" }
          ]
        },
        'pest': {
          text: `🐛 **Integrated Pest Management (IPM) Strategy:**

**Prevention First (70% of success):**
• Use resistant varieties when available
• Maintain field sanitation - remove crop residues
• Establish biodiversity strips around fields
• Monitor using pheromone traps (₱200 each, covers 1 hectare)

**Biological Control:**
• Release Trichogramma wasps for stem borer control
• Use Bt spray for caterpillar pests
• Encourage beneficial insects with flowering plants

**Chemical Control (Last Resort):**
• Apply only when economic threshold is reached
• Rotate active ingredients to prevent resistance
• Use recommended dosages - more is not better

**Cost-Effective Tip:** IPM reduces pesticide costs by 40-60% while maintaining yields.`,
          references: [
            { title: "Field Scouting Guide", url: "/library", type: "Training" },
            { title: "Beneficial Insects Handbook", url: "/library", type: "Reference" }
          ]
        },
        'organic': {
          text: `🌱 **Organic Farming Transition Guide:**

**Year 1-2 (Transition Period):**
• Start composting: 2 tons/hectare of quality compost annually
• Reduce chemical inputs by 50% gradually
• Plant nitrogen-fixing cover crops (mongo, peanut)
• Expect 10-20% yield reduction initially

**Soil Building:**
• Use vermicomposting for high-quality organic matter
• Apply organic fertilizers: chicken manure (3 tons/ha), rice hull ash
• Test soil pH annually (target: 6.0-7.0)

**Market Opportunities:**
• Premium prices: 30-50% higher than conventional
• Target local organic markets, restaurants
• Consider certification after 3 years (₱15,000-25,000 cost)

**Success Factors:** Patience, soil health focus, and market development are key!`,
          references: [
            { title: "Organic Certification Guide", url: "/library", type: "Manual" },
            { title: "Composting Techniques", url: "/library", type: "Video" }
          ]
        },
        'irrigation': {
          text: `💧 **Smart Irrigation Management:**

**Water-Saving Techniques:**
• Alternate Wetting and Drying (AWD) - saves 30% water, same yield
• Use field water tubes to monitor water level
• Install simple drip systems for high-value crops (₱8,000-12,000/ha)

**Scheduling Tips:**
• Early morning irrigation (5-7 AM) reduces evaporation by 40%
• Check soil moisture 6 inches deep before watering
• Group crops by water needs for efficient management

**Infrastructure Investment:**
• Solar-powered pumps: ₱80,000-120,000 (payback: 3-4 years)
• Community irrigation systems reduce individual costs
• Rainwater harvesting: simple but effective for dry seasons

**ROI:** Efficient irrigation increases yields by 25-40% while reducing costs.`,
          references: [
            { title: "Water Management Systems", url: "/library", type: "Technical" },
            { title: "Solar Irrigation Guide", url: "/library", type: "Investment" }
          ]
        },
        'livestock': {
          text: `🐄 **Livestock Management Excellence:**

**Health Management:**
• Vaccination schedule: Follow DA-recommended calendar strictly
• Deworming every 3-4 months or based on fecal egg count
• Maintain health records for each animal
• Partner with veterinarian for monthly check-ups

**Nutrition Program:**
• Forage-based feeding: 60-70% of diet from pasture/cut grass
• Supplement with concentrate: 1-2% of body weight
• Provide clean water: 30-50 liters per cow daily
• Use locally available feeds: rice bran, copra meal

**Housing & Comfort:**
• Provide 15-20 sq meters per large animal
• Ensure good ventilation and drainage
• Use locally available materials to reduce costs

**Business Tip:** Keep detailed records - successful farmers track feed costs, milk production, and breeding dates!`,
          references: [
            { title: "Livestock Health Calendar", url: "/library", type: "Schedule" },
            { title: "Feed Formulation Guide", url: "/library", type: "Technical" }
          ]
        },
        'management': {
          text: `📊 **Farm Management Best Practices:**

**Financial Management:**
• Keep detailed records: income, expenses, labor costs
• Use simple accounting: notebook or mobile apps
• Plan cash flow: align income with major expenses
• Set aside 10-15% for emergency fund

**Resource Optimization:**
• Share equipment with neighbors (reduce costs by 40%)
• Buy inputs in bulk through cooperatives
• Time operations to reduce labor peaks
• Multi-crop to spread risk and maximize land use

**Technology Adoption:**
• Start with simple tools: soil test kits, pH meters
• Use weather apps for planning operations
• Consider precision tools as farm grows

**Key Performance Indicators:**
• Cost per kilogram of produce
• Net profit per hectare
• Labor efficiency (hours per task)
• Input use efficiency

**Success Secret:** Plan each season 6 months in advance!`,
          references: [
            { title: "Farm Business Planning", url: "/library", type: "Business" },
            { title: "Record Keeping Templates", url: "/library", type: "Tools" }
          ]
        }
      };
      
      // Check for enhanced keywords
      for (const [keyword, response] of Object.entries(expertResponses)) {
        if (message.includes(keyword)) {
          return response;
        }
      }

      // Check for management-related keywords
      if (message.includes('manage') || message.includes('business') || message.includes('profit') || message.includes('cost')) {
        return expertResponses['management'];
      }

      return {
        text: getEnhancedDefaultResponse(language)
      };
    }
  };

  // Enhanced default response function
  const getEnhancedDefaultResponse = (lang: string) => {
    const responses = {
      en: `🌾 **Hello! I'm your Agricultural Expert & Farm Manager!**

I have 25+ years of farming experience and I'm here to help you succeed! I can assist with:

🚜 **Farm Operations:** Crop production, livestock care, soil management
📊 **Farm Business:** Planning, budgeting, profit optimization
🌱 **Sustainable Practices:** Organic farming, IPM, resource conservation  
💡 **Problem Solving:** Practical solutions for real farming challenges
📈 **Technology:** Modern tools, precision agriculture, market strategies

**What farming challenge can I help you solve today?**`,
      tl: `🌾 **Kumusta! Ako ang inyong Agricultural Expert at Farm Manager!**

May 25+ taong karanasan sa farming at handang tumulong sa inyong tagumpay! Makakatulong ako sa:

🚜 **Farm Operations:** Produksyon ng pananim, pag-aalaga ng hayop, soil management
📊 **Farm Business:** Planning, budgeting, profit optimization
🌱 **Sustainable Practices:** Organic farming, IPM, conservation
💡 **Problem Solving:** Praktical na solusyon sa farming problems
📈 **Technology:** Modern tools, precision agriculture, market strategies

**Anong farming challenge ang matutulong ko sa inyo ngayon?**`,
      ceb: `🌾 **Kumusta! Ako ang inyong Agricultural Expert ug Farm Manager!**

Naa koy 25+ ka tuig nga kasinatian sa farming ug andam nga motabang sa inyong kalampusan! Makatabang ko sa:

🚜 **Farm Operations:** Produksyon sa tanom, pag-atiman sa hayop, soil management
📊 **Farm Business:** Planning, budgeting, profit optimization  
🌱 **Sustainable Practices:** Organic farming, IPM, conservation
💡 **Problem Solving:** Praktikal nga solusyon sa farming nga mga problema
📈 **Technology:** Modern tools, precision agriculture, market strategies

**Unsa nga farming challenge ang makatabang nako karon?**`
    };
    return responses[lang as keyof typeof responses] || responses.en;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsThinking(true);

    // Show thinking indicator
    const thinkingMessage: Message = {
      id: messages.length + 2,
      text: "thinking",
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const botResponseData = await getBotResponse(currentInput);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponseData.text,
        sender: 'bot',
        timestamp: new Date(),
        references: botResponseData.references,
      };

      // Replace thinking message with actual response
      setMessages(prev => prev.slice(0, -1).concat(botMessage));
    } catch (error) {
      // Handle error case
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => prev.slice(0, -1).concat(errorMessage));
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleVoiceInput = async () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    if (!recognition) {
      alert('Speech recognition is not initialized. Please refresh the page and try again.');
      return;
    }

    if (isListening) {
      console.log('🛑 Stopping speech recognition...');
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setIsListening(false);
      }
      return;
    }

    try {
      console.log('🎤 Starting speech recognition...');
      
      // Test microphone access first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('✅ Microphone access granted');
          setMicPermission('granted');
          
          // Stop the test stream
          stream.getTracks().forEach(track => track.stop());
        } catch (permissionError) {
          console.error('❌ Microphone permission denied:', permissionError);
          setMicPermission('denied');
          alert('Microphone access is required for voice input. Please allow microphone access in your browser and try again.');
          return;
        }
      }
      
      // Start speech recognition
      recognition.start();
      console.log('✅ Speech recognition start command sent');
      
    } catch (error) {
      console.error('❌ Error starting speech recognition:', error);
      setIsListening(false);
      alert('Failed to start voice recognition. Please try again.');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop current speech if any
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        setSpeechUtterance(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeechUtterance(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeechUtterance(null);
      };
      
      setSpeechUtterance(utterance);
      speechSynthesis.speak(utterance);
    }
  };

  const pauseResumeSpeech = () => {
    if ('speechSynthesis' in window) {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        speechSynthesis.pause();
      }
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechUtterance(null);
    }
  };

  const quickQuestions = [
    "Farm management tips?",
    "Rice pest control?", 
    "Organic farming?",
    "Irrigation systems?",
    "Livestock care?"
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex flex-col items-end ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 mb-2 shadow-lg border border-primary/20 order-first">
          {/* Main Chat Card */}
          <Card className="border-b-0 rounded-b-none border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between py-2 px-3 border-b bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">SAKAP Expert</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {isOnlineMode ? 'AI Mode' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                  className="h-6 w-6 p-0"
                >
                  <Settings className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>

          {/* Settings Panel */}
          {showSettings && (
            <div className="px-3 py-2 border-b bg-muted/30 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="floating-ai-mode" className="text-xs">
                    {isOnlineMode ? 'Online' : 'Offline'}
                  </Label>
                  <Switch
                    id="floating-ai-mode"
                    checked={isOnlineMode}
                    onCheckedChange={setIsOnlineMode}
                  />
                </div>
                <Badge variant={isOnlineMode ? "default" : "secondary"} className="text-xs px-1 py-0">
                  {isOnlineMode ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>
          )}

            <CardContent className="flex flex-col p-0">
              {/* Messages Area */}
              <ScrollArea className="h-64 px-3 py-2">
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] flex gap-1.5 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          message.sender === 'user' ? 'bg-primary' : 'bg-accent'
                        }`}>
                          {message.sender === 'user' ? 
                            <User className="h-2.5 w-2.5 text-primary-foreground" /> : 
                            <Bot className="h-2.5 w-2.5 text-accent-foreground" />
                          }
                        </div>
                      
                      <div className={`rounded-lg px-2.5 py-1.5 ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {message.text === "thinking" ? (
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">Thinking...</span>
                          </div>
                        ) : (
                          <div className="text-xs leading-relaxed whitespace-pre-line">
                            {message.text.split('\n').map((line, index) => (
                              <div key={index} className={`${line.startsWith('•') ? 'ml-2 mb-1' : line.match(/^\d+\./) ? 'font-semibold mt-2 mb-1' : 'mb-1'}`}>
                                {line}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {message.references && message.text !== "thinking" && (
                          <div className="mt-1.5 space-y-1">
                            <Separator className="my-1" />
                            <p className="text-xs font-medium opacity-75">Resources:</p>
                            {message.references.map((ref, index) => (
                              <div key={index} className="flex items-center gap-1 text-xs">
                                <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                                  {ref.type}
                                </Badge>
                                <span className="flex-1 truncate text-xs">{ref.title}</span>
                                <Button size="sm" variant="ghost" className="h-3 w-3 p-0">
                                  <ExternalLink className="h-2 w-2" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {message.sender === 'bot' && message.text !== "thinking" && (
                          <div className="flex gap-1 mt-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => speakText(message.text)}
                              className="h-4 px-1 text-xs"
                            >
                              <Volume2 className="h-2 w-2 mr-0.5" />
                              {isSpeaking ? 'Stop' : 'Listen'}
                            </Button>
                            
                            {isSpeaking && speechUtterance && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={pauseResumeSpeech}
                                  className="h-4 px-1 text-xs"
                                >
                                  <Pause className="h-2 w-2 mr-0.5" />
                                  {speechSynthesis.paused ? 'Resume' : 'Pause'}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={stopSpeech}
                                  className="h-4 px-1 text-xs"
                                >
                                  <Square className="h-2 w-2 mr-0.5" />
                                  Stop
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                        
                        {message.text !== "thinking" && (
                          <div className="text-xs opacity-60 mt-0.5">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Quick Questions */}
            <div className="px-3 py-2 border-t bg-muted/10">
              <p className="text-xs font-medium mb-1.5">Quick Questions:</p>
              <div className="grid grid-cols-2 gap-1">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(question)}
                    className="text-xs h-5 px-1.5 truncate"
                    title={question}
                  >
                    {question.length > 15 ? question.substring(0, 12) + '...' : question}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Input Card */}
        <Card className="border-t-0 rounded-t-none border-primary/20">
          <CardContent className="p-3">
            <div className="flex gap-1.5">
              <div className="flex-1 relative">
                <Input
                  placeholder="Ask about agriculture..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-xs pr-6 h-7"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleVoiceInput}
                  disabled={!speechSupported}
                  className={`absolute right-0.5 top-1/2 -translate-y-1/2 h-5 w-5 p-0 ${
                    isListening ? 'text-destructive animate-pulse' : ''
                  } ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={
                    !speechSupported 
                      ? 'Speech recognition not supported in this browser' 
                      : micPermission === 'denied'
                      ? 'Microphone access denied - click to try again'
                      : isListening 
                      ? 'Click to stop listening' 
                      : 'Click to start voice input'
                  }
                >
                  {isListening ? <MicOff className="h-2.5 w-2.5" /> : <Mic className="h-2.5 w-2.5" />}
                </Button>
              </div>
              <Button onClick={handleSendMessage} size="sm" className="h-7 w-7 p-0">
                <Send className="h-2.5 w-2.5" />
              </Button>
            </div>

            {isListening && (
              <div className="text-center text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-destructive rounded-full animate-pulse"></div>
                Listening...
                <div className="w-1 h-1 bg-destructive rounded-full animate-pulse"></div>
              </div>
            )}
            
            {/* Compact Status Information */}
            {speechSupported && micPermission === 'denied' && (
              <div className="text-center text-xs text-amber-600 mt-1">
                ⚠️ Mic access denied
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )}

      {/* Floating Button - Always stays at bottom right */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full shadow-lg w-12 h-12 relative bg-primary hover:bg-primary/90 flex-shrink-0 border-2 border-white"
      >
        <MessageCircle className="h-5 w-5" />
        {!isOpen && messages.length > 1 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center border border-white">
            <span className="text-xs text-destructive-foreground font-bold">
              {messages.length - 1 > 9 ? '9+' : messages.length - 1}
            </span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default FloatingChatbot;