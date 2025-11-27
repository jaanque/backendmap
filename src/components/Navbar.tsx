import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Highlight active link
  const isActive = (path: string) => location.pathname === path ? 'text-black font-semibold' : 'hover:text-black transition-colors';

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
          <div className="flex items-center gap-4">
             <span className="hidden md:inline-block text-xs text-zinc-400">{user.email}</span>
             <button onClick={signOut} className="flex items-center gap-2 hover:text-red-600 transition-colors" title="Sign Out">
                <LogOut size={16} />
                <span className="hidden md:inline">Sign Out</span>
             </button>
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
