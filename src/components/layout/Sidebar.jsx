import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Settings,
  MapPin,
  LogOut,
  Menu,
  X,
  Leaf,
  Heart,
  Wrench,
  BookOpen,
  User,
  Link as LinkIcon,
  Crown,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { useData } from '../../context/DataContext';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/financial-health', label: 'Financial Health', icon: Heart },
  { path: '/tools', label: 'Tools', icon: Wrench },
  { path: '/bank-linking', label: 'Link Bank', icon: LinkIcon, premium: true },
  { path: '/fee-analysis', label: 'Fee Analysis', icon: BarChart3, premium: true },
  { path: '/learning', label: 'Learning', icon: BookOpen },
  { path: '/intake', label: 'Intake Form', icon: ClipboardList },
  { path: '/report', label: 'Reports', icon: FileText },
  { path: '/nearby-banks', label: 'Nearby Banks', icon: MapPin },
  { path: '/pricing', label: 'Pricing', icon: Crown },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { subscription } = useData();
  const isPremium = subscription?.plan === 'premium';

  const handleLogout = () => {
    localStorage.removeItem('oliBranchLogin');
    navigate('/');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-card shadow-soft"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-56 bg-sidebar transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-sidebar-accent flex items-center justify-center shadow-glow">
              <Leaf className="h-5 w-5 text-sidebar" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-sidebar-foreground">
                Oli-Branch
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Financial Dashboard</p>
            </div>
          </div>

          {/* Subscription Badge */}
          {isPremium && (
            <div className="mb-4 px-2">
              <Badge className="w-full justify-center bg-accent text-accent-foreground gap-1">
                <Crown className="h-3 w-3" />
                Premium
              </Badge>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar shadow-glow"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.premium && !isPremium && (
                  <Crown className="h-3 w-3 text-accent" />
                )}
              </NavLink>
            ))}
          </nav>

          {/* Upgrade CTA for free users */}
          {!isPremium && (
            <div className="p-3 mb-2 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-xs text-sidebar-foreground mb-2">
                Unlock bank linking & fee analysis
              </p>
              <Button 
                size="sm" 
                className="w-full gap-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => { navigate('/pricing'); setIsOpen(false); }}
              >
                <Crown className="h-3 w-3" />
                Upgrade $9.99/mo
              </Button>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors mt-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
