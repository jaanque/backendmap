import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useToast } from '../lib/toast';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, Save, Loader2, Lock, Github, Link as LinkIcon } from 'lucide-react';
import { getProfile, updateProfile } from '../lib/api';

export default function Profile() {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [sex, setSex] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isGithubConnected, setIsGithubConnected] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }

    if (user) {
      // Check for GitHub identity
      const githubIdentity = user.identities?.find(id => id.provider === 'github');
      setIsGithubConnected(!!githubIdentity);

      getProfile(user.id)
        .then(profile => {
          if (profile) {
            setFirstName(profile.first_name || '');
            setLastName(profile.last_name || '');
            setGender(profile.gender || '');
            setSex(profile.sex || '');
          }
        })
        .catch(err => console.error('Error fetching profile:', err))
        .finally(() => setIsLoadingProfile(false));
    }
  }, [user, loading, navigate]);

  const handleConnectGithub = async () => {
     if (!supabase) return;
     const { error } = await supabase.auth.linkIdentity({ provider: 'github' });
     if (error) {
         console.error("Error linking GitHub", error);
         showToast(error.message || "Failed to link GitHub account", { type: 'error' });
     }
     // Redirect will happen automatically if successful initiation
  }

  const handleUnlinkGithub = async () => {
     if (!supabase || !user) return;

     // Safety check: ensure user has another way to login (password or another provider)
     // Identities contains all linked providers.
     const identities = user.identities || [];
     const hasPassword = identities.some(id => id.provider === 'email'); // 'email' provider usually implies password or magic link.
     const hasOtherProviders = identities.some(id => id.provider !== 'github');

     if (!hasPassword && !hasOtherProviders) {
         showToast("Cannot unlink GitHub as it is your only login method. Please set a password first.", { type: 'error' });
         return;
     }

     // Use window.confirm for simplicity as requested, but a modal would be better UI.
     if (window.confirm("Are you sure you want to disconnect your GitHub account? This will remove your ability to sign in with GitHub.")) {
        try {
            const githubIdentity = identities.find(id => id.provider === 'github');
            if (!githubIdentity) return;

            // In older versions of supabase-js unlinkIdentity takes UserIdentity
            // In newer versions it might take just the ID string, but TypeScript types suggest UserIdentity object in some versions.
            // Based on the error "Argument of type 'string' is not assignable to parameter of type 'UserIdentity'",
            // it seems the installed version expects the whole object.

            const { error } = await supabase.auth.unlinkIdentity(githubIdentity);
            if (error) throw error;

            setIsGithubConnected(false);
            showToast("GitHub account disconnected successfully", { type: 'success' });
        } catch (err: any) {
            console.error("Error unlinking GitHub", err);
            showToast(err.message || "Failed to disconnect GitHub account", { type: 'error' });
        }
     }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase) return;

    setIsSaving(true);
    try {
      // Update new profile table
      await updateProfile(user.id, {
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        sex: sex
      });

      // Also update full_name in metadata for backward compatibility if needed,
      // but let's prioritize the specific fields.
      // We can construct full name.
      await supabase.auth.updateUser({
        data: { full_name: `${firstName} ${lastName}`.trim() }
      });

      showToast('Profile updated successfully', { type: 'success' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showToast(error.message || 'Failed to update profile', { type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase) return;

    if (newPassword !== confirmPassword) {
       showToast("New passwords do not match", { type: 'error' });
       return;
    }

    setIsChangingPassword(true);

    try {
      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Incorrect current password");
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      showToast("Password updated successfully", { type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err: any) {
       console.error("Error changing password", err);
       showToast(err.message || "Failed to update password", { type: 'error' });
    } finally {
       setIsChangingPassword(false);
    }
  };

  if (loading || (user && isLoadingProfile)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 md:px-12 py-12 max-w-3xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Account Settings</h1>
          <p className="text-zinc-500 mt-2">Manage your profile and account preferences.</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
             <h2 className="font-semibold text-lg flex items-center gap-2">
                <User size={18} className="text-indigo-600" />
                Profile Information
             </h2>
          </div>

          <div className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="mt-1.5 text-xs text-zinc-400">
                    Your email address is managed by Supabase Auth and cannot be changed here.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name Field */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 mb-2">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                  />
                </div>

                {/* Last Name Field */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 mb-2">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Gender Field */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-zinc-700 mb-2">Gender (Optional)</label>
                  <input
                    id="gender"
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    placeholder="e.g. Non-binary, Female..."
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                  />
                </div>

                 {/* Sex Field */}
                <div>
                  <label htmlFor="sex" className="block text-sm font-medium text-zinc-700 mb-2">Sex (Optional)</label>
                  <select
                    id="sex"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm bg-white"
                  >
                     <option value="">Select...</option>
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Other">Other</option>
                     <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-pro btn-primary flex items-center gap-2 px-6 py-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Connected Accounts Section */}
        <div className="mt-8 bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
             <h2 className="font-semibold text-lg flex items-center gap-2">
                <LinkIcon size={18} className="text-indigo-600" />
                Connected Accounts
             </h2>
          </div>

          <div className="p-6">
             <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-lg bg-zinc-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-800">
                      <Github size={20} />
                   </div>
                   <div>
                      <p className="font-semibold text-zinc-900 text-sm">GitHub</p>
                      <p className="text-xs text-zinc-500">
                        {isGithubConnected ? "Connected" : "Not connected"}
                      </p>
                   </div>
                </div>

                {isGithubConnected ? (
                  <button
                    onClick={handleUnlinkGithub}
                    className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-100 hover:bg-red-100 transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={handleConnectGithub}
                    className="text-sm font-medium text-zinc-900 hover:text-black hover:underline"
                  >
                    Connect
                  </button>
                )}
             </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-8 bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
             <h2 className="font-semibold text-lg flex items-center gap-2">
                <Lock size={18} className="text-indigo-600" />
                Security
             </h2>
          </div>

          <div className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label htmlFor="currentPassword" className="block text-sm font-medium text-zinc-700">Current Password</label>
                   <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">Forgot your password?</Link>
                </div>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-700 mb-2">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-2">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="btn-pro btn-secondary flex items-center gap-2 px-6 py-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
