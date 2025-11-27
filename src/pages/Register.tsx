import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Supabase default is "Confirm Email" unless disabled.
      // Assuming auto-confirm or successful signup redirects to dashboard.
      // For simplicity, we navigate to login or show success message.
      // If email confirmation is off, user is logged in automatically.
       const { data: { session } } = await supabase.auth.getSession();
       if (session) {
         navigate('/');
       } else {
         // Email confirmation required
         setError("Registration successful! Please check your email to confirm your account.");
         setLoading(false);
       }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-zinc-900">Create Account</h1>
            <p className="text-zinc-500 text-sm mt-2">Join BackendMap to save your progress</p>
          </div>

          {error && (
            <div className={`text-sm p-3 rounded-lg mb-4 text-center ${error.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-pro btn-primary py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-zinc-900 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
