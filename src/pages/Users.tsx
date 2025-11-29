import { useState, useEffect } from 'react';
import { getPublicProfiles, getFollowersCount, getFollowingCount } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, User, Users as UsersIcon, BadgeCheck } from 'lucide-react';
import type { Profile } from '../types';
import UserDetailsModal from '../components/UserDetailsModal';

export default function Users() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [userStats, setUserStats] = useState<Record<string, { followers: number; following: number }>>({});
  const [loading, setLoading] = useState(true);

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  useEffect(() => {
    getPublicProfiles()
      .then(async (data) => {
        setUsers(data);

        // Fetch stats for all users
        const statsMap: Record<string, { followers: number; following: number }> = {};
        await Promise.all(data.map(async (user) => {
            try {
                const [followers, following] = await Promise.all([
                    getFollowersCount(user.id),
                    getFollowingCount(user.id)
                ]);
                statsMap[user.id] = { followers, following };
            } catch (err) {
                console.error(`Error fetching stats for user ${user.id}`, err);
                statsMap[user.id] = { followers: 0, following: 0 };
            }
        }));
        setUserStats(statsMap);
      })
      .catch(err => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

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
                <h3 className="font-bold text-lg text-zinc-900 flex items-center gap-1">
                  {user.first_name || 'Anonymous'} {user.last_name || ''}
                  {user.is_verified && (
                    <BadgeCheck size={18} className="text-blue-500 fill-blue-50" strokeWidth={2.5} />
                  )}
                </h3>

                <div className="flex items-center gap-3 mt-2 mb-1">
                    <div className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                        <UsersIcon size={12} />
                        <span className="font-semibold text-zinc-900">{userStats[user.id]?.followers || 0}</span>
                        <span>Followers</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                        <span className="font-semibold text-zinc-900">{userStats[user.id]?.following || 0}</span>
                        <span>Following</span>
                    </div>
                </div>

                {(user.gender || user.sex) && (
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {[user.gender, user.sex].filter(Boolean).join(' • ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </div>
  );
}
