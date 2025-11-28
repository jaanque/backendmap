import { useState, useEffect } from 'react';
import { getPublicProfiles, getUserAchievementsWithDetails, getScenariosByAuthor } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, User, X, Trophy, Map, Award, Footprints, DraftingCompass, Brain, Sun, Bug } from 'lucide-react';
import type { Profile, Achievement, Scenario } from '../types';
import ScenarioCard from '../components/ScenarioCard';

// Reuse IconMap from Profile (should ideally be a shared component/util)
const IconMap: Record<string, React.ElementType> = {
  'Trophy': Trophy,
  'Award': Award,
  'Footprints': Footprints,
  'DraftingCompass': DraftingCompass,
  'Brain': Brain,
  'Sun': Sun,
  'Bug': Bug
};

export default function Users() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [userScenarios, setUserScenarios] = useState<Scenario[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    getPublicProfiles()
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedUser) {
        setLoadingDetails(true);
        Promise.all([
            getUserAchievementsWithDetails(selectedUser.id),
            getScenariosByAuthor(selectedUser.id)
        ])
        .then(([achievements, scenarios]) => {
            setUserAchievements(achievements);
            setUserScenarios(scenarios);
        })
        .catch(err => console.error("Error fetching user details", err))
        .finally(() => setLoadingDetails(false));
    } else {
        setUserAchievements([]);
        setUserScenarios([]);
    }
  }, [selectedUser]);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 md:px-12 py-12 max-w-7xl mx-auto w-full animate-fade-in-up">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Community</h1>
          <p className="text-zinc-500 mt-2">Discover other explorers in the community.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            No public profiles found. Be the first to share your profile!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map(user => (
              <div
                key={user.id}
                className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex flex-col items-center text-center transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  <User size={40} />
                </div>
                <h3 className="font-bold text-lg text-zinc-900">
                  {user.first_name || 'Anonymous'} {user.last_name || ''}
                </h3>
                {(user.gender || user.sex) && (
                  <p className="text-xs text-zinc-500 mt-1">
                    {[user.gender, user.sex].filter(Boolean).join(' • ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="font-bold text-lg text-zinc-900 flex items-center gap-2">
                        <User size={18} className="text-indigo-600" />
                        {selectedUser.first_name} {selectedUser.last_name}
                    </h2>
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors rounded-full p-1 hover:bg-zinc-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {loadingDetails ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-indigo-600" size={32} />
                        </div>
                    ) : (
                        <>
                            {/* Achievements */}
                            <div>
                                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                    <Trophy size={18} className="text-amber-500" />
                                    Completed Achievements
                                </h3>
                                {userAchievements.length === 0 ? (
                                    <p className="text-zinc-500 text-sm italic">No achievements earned yet.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {userAchievements.map(achievement => {
                                            const IconComponent = IconMap[achievement.icon_name] || Trophy;
                                            return (
                                                <div key={achievement.id} className="p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm text-indigo-600 flex-shrink-0">
                                                        <IconComponent size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-zinc-900">{achievement.title}</p>
                                                        <p className="text-xs text-zinc-500">{achievement.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Scenarios */}
                            <div>
                                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                    <Map size={18} className="text-indigo-600" />
                                    Created Scenarios
                                </h3>
                                {userScenarios.length === 0 ? (
                                    <p className="text-zinc-500 text-sm italic">No scenarios created yet.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {userScenarios.map(scenario => (
                                            <ScenarioCard
                                                key={scenario.id}
                                                scenario={scenario}
                                                isFavorited={false}
                                                onToggleFavorite={() => {}}
                                                showFavoriteButton={false}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
