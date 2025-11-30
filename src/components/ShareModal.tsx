import { useState, useEffect } from 'react';
import { X, Search, Check, UserPlus, Shield, Eye, Trash2 } from 'lucide-react';
import { getCollaborators, searchUsers, addCollaborator, removeCollaborator, updateCollaboratorRole } from '../lib/api';
import type { ScenarioCollaborator, Profile } from '../types';
import { useToast } from '../lib/toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioId: string;
}

export default function ShareModal({ isOpen, onClose, scenarioId }: ShareModalProps) {
  const { showToast } = useToast();
  const [collaborators, setCollaborators] = useState<ScenarioCollaborator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingCollaborators, setLoadingCollaborators] = useState(true);

  // Fetch collaborators when modal opens
  useEffect(() => {
    if (isOpen && scenarioId) {
      loadCollaborators();
    }
  }, [isOpen, scenarioId]);

  const loadCollaborators = async () => {
    setLoadingCollaborators(true);
    try {
      const data = await getCollaborators(scenarioId);
      setCollaborators(data);
    } catch (error) {
      console.error(error);
      showToast('Failed to load collaborators', { type: 'error' });
    } finally {
      setLoadingCollaborators(false);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Exclude already added users locally if possible, but API doesn't do "NOT IN" easily with search
      // So filter client side
      const results = await searchUsers(query);
      const collaboratorIds = new Set(collaborators.map(c => c.user_id));
      setSearchResults(results.filter(r => !collaboratorIds.has(r.id)));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUser = async (user: Profile) => {
    try {
      await addCollaborator(scenarioId, user.id, 'viewer'); // Default to viewer
      showToast(`${user.first_name || user.email} added as viewer`, { type: 'success' });
      setSearchQuery('');
      setSearchResults([]);
      loadCollaborators();
    } catch (error) {
      console.error(error);
      showToast('Failed to add collaborator', { type: 'error' });
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!confirm('Remove this user?')) return;
    try {
      await removeCollaborator(scenarioId, userId);
      setCollaborators(prev => prev.filter(c => c.user_id !== userId));
      showToast('Collaborator removed', { type: 'success' });
    } catch (error) {
      console.error(error);
      showToast('Failed to remove collaborator', { type: 'error' });
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'editor' | 'viewer') => {
    try {
      // Optimistic update
      setCollaborators(prev => prev.map(c => c.user_id === userId ? { ...c, role: newRole } : c));
      await updateCollaboratorRole(scenarioId, userId, newRole);
      showToast('Role updated', { type: 'success' });
    } catch (error) {
      console.error(error);
      showToast('Failed to update role', { type: 'error' });
      loadCollaborators(); // Revert
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h3 className="font-bold text-lg text-zinc-900">Share Scenario</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add People */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Add people by email or name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              />
              <div className="absolute top-1/2 -translate-y-1/2 left-3 text-zinc-400">
                <UserPlus size={16} />
              </div>
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-zinc-200 shadow-lg z-10 max-h-48 overflow-y-auto">
                {searchResults.map(user => (
                   <button
                     key={user.id}
                     onClick={() => handleAddUser(user)}
                     className="w-full text-left px-4 py-3 hover:bg-zinc-50 flex items-center gap-3 transition-colors border-b border-zinc-50 last:border-0"
                   >
                     <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                     </div>
                     <div>
                       <p className="text-sm font-medium text-zinc-900">
                         {user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'User'}
                       </p>
                       <p className="text-xs text-zinc-500">{user.email}</p>
                     </div>
                   </button>
                ))}
              </div>
            )}
          </div>

          {/* Collaborators List */}
          <div>
             <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">People with access</h4>

             {loadingCollaborators ? (
               <div className="text-center py-4 text-zinc-400 text-sm">Loading...</div>
             ) : collaborators.length === 0 ? (
               <div className="text-center py-4 text-zinc-400 text-sm italic">
                  No collaborators yet. You are the only one with access.
               </div>
             ) : (
               <div className="space-y-3">
                 {collaborators.map(collab => {
                    // Profile might be joined or not depending on API, but we requested it
                    const name = collab.profile
                        ? (collab.profile.first_name ? `${collab.profile.first_name} ${collab.profile.last_name}` : collab.profile.email)
                        : 'Unknown User';

                    return (
                        <div key={collab.id} className="flex items-center justify-between group">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 text-xs font-medium">
                                 {name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-900">{name}</span>
                                <span className="text-xs text-zinc-500">{collab.profile?.email}</span>
                              </div>
                           </div>

                           <div className="flex items-center gap-2">
                              <select
                                value={collab.role}
                                onChange={(e) => handleRoleChange(collab.user_id, e.target.value as any)}
                                className="text-xs border-none bg-transparent font-medium text-zinc-600 focus:ring-0 cursor-pointer hover:text-indigo-600 text-right pr-6"
                              >
                                 <option value="viewer">Viewer</option>
                                 <option value="editor">Editor</option>
                              </select>
                              <button
                                onClick={() => handleRemoveCollaborator(collab.user_id)}
                                className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                           </div>
                        </div>
                    );
                 })}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
