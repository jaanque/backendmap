import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { LogOut, User, ChevronDown } from 'lucide-react';
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
              className="flex items-center gap-2 hover:text-black transition-colors focus:outline-none"
            >
               <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 text-zinc-600">
                  <User size={16} />
               </div>
               <span className="hidden md:inline-block text-xs text-zinc-600 font-medium max-w-[150px] truncate">{user.email}</span>
               <ChevronDown size={14} className={`text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <div className="px-4 py-2 border-b border-zinc-100 md:hidden">
                  <p className="text-xs font-medium text-zinc-900 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-red-600 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
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
