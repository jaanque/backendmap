import { useEffect, useState } from 'react';
import { Loader2, X, User, BadgeCheck } from 'lucide-react';
import type { Profile } from '../types';
import { getFollowers, getFollowing } from '../lib/api';
import UserDetailsModal from './UserDetailsModal';

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: 'followers' | 'following';
}

export default function UserListModal({ isOpen, onClose, userId, type }: UserListModalProps) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      const fetchFn = type === 'followers' ? getFollowers : getFollowing;

      fetchFn(userId)
        .then(setUsers)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
        setUsers([]);
    }
  }, [isOpen, userId, type]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-lg text-zinc-900 capitalize">
              {type}
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 transition-colors rounded-full p-1 hover:bg-zinc-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-sm">
                No users found.
              </div>
            ) : (
              <div className="space-y-1">
                {users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="w-full text-left p-3 rounded-lg hover:bg-zinc-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:border-indigo-200">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-zinc-900 flex items-center gap-1">
                        {user.first_name} {user.last_name}
                        {user.is_verified && (
                          <BadgeCheck size={14} className="text-green-600" />
                        )}
                      </p>
                      {(user.gender || user.sex) && (
                        <p className="text-xs text-zinc-500">
                            {[user.gender, user.sex].filter(Boolean).join(' • ')}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
            isOpen={!!selectedUser}
            onClose={() => setSelectedUser(null)}
            user={selectedUser}
        />
      )}
    </>
  );
}
