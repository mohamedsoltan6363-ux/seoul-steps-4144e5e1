import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SoundSettingsProvider } from "@/contexts/SoundSettingsContext";
import { AchievementProvider, useAchievements } from "@/hooks/useAchievements";
import AchievementNotification from "@/components/AchievementNotification";
import WelcomeModal from "@/components/WelcomeModal";
import MobileBottomNav from "@/components/MobileBottomNav";
import AIChatButton from "@/components/AIChatButton";
import HomePage from "./pages/HomePage";
import Onboarding from "./pages/Onboarding";
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
import KoreanSeries from "./pages/KoreanSeries";
import Reports from "./pages/Reports";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

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

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Show AI Chat button only on dashboard pages
const ConditionalAIChatButton = () => {
  const { pathname } = useLocation();
  const showOnPaths = ['/dashboard', '/explore', '/games', '/profile', '/leaderboard', '/grammar', '/pronunciation', '/dictionary', '/reports', '/songs', '/korean-series'];
  
  if (!showOnPaths.some(path => pathname.startsWith(path))) return null;
  
  return <AIChatButton />;
};

const App = () => {
  useEffect(() => {
    const developerMessage = `
%c
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║                  %c محمد أيمن %c                                 ║
║                                                                ║
║               %cتم التطوير بواسطة محمد أيمن%c                      ║
║                                                                ║
║                 Development Started: January 7                ║
║                 Development Completed: February 8             ║
║                                                                ║
║                   Seoul Steps - Korean Learning               ║
║                         Version 1.0.0                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`;

    console.log(
      developerMessage,
      'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;',
      'font-size: 32px; font-weight: bold; color: #fff; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);',
      '',
      'font-size: 18px; font-style: italic; color: #667eea; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);',
      ''
    );
  }, []);

  return (
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
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/explore" element={<Explore />} />
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
                  <Route path="/korean-series" element={<KoreanSeries />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <MobileBottomNav />
                <ConditionalAIChatButton />
              </TooltipProvider>
            </AchievementProvider>
          </SoundSettingsProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </BrowserRouter>
  );
};

export default App;
