import { Link } from 'react-router-dom';
import { Github, Twitter, Layers } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="border-t border-zinc-100  bg-white  pt-16 pb-12 transition-colors duration-300">
      <div className="px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="font-bold text-lg tracking-tight flex items-center gap-2 text-zinc-900 ">
              <div className="w-6 h-6 bg-black  text-white  rounded flex items-center justify-center">
                <Layers className="w-3 h-3" />
              </div>
              BackendMap
            </Link>
            <p className="text-zinc-500  text-sm leading-relaxed">
              Interactive visualizations for complex backend architectures. Learn by seeing.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black  transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black  transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-zinc-900  mb-6 text-sm">Platform</h4>
            <ul className="space-y-3 text-sm text-zinc-500 ">
              <li><Link to="/" className="hover:text-black  transition-colors">Home</Link></li>
              <li><Link to="/explore" className="hover:text-black  transition-colors">Browse Scenarios</Link></li>
              <li><Link to="/about" className="hover:text-black  transition-colors">About & How it Works</Link></li>
              {!user && (
                <>
                  <li><Link to="/login" className="hover:text-black  transition-colors">Login</Link></li>
                  <li><Link to="/register" className="hover:text-black  transition-colors">Sign Up</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-zinc-900  mb-6 text-sm">Community</h4>
            <ul className="space-y-3 text-sm text-zinc-500 ">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black  transition-colors">GitHub Repository</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black  transition-colors">Contribute</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-100  pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-400  uppercase tracking-wider font-medium">
          <p>© 2025 BackendMap Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
