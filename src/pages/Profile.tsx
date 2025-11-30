import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useToast } from '../lib/toast';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, Save, Loader2, Lock, Github, Link as LinkIcon, Trophy, Award, Footprints, DraftingCompass, Brain, Sun, Bug, BadgeCheck, ShieldAlert, CreditCard } from 'lucide-react';
import { getProfile, updateProfile, getAllAchievements, getUserAchievements, getFollowersCount, getFollowingCount } from '../lib/api';
import { checkAchievements } from '../lib/achievements';
import UserListModal from '../components/UserListModal';
import type { Achievement } from '../types';

// Helper to resolve icon string to component
const IconMap: Record<string, React.ElementType> = {
  'Trophy': Trophy,
  'Award': Award,
  'Footprints': Footprints,
  'DraftingCompass': DraftingCompass,
  'Brain': Brain,
  'Sun': Sun,
  'Bug': Bug
};

type Section = 'general' | 'achievements' | 'connections' | 'security';

export default function Profile() {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<Section>('general');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [sex, setSex] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRequestingVerification, setIsRequestingVerification] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isGithubConnected, setIsGithubConnected] = useState(false);

  // Follow Stats
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeFollowsModal, setActiveFollowsModal] = useState<'followers' | 'following' | null>(null);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedAchievementIds, setEarnedAchievementIds] = useState<Set<string>>(new Set());

  const unlockedAchievements = achievements.filter(a => earnedAchievementIds.has(a.id));
  const lockedAchievements = achievements.filter(a => !earnedAchievementIds.has(a.id));

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }

    if (user) {
      // Check for GitHub identity
      const githubIdentity = user.identities?.find(id => id.provider === 'github');
      setIsGithubConnected(!!githubIdentity);

      // Fetch Profile
      getProfile(user.id)
        .then(profile => {
          if (profile) {
            setFirstName(profile.first_name || '');
            setLastName(profile.last_name || '');
            setGender(profile.gender || '');
            setSex(profile.sex || '');
            setIsPublic(profile.is_public || false);
            setIsVerified(profile.is_verified || false);
            setVerificationRequested(profile.verification_requested || false);
          }
        })
        .catch(err => console.error('Error fetching profile:', err))
        .finally(() => setIsLoadingProfile(false));

      // Fetch Follow Stats
      Promise.all([
        getFollowersCount(user.id),
        getFollowingCount(user.id)
      ]).then(([followers, following]) => {
        setFollowersCount(followers);
        setFollowingCount(following);
      });

      // Fetch and Check Achievements
      // First run the check logic to update any pending achievements
      checkAchievements(user.id).then(() => {
          // Then fetch the latest state
          return Promise.all([getAllAchievements(), getUserAchievements(user.id)]);
      })
      .then(([all, earned]) => {
           setAchievements(all as Achievement[]);
           setEarnedAchievementIds(new Set(earned as string[]));
      })
      .catch(err => console.error("Error fetching achievements", err));
    }
  }, [user, loading, navigate]);

  const handleConnectGithub = async () => {
     if (!supabase) return;
     const { error } = await supabase.auth.linkIdentity({ provider: 'github' });
     if (error) {
         console.error("Error linking GitHub", error);
         showToast(error.message || "Failed to link GitHub account", { type: 'error' });
     }
  }

  const handleUnlinkGithub = async () => {
     if (!supabase || !user) return;

     const identities = user.identities || [];
     const hasPassword = identities.some(id => id.provider === 'email');
     const hasOtherProviders = identities.some(id => id.provider !== 'github');

     if (!hasPassword && !hasOtherProviders) {
         showToast("Cannot unlink GitHub as it is your only login method. Please set a password first.", { type: 'error' });
         return;
     }

     if (window.confirm("Are you sure you want to disconnect your GitHub account? This will remove your ability to sign in with GitHub.")) {
        try {
            const githubIdentity = identities.find(id => id.provider === 'github');
            if (!githubIdentity) return;

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
      await updateProfile(user.id, {
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        sex: sex,
        is_public: isPublic
      });

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

  const handleRequestVerification = async () => {
    if (!user || !supabase) return;

    setIsRequestingVerification(true);
    try {
      await updateProfile(user.id, {
        verification_requested: true
      });
      setVerificationRequested(true);
      showToast('Verification requested successfully', { type: 'success' });
    } catch (error: any) {
      console.error('Error requesting verification:', error);
      showToast(error.message || 'Failed to request verification', { type: 'error' });
    } finally {
      setIsRequestingVerification(false);
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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Incorrect current password");
      }

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

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'connections', label: 'Connections', icon: LinkIcon },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 md:px-12 py-12 w-full animate-fade-in-up">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Account Settings</h1>
          <p className="text-zinc-500 mt-2">Manage your profile and account preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0">
             <nav className="flex flex-col space-y-1 sticky top-24">
               {tabs.map((tab) => {
                 const Icon = tab.icon;
                 const isActive = activeSection === tab.id;
                 return (
                   <button
                     key={tab.id}
                     onClick={() => setActiveSection(tab.id as Section)}
                     className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left ${
                       isActive
                        ? 'bg-zinc-100 text-zinc-900'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                     }`}
                   >
                     <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-zinc-400'} />
                     {tab.label}
                   </button>
                 )
               })}
             </nav>
          </aside>

          {/* Content Area */}
          <div className="flex-grow w-full max-w-3xl">

            {/* General Section */}
            {activeSection === 'general' && (
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                      <User size={18} className="text-indigo-600" />
                      Profile Information
                  </h2>
                  <div className="flex items-center gap-4">
                    {isVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <BadgeCheck size={14} className="text-blue-500 fill-blue-50" strokeWidth={2.5} />
                          Verified
                        </span>
                    )}
                    {!isVerified && verificationRequested && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <ShieldAlert size={14} />
                          Pending Verification
                        </span>
                    )}
                    <div className="flex gap-4 text-xs font-medium text-zinc-500">
                      <button onClick={() => setActiveFollowsModal('followers')} className="hover:text-zinc-800 transition-colors">
                        <strong className="text-zinc-900">{followersCount}</strong> Followers
                      </button>
                      <button onClick={() => setActiveFollowsModal('following')} className="hover:text-zinc-800 transition-colors">
                        <strong className="text-zinc-900">{followingCount}</strong> Following
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      {/* Verification Request Banner */}
                      {!isVerified && !verificationRequested && (
                          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-indigo-900">Verify your account</h3>
                                <p className="text-xs text-indigo-700 mt-1">
                                  Get a verified badge to show authenticity.
                                </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleRequestVerification}
                              disabled={isRequestingVerification}
                              className="text-xs font-medium bg-white text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-md hover:bg-indigo-50 hover:text-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {isRequestingVerification ? <Loader2 size={14} className="animate-spin" /> : 'Request Verification'}
                            </button>
                          </div>
                      )}

                      {/* Public Profile Toggle */}
                      <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-indigo-900">Public Profile</h3>
                          <p className="text-xs text-indigo-700 mt-1">
                            Allow others to see your profile on the Users page.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsPublic(!isPublic)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                            isPublic ? 'bg-indigo-600' : 'bg-zinc-200'
                          }`}
                          role="switch"
                          aria-checked={isPublic}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isPublic ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Email Field */}
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
            )}

            {/* Achievements Section */}
            {activeSection === 'achievements' && (
               <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                      <Trophy size={18} className="text-indigo-600" />
                      Achievements
                  </h2>
                </div>
                <div className="p-6">
                  {achievements.length === 0 && (
                    <div className="text-center py-8 text-zinc-400 text-sm">
                      No achievements available yet.
                    </div>
                  )}

                  {unlockedAchievements.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Completed</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {unlockedAchievements.map(achievement => {
                          const IconComponent = IconMap[achievement.icon_name] || Trophy;
                          return (
                            <div
                              key={achievement.id}
                              className="p-4 rounded-xl border flex items-start gap-4 transition-all bg-indigo-50/50 border-indigo-100 hover:scale-[1.02] hover:shadow-sm"
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-100 text-indigo-600">
                                  <IconComponent size={20} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-sm text-indigo-900">
                                    {achievement.title}
                                  </h3>
                                  <p className="text-xs text-zinc-500 mt-1 leading-snug">
                                    {achievement.description}
                                  </p>
                                  <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider text-indigo-400">Unlocked</span>
                                </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {lockedAchievements.length > 0 && (
                    <div className="mt-8 flex justify-center">
                      <Link to="/achievements" className="btn-pro btn-secondary px-6 py-2 text-sm">
                        View All Achievements
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Connections Section */}
            {activeSection === 'connections' && (
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
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
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
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
            )}

          </div>
        </div>
      </main>

      <Footer />

      {activeFollowsModal && user && (
        <UserListModal
          isOpen={!!activeFollowsModal}
          onClose={() => setActiveFollowsModal(null)}
          userId={user.id}
          type={activeFollowsModal}
        />
      )}
    </div>
  );
}
