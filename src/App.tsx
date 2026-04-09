/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Droplets, 
  Sprout, 
  Bug, 
  TrendingUp, 
  Settings, 
  Bell, 
  Menu,
  X,
  Globe,
  CloudSun,
  Thermometer,
  Wind,
  Droplet,
  LogIn,
  LogOut,
  User,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Firebase
import { auth, db, OperationType, handleFirestoreError } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, query, where, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';

// Components
import Dashboard from './components/Dashboard';
import Irrigation from './components/Irrigation';
import CropRecommendation from './components/CropRecommendation';
import PestDetection from './components/PestDetection';
import MarketTrends from './components/MarketTrends';
import ImpactMetrics from './components/ImpactMetrics';
import Marketplace from './components/Marketplace';

// Types
import { Language } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
      if (user) {
        toast.success(`Welcome back, ${user.displayName || 'Farmer'}`);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'crops', label: 'Crops', icon: Sprout },
    { id: 'pests', label: 'Pest Detection', icon: Bug },
    { id: 'market', label: 'Market', icon: TrendingUp },
    { id: 'impact', label: 'Impact', icon: Globe },
  ];

  const translations = {
    en: { title: 'Smart Farming AI', welcome: 'Good Morning, Farmer' },
    te: { title: 'స్మార్ట్ ఫార్మింగ్ AI', welcome: 'శుభోదయం, రైతు' },
    hi: { title: 'स्मार्ट फार्मिंग AI', welcome: 'सुप्रभात, किसान' },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg earthy-gradient flex items-center justify-center">
            <Sprout className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg text-primary">{translations[language].title}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </header>

      {/* Sidebar / Navigation */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`fixed md:relative z-50 w-64 h-full bg-white border-r flex flex-col transition-all ${
              isSidebarOpen ? 'left-0' : '-left-64 md:left-0'
            }`}
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl earthy-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                  <Sprout className="text-white w-6 h-6" />
                </div>
                <h1 className="font-bold text-xl text-primary tracking-tight">SmartFarm</h1>
              </div>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-primary'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </button>
              ))}
            </nav>

            <div className="p-4 mt-auto border-t space-y-4">
              {user ? (
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User className="text-primary w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">{user.displayName}</p>
                    <button onClick={handleLogout} className="text-[10px] text-red-500 font-bold flex items-center gap-1 hover:underline">
                      <LogOut className="w-3 h-3" /> SIGN OUT
                    </button>
                  </div>
                </div>
              ) : (
                <Button onClick={handleLogin} className="w-full rounded-xl earthy-gradient gap-2">
                  <LogIn className="w-4 h-4" /> Sign In
                </Button>
              )}

              <div className="flex items-center justify-between px-2">
                <div className="flex gap-1">
                  {(['en', 'te', 'hi'] as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLanguage(l)}
                      className={`text-xs px-2 py-1 rounded-md transition-colors ${
                        language === l ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-primary">System Status</p>
                  <p className="text-[10px] text-muted-foreground">Online • 4 Sensors</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-6 bg-white/50 backdrop-blur-sm border-b">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{translations[language].welcome}</h2>
            <p className="text-muted-foreground text-sm">Here's what's happening on your farm today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6 px-6 py-2 bg-white rounded-2xl border shadow-sm">
              <div className="flex items-center gap-2">
                <CloudSun className="text-accent w-5 h-5" />
                <span className="font-semibold">30°C</span>
              </div>
              <div className="w-px h-4 bg-muted" />
              <div className="flex items-center gap-2">
                <Droplet className="text-blue-500 w-4 h-4" />
                <span className="font-semibold">60%</span>
              </div>
            </div>
            <Button variant="outline" size="icon" className="rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1 p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto pb-20 md:pb-0"
            >
              {activeTab === 'dashboard' && <Dashboard language={language} />}
              {activeTab === 'marketplace' && <Marketplace />}
              {activeTab === 'irrigation' && <Irrigation />}
              {activeTab === 'crops' && <CropRecommendation />}
              {activeTab === 'pests' && <PestDetection />}
              {activeTab === 'market' && <MarketTrends />}
              {activeTab === 'impact' && <ImpactMetrics />}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </main>

      <Toaster position="top-right" />
    </div>
  );
}
