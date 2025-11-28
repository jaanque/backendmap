import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Layers, ArrowLeft, Mail, CheckCircle, Lock, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'verify' | 'success'>('email');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError("Supabase not initialized");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError(error.message);
    } else {
      setStep('verify');
    }
    setLoading(false);
  };

  const handleVerifyAndUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Verify OTP
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      });

      if (verifyError) throw verifyError;

      if (!data.session) {
        throw new Error("Failed to establish session. Please try again.");
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setStep('success');
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white font-sans text-zinc-900 overflow-hidden">

      {/* Left Column: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative bg-white">
        <Link to="/login" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-zinc-900 hover:text-black transition-colors">
           <ArrowLeft className="w-5 h-5" /> <span className="hidden md:inline">Back to Login</span>
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900">Reset Password</h1>
            <p className="text-zinc-500 mt-3">
              {step === 'email' ? "Enter your email to receive a recovery code." :
               step === 'verify' ? "Enter the code sent to your email and your new password." :
               "Password reset successful."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg mb-6 text-center font-medium">
              {error}
            </div>
          )}

          {step === 'success' ? (
            <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-100 flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                 <CheckCircle size={24} />
               </div>
               <h3 className="font-bold text-lg mb-2">Password Updated</h3>
               <p className="text-sm opacity-80 mb-6">
                 Your password has been successfully reset. You can now login with your new credentials.
               </p>
               <Link to="/login" className="btn-pro btn-primary py-2.5 px-6 text-sm">
                 Continue to Login
               </Link>
            </div>
          ) : step === 'verify' ? (
            <form onSubmit={handleVerifyAndUpdate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Recovery Code (OTP)</label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 text-zinc-400 pointer-events-none">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-zinc-50/30"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">New Password</label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 text-zinc-400 pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-zinc-50/30"
                    placeholder="New password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 text-zinc-400 pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-zinc-50/30"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-pro btn-primary py-4 mt-4 text-base shadow-lg shadow-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 text-zinc-400 pointer-events-none">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-zinc-50/30"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-pro btn-primary py-4 mt-4 text-base shadow-lg shadow-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? 'Send Recovery Code' : 'Send Recovery Code'}
              </button>
            </form>
          )}

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
              "Security is not just a feature, it's the foundation of everything we build."
            </blockquote>
         </div>

         <img
           src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop"
           alt="Security Technology"
           className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
         />
      </div>
    </div>
  );
}
