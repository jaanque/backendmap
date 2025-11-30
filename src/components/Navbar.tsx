import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { getProfile } from '../lib/api';
import { LogOut, User, ChevronDown, Settings, CreditCard, Heart, Trophy, PlusSquare, ScrollText } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const createDropdownRef = useRef<HTMLDivElement>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  // Highlight active link
  const isActive = (path: string) => location.pathname === path ? 'text-black dark:text-white font-semibold' : 'hover:text-black dark:hover:text-white transition-colors';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target as Node)) {
        setIsCreateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user) {
      // Try to get name from metadata first (faster)
      const metaName = user.user_metadata?.full_name;
      if (metaName) {
        setDisplayName(metaName);
      } else {
        setDisplayName(user.email || null);
      }

      // Also fetch from profile to be sure/updated
      getProfile(user.id).then(profile => {
        if (profile && (profile.first_name || profile.last_name)) {
          const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
          if (name) setDisplayName(name);
        }
      });
    }
  }, [user]);

  return (
    <nav className="border-b border-zinc-100 dark:border-zinc-800 h-16 flex items-center justify-between px-6 md:px-12 sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur z-50 transition-colors duration-300" aria-label="Main Navigation">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-bold text-xl tracking-tight flex items-center gap-2 text-zinc-900 dark:text-white hover:text-black dark:hover:text-zinc-300 transition-colors" aria-label="BackendMap Home">
          BackendMap
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <Link to="/explore" className={isActive('/explore')}>Explore Scenarios</Link>
          <Link to="/users" className={isActive('/users')}>Community</Link>
          <Link to="/about" className={isActive('/about')}>About</Link>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="relative" ref={createDropdownRef}>
              <button
                onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors focus:outline-none"
              >
                <PlusSquare size={18} />
                <span>Create</span>
              </button>

              {/* Create Dropdown */}
              {isCreateDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg dark:shadow-none py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-black/5"
                  role="menu"
                >
                  <Link
                    to="/create"
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                    onClick={() => setIsCreateDropdownOpen(false)}
                  >
                    <PlusSquare size={16} className="text-zinc-400 dark:text-zinc-500" />
                    <span>New Scenario</span>
                  </Link>
                  <Link
                    to="/create-organization"
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                    onClick={() => setIsCreateDropdownOpen(false)}
                  >
                    <div className="w-4 h-4 rounded border-2 border-zinc-400 dark:border-zinc-500 flex items-center justify-center">
                        <span className="text-[8px] font-bold">O</span>
                    </div>
                    <span>New Organization</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors focus:outline-none group cursor-pointer"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
               <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-colors">
                  <User size={16} />
               </div>
               <span className="hidden lg:inline-block text-xs text-zinc-600 dark:text-zinc-300 font-medium max-w-[150px] truncate group-hover:text-zinc-900 dark:group-hover:text-white">{displayName || user.email}</span>
               <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-zinc-600 dark:text-zinc-300' : 'group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-3 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-none py-2 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-black/5"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >

                {/* User Info Header */}
                <Link
                  to="/me"
                  className="block px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group/header"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white group-hover/header:text-indigo-600 dark:group-hover/header:text-indigo-400 transition-colors">Signed in as</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{user.email}</p>
                </Link>

                {/* Menu Items - Section 1: Personal */}
                <div className="px-4 py-2 text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Personal</div>
                <div className="pb-1">
                  <Link
                    to="/me"
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User size={16} className="text-zinc-400 dark:text-zinc-500" />
                    My Profile
                  </Link>
                  {/* Mobile-only Create Scenario link since desktop has button */}
                  <Link
                    to="/create"
                    className="md:hidden w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <PlusSquare size={16} className="text-zinc-400 dark:text-zinc-500" />
                    Create Scenario
                  </Link>
                  <Link
                    to="/my-scenarios"
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <ScrollText size={16} className="text-zinc-400 dark:text-zinc-500" />
                    My Scenarios
                  </Link>
                  <Link
                    to="/favorites"
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Heart size={16} className="text-zinc-400 dark:text-zinc-500" />
                    Favorites
                  </Link>
                  <Link
                    to="/achievements"
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Trophy size={16} className="text-zinc-400 dark:text-zinc-500" />
                    Achievements
                  </Link>
                </div>

                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 mx-0"></div>

                {/* Menu Items - Section 2: Configuration */}
                <div className="px-4 py-2 text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Settings</div>
                <div className="pb-1">
                  <Link
                    to="/profile"
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings size={16} className="text-zinc-400 dark:text-zinc-500" />
                    Account Settings
                  </Link>
                  <button className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3 transition-colors cursor-not-allowed opacity-50">
                    <CreditCard size={16} className="text-zinc-400 dark:text-zinc-500" />
                    Billing & Subscription
                  </button>
                </div>

                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 mx-0"></div>

                {/* Sign Out */}
                <div className="py-1 pt-2">
                  <button
                    onClick={() => {
                      signOut();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-black transition-colors">Login</Link>
            <Link to="/register" className="btn-pro btn-primary px-4 py-2 text-xs text-white hover:text-white">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
