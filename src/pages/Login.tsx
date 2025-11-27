import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Layers, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="h-screen w-full flex bg-white font-sans text-zinc-900 overflow-hidden">

      {/* Left Column: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative bg-white">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-zinc-900 hover:text-black transition-colors">
           <ArrowLeft className="w-5 h-5" /> <span className="hidden md:inline">Back to Home</span>
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900">Welcome back</h1>
            <p className="text-zinc-500 mt-3">Enter your credentials to access your account.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg mb-6 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-zinc-50/30"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-xs font-bold uppercase text-zinc-500">Password</label>
                 <a href="#" className="text-xs text-zinc-400 hover:text-black transition-colors">Forgot password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-zinc-50/30"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-pro btn-primary py-4 mt-4 text-base shadow-lg shadow-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center text-zinc-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-zinc-900 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Image */}
      <div className="hidden md:block w-1/2 bg-zinc-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 opacity-50 z-10"></div>
        {/* Abstract shapes or a placeholder image */}
         <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-[800px] h-[800px] border border-black rounded-full absolute -top-20 -right-20"></div>
            <div className="w-[600px] h-[600px] border border-black rounded-full absolute top-20 right-20"></div>
             <div className="w-[400px] h-[400px] border border-black rounded-full absolute top-40 right-40"></div>
         </div>

         <div className="absolute bottom-12 left-12 right-12 z-20">
            <blockquote className="text-2xl font-bold text-zinc-900 leading-tight mb-4">
              "BackendMap helped me visualize complex distributed systems in a way no textbook ever could."
            </blockquote>
            <cite className="not-italic text-zinc-500 font-medium">— Alex Chen, Senior Backend Engineer</cite>
         </div>

         <img
           src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
           alt="Abstract Technology"
           className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
         />
      </div>
    </div>
  );
}
