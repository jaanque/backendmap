import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { getProfile, getFollowersCount, getFollowingCount, getUserAchievementsWithDetails, getScenariosByAuthor } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Loader2, Trophy, Map, Settings, Award, Footprints, DraftingCompass, Brain, Sun, Bug, BadgeCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Achievement, Scenario } from '../types';
import ScenarioCard from '../components/ScenarioCard';

// Reuse IconMap
const IconMap: Record<string, React.ElementType> = {
  'Trophy': Trophy,
  'Award': Award,
  'Footprints': Footprints,
  'DraftingCompass': DraftingCompass,
  'Brain': Brain,
  'Sun': Sun,
  'Bug': Bug
};

export default function ViewProfile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [sex, setSex] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [userScenarios, setUserScenarios] = useState<Scenario[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      setIsLoadingData(true);

      // Fetch everything in parallel
      Promise.all([
        getProfile(user.id),
        getFollowersCount(user.id),
        getFollowingCount(user.id),
        getUserAchievementsWithDetails(user.id),
        getScenariosByAuthor(user.id)
      ])
      .then(([profile, followers, following, achievements, scenarios]) => {
        if (profile) {
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');
          setGender(profile.gender || '');
          setSex(profile.sex || '');
          setIsVerified(profile.is_verified || false);
        }
        setFollowersCount(followers);
        setFollowingCount(following);
        setUserAchievements(achievements);
        setUserScenarios(scenarios);
      })
      .catch(err => console.error("Error fetching profile data", err))
      .finally(() => setIsLoadingData(false));
    }
  }, [user, loading, navigate]);

  if (loading || isLoadingData) {
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

      <main className="flex-grow px-6 md:px-12 py-12 max-w-7xl mx-auto w-full animate-fade-in-up">

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-4">
               <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md inline-block">
                 <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                    <User size={40} />
                 </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-grow">
                   <h1 className="text-2xl font-bold text-zinc-900 leading-tight flex items-center gap-2">
                     {firstName} {lastName}
                     {isVerified && (
                       <BadgeCheck size={24} className="text-green-600" />
                     )}
                   </h1>
                   <p className="text-zinc-500 text-sm mt-1">{user.email}</p>

                   <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-1.5 text-sm">
                         <span className="font-bold text-zinc-900">{followersCount}</span>
                         <span className="text-zinc-500">Followers</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                         <span className="font-bold text-zinc-900">{followingCount}</span>
                         <span className="text-zinc-500">Following</span>
                      </div>
                   </div>

                   {(gender || sex) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                         {gender && (
                           <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium border border-zinc-200">
                             {gender}
                           </span>
                         )}
                         {sex && (
                           <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium border border-zinc-200">
                             {sex}
                           </span>
                         )}
                      </div>
                   )}
                </div>

                <Link to="/profile" className="btn-pro btn-secondary flex items-center gap-2 px-4 py-2 text-sm shrink-0">
                  <Settings size={16} />
                  Configure Profile
               </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Achievements */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden h-full">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                   <h2 className="font-semibold text-zinc-900 flex items-center gap-2">
                      <Trophy size={18} className="text-amber-500" />
                      Achievements
                   </h2>
                </div>
                <div className="p-6">
                   {userAchievements.length === 0 ? (
                      <p className="text-zinc-500 text-sm italic text-center py-4">No achievements yet.</p>
                   ) : (
                      <div className="space-y-4">
                         {userAchievements.map(achievement => {
                            const IconComponent = IconMap[achievement.icon_name] || Trophy;
                            return (
                               <div key={achievement.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-50 transition-colors -mx-2">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-600 flex-shrink-0">
                                     <IconComponent size={18} />
                                  </div>
                                  <div className="min-w-0">
                                     <p className="font-bold text-sm text-zinc-900 truncate">{achievement.title}</p>
                                     <p className="text-xs text-zinc-500 truncate leading-relaxed">{achievement.description}</p>
                                  </div>
                               </div>
                            );
                         })}
                      </div>
                   )}
                   <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
                      <Link to="/achievements" className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold uppercase tracking-wide">
                         View All Achievements
                      </Link>
                   </div>
                </div>
              </div>
           </div>

           {/* Right Column: Scenarios */}
           <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                   <h2 className="font-semibold text-lg text-zinc-900 flex items-center gap-2">
                      <Map size={18} className="text-indigo-600" />
                      Created Scenarios
                   </h2>
                </div>
                <div className="p-6">
                   {userScenarios.length === 0 ? (
                      <div className="text-center py-12 text-zinc-400">
                         <Map size={32} className="mx-auto mb-3 opacity-20" />
                         <p>No scenarios created yet.</p>
                         <Link to="/create" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2 inline-block">
                            Create your first scenario
                         </Link>
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 gap-4">
                         {userScenarios.map(scenario => (
                            <ScenarioCard
                               key={scenario.id}
                               scenario={scenario}
                               isFavorited={false} // Read-only view mainly
                               onToggleFavorite={() => {}}
                               showFavoriteButton={false}
                            />
                         ))}
                      </div>
                   )}
                </div>
              </div>
           </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
