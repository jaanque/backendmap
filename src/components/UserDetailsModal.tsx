import { useEffect, useState } from 'react';
import { Loader2, User, X, Trophy, Map, Award, Footprints, DraftingCompass, Brain, Sun, Bug, UserPlus, UserCheck } from 'lucide-react';
import type { Profile, Achievement, Scenario } from '../types';
import { getUserAchievementsWithDetails, getScenariosByAuthor, followUser, unfollowUser, checkIsFollowing, getFollowersCount, getFollowingCount } from '../lib/api';
import ScenarioCard from './ScenarioCard';
import { useAuth } from '../lib/auth';

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
  const { user: currentUser } = useAuth();
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [userScenarios, setUserScenarios] = useState<Scenario[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Follow State
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
        setLoadingDetails(true);
        Promise.all([
            getUserAchievementsWithDetails(user.id),
            getScenariosByAuthor(user.id),
            getFollowersCount(user.id),
            getFollowingCount(user.id),
            currentUser ? checkIsFollowing(user.id) : Promise.resolve(false)
        ])
        .then(([achievements, scenarios, followers, following, isFollowingUser]) => {
            setUserAchievements(achievements);
            setUserScenarios(scenarios);
            setFollowersCount(followers);
            setFollowingCount(following);
            setIsFollowing(isFollowingUser);
        })
        .catch(err => console.error("Error fetching user details", err))
        .finally(() => setLoadingDetails(false));
    } else {
        // Reset state when closed
        setUserAchievements([]);
        setUserScenarios([]);
        setFollowersCount(0);
        setFollowingCount(0);
        setIsFollowing(false);
    }
  }, [isOpen, user, currentUser]);

  const handleFollowToggle = async () => {
    if (!user || !currentUser || followLoading) return;
    setFollowLoading(true);

    try {
        if (isFollowing) {
            await unfollowUser(user.id);
            setFollowersCount(prev => Math.max(0, prev - 1));
            setIsFollowing(false);
        } else {
            await followUser(user.id);
            setFollowersCount(prev => prev + 1);
            setIsFollowing(true);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setFollowLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const isMe = currentUser?.id === user.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-lg text-zinc-900 flex items-center gap-2">
                        <User size={18} className="text-indigo-600" />
                        {user.first_name} {user.last_name}
                    </h2>

                    {!isMe && currentUser && (
                        <button
                            onClick={handleFollowToggle}
                            disabled={followLoading}
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                isFollowing
                                ? 'bg-zinc-100 text-zinc-700 hover:bg-red-50 hover:text-red-600 border border-zinc-200 hover:border-red-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent shadow-sm'
                            }`}
                        >
                            {isFollowing ? (
                                <>
                                    <UserCheck size={14} />
                                    Following
                                </>
                            ) : (
                                <>
                                    <UserPlus size={14} />
                                    Follow
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-4 text-xs font-medium text-zinc-500">
                        <span><strong className="text-zinc-900">{followersCount}</strong> Followers</span>
                        <span><strong className="text-zinc-900">{followingCount}</strong> Following</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors rounded-full p-1 hover:bg-zinc-100"
                    >
                        <X size={20} />
                    </button>
                </div>
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
