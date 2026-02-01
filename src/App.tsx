import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SoundSettingsProvider } from "@/contexts/SoundSettingsContext";
import { AchievementProvider, useAchievements } from "@/hooks/useAchievements";
import AchievementNotification from "@/components/AchievementNotification";
import WelcomeModal from "@/components/WelcomeModal";
import Splash from "./pages/Splash";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Review from "./pages/Review";
import Games from "./pages/Games";
import Profile from "./pages/Profile";
import Certificate from "./pages/Certificate";
import Dictionary from "./pages/Dictionary";
import DailyChallenge from "./pages/DailyChallenge";
import Leaderboard from "./pages/Leaderboard";
import TopikTest from "./pages/TopikTest";
import Stories from "./pages/Stories";
import AIChat from "./pages/AIChat";
import Grammar from "./pages/Grammar";
import Pronunciation from "./pages/Pronunciation";
import Songs from "./pages/Songs";
import Reports from "./pages/Reports";
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
          <SoundSettingsProvider>
            <AchievementProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AchievementOverlay />
                <WelcomeModal />
                <Routes>
                  <Route path="/" element={<Splash />} />
                  <Route path="/home" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/learn/:level" element={<Learn />} />
                  <Route path="/review" element={<Review />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/certificate" element={<Certificate />} />
                  <Route path="/dictionary" element={<Dictionary />} />
                  <Route path="/daily-challenge" element={<DailyChallenge />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/topik" element={<TopikTest />} />
                  <Route path="/stories" element={<Stories />} />
                  <Route path="/ai-chat" element={<AIChat />} />
                  <Route path="/grammar" element={<Grammar />} />
                  <Route path="/pronunciation" element={<Pronunciation />} />
                  <Route path="/songs" element={<Songs />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </AchievementProvider>
          </SoundSettingsProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
