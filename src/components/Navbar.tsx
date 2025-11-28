import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { LogOut, User, ChevronDown, Settings, CreditCard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Highlight active link
  const isActive = (path: string) => location.pathname === path ? 'text-black font-semibold' : 'hover:text-black transition-colors';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="border-b border-zinc-100 h-16 flex items-center justify-between px-6 md:px-12 sticky top-0 bg-white/90 backdrop-blur z-50">
      <Link to="/" className="font-bold text-xl tracking-tight flex items-center gap-2 text-zinc-900 hover:text-black transition-colors">
        BackendMap
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium text-zinc-500">
        <Link to="/explore" className={isActive('/explore')}>Explore Scenarios</Link>
        <Link to="/about" className={isActive('/about')}>About</Link>

        <div className="h-4 w-px bg-zinc-200 mx-2"></div>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:text-black transition-colors focus:outline-none group"
            >
               <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 text-zinc-600 group-hover:border-zinc-300 transition-colors">
                  <User size={16} />
               </div>
               <span className="hidden md:inline-block text-xs text-zinc-600 font-medium max-w-[150px] truncate group-hover:text-zinc-900">{user.email}</span>
               <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-zinc-600' : 'group-hover:text-zinc-600'}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-zinc-200 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] py-2 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-black/5">

                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-zinc-100 mb-1">
                  <p className="text-xs font-semibold text-zinc-900">Signed in as</p>
                  <p className="text-sm text-zinc-500 truncate mt-0.5">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 transition-colors cursor-not-allowed opacity-50">
                    <Settings size={16} className="text-zinc-400" />
                    Account Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 transition-colors cursor-not-allowed opacity-50">
                    <CreditCard size={16} className="text-zinc-400" />
                    Billing & Subscription
                  </button>
                </div>

                <div className="h-px bg-zinc-100 my-1 mx-2"></div>

                {/* Sign Out */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      signOut();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
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
