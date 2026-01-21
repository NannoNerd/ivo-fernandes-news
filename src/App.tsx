import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Auth from "./pages/Auth";
import CreateContent from "./pages/CreateContent";
import PostView from "./pages/PostView";
import VideoView from "./pages/VideoView";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ComingSoonCrypto from "./pages/ComingSoonCrypto";
import ComingSoonMusic from "./pages/ComingSoonMusic";
import ComingSoonMotivational from "./pages/ComingSoonMotivational";
import Engineering from "./pages/Engineering";
import AutoCADCivil3D from "./pages/AutoCADCivil3D";
import Motivacional from "./pages/Motivacional";
import Criptomoedas from "./pages/Criptomoedas";
import Noticias from "./pages/Noticias";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/auth" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <Auth />
                  </main>
                } 
              />
              <Route 
                path="/create" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <CreateContent />
                  </main>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <Profile />
                  </main>
                } 
              />
              <Route 
                path="/profile/settings" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <Settings />
                  </main>
                } 
              />
              <Route 
                path="/post/:slug" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <PostView />
                  </main>
                } 
              />
              <Route 
                path="/video/:slug" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <VideoView />
                  </main>
                } 
              />
              <Route 
                path="/crypto" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <ComingSoonCrypto />
                  </main>
                } 
              />
              <Route 
                path="/music" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <ComingSoonMusic />
                  </main>
                } 
              />
              <Route 
                path="/motivational" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <ComingSoonMotivational />
                  </main>
                } 
              />
              <Route 
                path="/engineering" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <Engineering />
                  </main>
                } 
              />
              <Route 
                path="/autocad-civil-3d" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <AutoCADCivil3D />
                  </main>
                } 
              />
              <Route 
                path="/motivacional" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <Motivacional />
                  </main>
                } 
              />
              <Route 
                path="/criptomoedas" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <Criptomoedas />
                  </main>
                } 
              />
              <Route 
                path="/noticias" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <Noticias />
                  </main>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route 
                path="*" 
                element={
                  <main className="container mx-auto max-w-7xl px-4">
                    <NotFound />
                  </main>
                } 
              />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
