import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AchievementProvider, useAchievements } from "@/hooks/useAchievements";
import AchievementNotification from "@/components/AchievementNotification";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Games from "./pages/Games";
import Profile from "./pages/Profile";
import Certificate from "./pages/Certificate";
import Dictionary from "./pages/Dictionary";
import DailyChallenge from "./pages/DailyChallenge";
import Leaderboard from "./pages/Leaderboard";
import TopikTest from "./pages/TopikTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AchievementOverlay = () => {
  const { currentAchievement, clearAchievement } = useAchievements();
  return (
    <AchievementNotification 
      achievement={currentAchievement} 
      onClose={clearAchievement} 
    />
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <AchievementProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AchievementOverlay />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/learn/:level" element={<Learn />} />
                <Route path="/games" element={<Games />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/certificate" element={<Certificate />} />
                <Route path="/dictionary" element={<Dictionary />} />
                <Route path="/daily-challenge" element={<DailyChallenge />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/topik" element={<TopikTest />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AchievementProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
