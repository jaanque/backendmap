import { useEffect, useState } from 'react';
import { Loader2, User, X, Trophy, Map, Award, Footprints, DraftingCompass, Brain, Sun, Bug } from 'lucide-react';
import type { Profile, Achievement, Scenario } from '../types';
import { getUserAchievementsWithDetails, getScenariosByAuthor } from '../lib/api';
import ScenarioCard from './ScenarioCard';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Profile | null;
}

// Reuse IconMap (should ideally be a shared component/util)
const IconMap: Record<string, React.ElementType> = {
  'Trophy': Trophy,
  'Award': Award,
  'Footprints': Footprints,
  'DraftingCompass': DraftingCompass,
  'Brain': Brain,
  'Sun': Sun,
  'Bug': Bug
};

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [userScenarios, setUserScenarios] = useState<Scenario[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
        setLoadingDetails(true);
        Promise.all([
            getUserAchievementsWithDetails(user.id),
            getScenariosByAuthor(user.id)
        ])
        .then(([achievements, scenarios]) => {
            setUserAchievements(achievements);
            setUserScenarios(scenarios);
        })
        .catch(err => console.error("Error fetching user details", err))
        .finally(() => setLoadingDetails(false));
    } else {
        // Reset state when closed
        setUserAchievements([]);
        setUserScenarios([]);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="font-bold text-lg text-zinc-900 flex items-center gap-2">
                    <User size={18} className="text-indigo-600" />
                    {user.first_name} {user.last_name}
                </h2>
                <button
                    onClick={onClose}
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
  );
}
