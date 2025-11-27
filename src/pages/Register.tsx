import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { CheckCircle, Zap, Shield, Layers, ArrowLeft } from 'lucide-react';

export default function Register() {
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
    <div className="h-screen w-full flex bg-white font-sans text-zinc-900 overflow-hidden">

      {/* Left Column: Advantages */}
      <div className="hidden md:flex w-1/2 bg-zinc-50 flex-col justify-center p-16 lg:p-24 relative border-r border-zinc-100">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-zinc-900 hover:text-black transition-colors">
          <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          BackendMap
        </Link>

        <div className="max-w-md">
           <h2 className="text-4xl font-bold text-zinc-900 mb-6 leading-tight">Join the community of backend architects.</h2>
           <p className="text-zinc-500 text-lg mb-12">Master modern system design with interactive visualizations and real-world scenarios.</p>

           <ul className="space-y-8">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                   <CheckCircle className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg">Track Your Progress</h3>
                  <p className="text-zinc-500 leading-relaxed">Save completed scenarios and visualize your learning journey over time.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                   <Zap className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg">Exclusive Scenarios</h3>
                  <p className="text-zinc-500 leading-relaxed">Access advanced architectural patterns and complex system designs.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                   <Shield className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg">Community Access</h3>
                  <p className="text-zinc-500 leading-relaxed">Join a community of developers and share your own insights.</p>
                </div>
              </li>
            </ul>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative bg-white">
        <Link to="/" className="absolute top-8 left-8 md:hidden flex items-center gap-2 font-bold text-zinc-900">
           <ArrowLeft className="w-5 h-5" /> Back
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-zinc-900">Create Account</h1>
            <p className="text-zinc-500 mt-3">Get started for free. No credit card required.</p>
          </div>

          {error && (
            <div className={`text-sm p-4 rounded-lg mb-6 text-center font-medium ${error.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
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
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-zinc-50/30"
                placeholder="Create a password (min. 6 chars)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-pro btn-primary py-4 mt-4 text-base shadow-lg shadow-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-10 text-center text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-zinc-900 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
