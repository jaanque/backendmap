import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trophy, Award, Footprints, DraftingCompass, Brain, Sun, Bug, ArrowLeft, Loader2 } from 'lucide-react';
import { getAllAchievements, getUserAchievements } from '../lib/api';
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

export default function Achievements() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedAchievementIds, setEarnedAchievementIds] = useState<Set<string>>(new Set());
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }

    if (user) {
      Promise.all([getAllAchievements(), getUserAchievements(user.id)])
        .then(([all, earned]) => {
           setAchievements(all);
           setEarnedAchievementIds(new Set(earned));
        })
        .catch(err => console.error("Error fetching achievements", err))
        .finally(() => setIsLoadingData(false));
    }
  }, [user, loading, navigate]);

  const unlockedAchievements = achievements.filter(a => earnedAchievementIds.has(a.id));
  const lockedAchievements = achievements.filter(a => !earnedAchievementIds.has(a.id));

  if (loading || (user && isLoadingData)) {
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

      <main className="flex-grow px-6 md:px-12 py-12 max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <Link to="/profile" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Profile
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
            <Trophy className="text-yellow-500" />
            Achievements
          </h1>
          <p className="text-zinc-500 mt-2">Track your progress and milestones as you master backend architecture.</p>
        </div>

        {/* Progress Summary */}
        <div className="mb-12 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between flex-wrap gap-6">
           <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Total Earned</span>
              <span className="text-4xl font-bold text-zinc-900">{unlockedAchievements.length} <span className="text-lg text-zinc-400 font-normal">/ {achievements.length}</span></span>
           </div>
           <div className="flex-grow max-w-sm">
              <div className="h-3 w-full bg-zinc-200 rounded-full overflow-hidden">
                 <div
                   className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
                   style={{ width: `${(unlockedAchievements.length / Math.max(achievements.length, 1)) * 100}%` }}
                 />
              </div>
              <p className="text-right text-xs text-zinc-500 mt-2">
                {Math.round((unlockedAchievements.length / Math.max(achievements.length, 1)) * 100)}% Complete
              </p>
           </div>
        </div>

        <div className="space-y-12">
          {unlockedAchievements.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Completed
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedAchievements.map(achievement => {
                  const IconComponent = IconMap[achievement.icon_name] || Trophy;
                  return (
                    <div
                      key={achievement.id}
                      className="p-5 rounded-xl border flex items-start gap-4 transition-all bg-indigo-50/30 border-indigo-100 shadow-sm hover:shadow-md"
                    >
                       <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-100 text-indigo-600 shadow-sm">
                          <IconComponent size={24} />
                       </div>
                       <div>
                          <h3 className="font-bold text-base text-indigo-900">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-zinc-600 mt-1 leading-snug">
                            {achievement.description}
                          </p>
                          <span className="inline-block mt-3 text-[10px] uppercase font-bold tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full">Unlocked</span>
                       </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {lockedAchievements.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
                Locked
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedAchievements.map(achievement => {
                  const IconComponent = IconMap[achievement.icon_name] || Trophy;
                  return (
                    <div
                      key={achievement.id}
                      className="p-5 rounded-xl border flex items-start gap-4 transition-all bg-white border-zinc-100 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 hover:border-zinc-300"
                    >
                       <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-zinc-100 text-zinc-400">
                          <IconComponent size={24} />
                       </div>
                       <div>
                          <h3 className="font-bold text-base text-zinc-700">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-zinc-500 mt-1 leading-snug">
                            {achievement.description}
                          </p>
                          <span className="inline-block mt-3 text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-zinc-50 px-2 py-1 rounded-full">Locked</span>
                       </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
