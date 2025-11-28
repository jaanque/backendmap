import { useState, useEffect } from 'react';
import { getPublicProfiles } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, User } from 'lucide-react';
import type { Profile } from '../types';

export default function Users() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicProfiles()
      .then(data => setUsers(data))
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
              <div key={user.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex flex-col items-center text-center transition-all hover:shadow-md hover:scale-[1.02]">
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
    </div>
  );
}
