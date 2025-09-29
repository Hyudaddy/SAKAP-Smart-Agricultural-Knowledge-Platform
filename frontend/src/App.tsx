import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ELibrary from "./pages/ELibrary";
import Chatbot from "./pages/Chatbot";
import Activities from "./pages/Activities";
import News from "./pages/News";
import CreateArticle from "./pages/CreateArticle";
import ChatbotQA from "./pages/ChatbotQA";
import CreateQA from "./pages/CreateQA";
import UserManagement from "./pages/UserManagement";
import ManageELibrary from "./pages/ManageELibrary";
import CreateActivity from "./pages/CreateActivity";
import CreateLibraryContent from "./pages/CreateLibraryContent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<ELibrary />} />
          <Route path="/manage-library" element={<ManageELibrary />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/create-activity" element={<CreateActivity />} />
          <Route path="/create-library-content" element={<CreateLibraryContent />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/create" element={<CreateArticle />} />
          <Route path="/chatbot-qa" element={<ChatbotQA />} />
          <Route path="/create-qa" element={<CreateQA />} />
          <Route path="/users" element={<UserManagement />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;