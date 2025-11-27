import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, Zap, Shield, Layers } from 'lucide-react';
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
       const { data: { session } } = await supabase.auth.getSession();
       if (session) {
         navigate('/');
       } else {
         setError("Registration successful! Please check your email to confirm your account.");
         setLoading(false);
       }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100">

          {/* Left Column: Advantages */}
          <div className="bg-zinc-50 p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-zinc-100">
            <div className="mb-8">
               <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
               </div>
               <h2 className="text-3xl font-bold text-zinc-900 mb-3">Join BackendMap</h2>
               <p className="text-zinc-500 text-lg">Master backend architecture with interactive visualizations.</p>
            </div>

            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-zinc-900">Track Your Progress</h3>
                  <p className="text-sm text-zinc-500">Save completed scenarios and visualize your learning journey.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-zinc-900">Exclusive Scenarios</h3>
                  <p className="text-sm text-zinc-500">Access advanced architectural patterns and complex system designs.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-zinc-900">Community Access</h3>
                  <p className="text-sm text-zinc-500">Join a community of developers and share your own insights.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Column: Registration Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900">Create Account</h1>
              <p className="text-zinc-500 text-sm mt-2">Get started for free. No credit card required.</p>
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
                  className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  placeholder="Create a password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-pro btn-primary py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-zinc-900 hover:underline">
                Sign in
              </Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
