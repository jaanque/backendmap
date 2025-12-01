import { useState, useEffect } from 'react';
import { getPublicProfiles, getFollowersCount, getFollowingCount, getPublicOrganizations } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, User, Users as UsersIcon, BadgeCheck, Building2, ArrowRight } from 'lucide-react';
import type { Profile, Organization } from '../types';
import UserDetailsModal from '../components/UserDetailsModal';
import { Link } from 'react-router-dom';

export default function Users() {
  const [activeTab, setActiveTab] = useState<'users' | 'organizations'>('users');
  const [users, setUsers] = useState<Profile[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [userStats, setUserStats] = useState<Record<string, { followers: number; following: number }>>({});
  const [loading, setLoading] = useState(true);

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
        getPublicProfiles(),
        getPublicOrganizations()
    ])
      .then(async ([usersData, orgsData]) => {
        setUsers(usersData);
        setOrgs(orgsData);

        // Fetch stats for all users
        const statsMap: Record<string, { followers: number; following: number }> = {};
        await Promise.all(usersData.map(async (user) => {
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
      .catch(err => console.error("Error fetching community data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white  font-sans text-zinc-900  flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-grow px-6 md:px-12 py-12 max-w-7xl mx-auto w-full animate-fade-in-up">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 ">Community</h1>
          <p className="text-zinc-500  mt-2">Discover users and organizations shaping the future.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
            <div className="inline-flex bg-zinc-100  p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        activeTab === 'users'
                        ? 'bg-white  text-zinc-900  shadow-sm'
                        : 'text-zinc-500  hover:text-zinc-700 '
                    }`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('organizations')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        activeTab === 'organizations'
                        ? 'bg-white  text-zinc-900  shadow-sm'
                        : 'text-zinc-500  hover:text-zinc-700 '
                    }`}
                >
                    Organizations
                </button>
            </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
                users.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400">
                        No public profiles found. Be the first to share your profile!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {users.map(user => (
                        <div
                            key={user.id}
                            className="bg-white  rounded-xl border border-zinc-200  shadow-sm p-6 flex flex-col items-center text-center transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer group"
                            onClick={() => setSelectedUser(user)}
                        >
                            <div className="w-20 h-20 rounded-full bg-indigo-100  flex items-center justify-center text-indigo-600  mb-4">
                            <User size={40} />
                            </div>
                            <h3 className="font-bold text-lg text-zinc-900  flex items-center gap-1 group-hover:text-indigo-600  transition-colors">
                            {user.first_name || 'Anonymous'} {user.last_name || ''}
                            {user.is_verified && (
                                <BadgeCheck size={18} className="text-blue-500 fill-blue-50 " strokeWidth={2.5} />
                            )}
                            </h3>

                            <div className="flex items-center gap-3 mt-2 mb-1">
                                <div className="flex items-center gap-1 text-xs text-zinc-500  bg-zinc-50  px-2 py-1 rounded-md border border-zinc-100 ">
                                    <UsersIcon size={12} />
                                    <span className="font-semibold text-zinc-900 ">{userStats[user.id]?.followers || 0}</span>
                                    <span>Followers</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-zinc-500  bg-zinc-50  px-2 py-1 rounded-md border border-zinc-100 ">
                                    <span className="font-semibold text-zinc-900 ">{userStats[user.id]?.following || 0}</span>
                                    <span>Following</span>
                                </div>
                            </div>

                            {(user.gender || user.sex) && (
                            <p className="text-[10px] text-zinc-400  mt-1">
                                {[user.gender, user.sex].filter(Boolean).join(' • ')}
                            </p>
                            )}
                        </div>
                        ))}
                    </div>
                )
            )}

            {activeTab === 'organizations' && (
                orgs.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400">
                        No organizations found. <Link to="/create-organization" className="text-indigo-600 hover:underline">Create one?</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {orgs.map(org => (
                            <Link
                                key={org.id}
                                to={`/org/${org.slug}`}
                                className="bg-white  rounded-xl border border-zinc-200  shadow-sm p-6 flex flex-col items-start transition-all hover:shadow-md hover:border-indigo-300  group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-zinc-100  flex items-center justify-center text-zinc-600  mb-4 group-hover:bg-indigo-50  group-hover:text-indigo-600  transition-colors">
                                    <Building2 size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-zinc-900  group-hover:text-indigo-600  transition-colors mb-1">
                                    {org.name}
                                </h3>
                                <p className="text-sm text-zinc-500  line-clamp-2 mb-4 h-10">
                                    {org.description || 'No description provided.'}
                                </p>
                                <div className="mt-auto w-full flex items-center justify-between text-xs font-medium text-zinc-400  pt-4 border-t border-zinc-100 ">
                                    <span>Joined {new Date(org.created_at).getFullYear()}</span>
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            )}
          </>
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
