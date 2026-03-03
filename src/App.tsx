import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Particles from "@/components/Particles";
import UserInfoBar from "@/components/UserInfoBar";
import IntroScreen from "@/pages/IntroScreen";
import LoginScreen from "@/pages/LoginScreen";
import RoleScreen from "@/pages/RoleScreen";
import PairingScreen from "@/pages/PairingScreen";
import SetupScreen from "@/pages/SetupScreen";
import GameScreen from "@/pages/GameScreen";
import EndScreen from "@/pages/EndScreen";
import CompareScreen from "@/pages/CompareScreen";
import HistoryScreen from "@/pages/HistoryScreen";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <Particles />
          <UserInfoBar />
          <Routes>
            <Route path="/" element={<IntroScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/role" element={<RoleScreen />} />
            <Route path="/pairing" element={<PairingScreen />} />
            <Route path="/setup" element={<SetupScreen />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/end" element={<EndScreen />} />
            <Route path="/compare" element={<CompareScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
