import { useState, useEffect, useRef } from 'react';
import { SmilePlus } from 'lucide-react';
import { getScenarioReactions, toggleReaction, getUserReactions } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';

const REACTION_EMOJIS = ['👍', '❤️', '🔥', '🎉', '🤯', '🤔'];

interface ReactionsProps {
  scenarioId: string;
}

export default function Reactions({ scenarioId }: ReactionsProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadReactions();

    // Close picker when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [scenarioId, user]);

  const loadReactions = async () => {
     try {
         const [counts, userReactionList] = await Promise.all([
             getScenarioReactions(scenarioId),
             user ? getUserReactions(user.id, scenarioId) : Promise.resolve([])
         ]);

         setReactions(counts);
         setUserReactions(new Set(userReactionList));
     } catch (err) {
         console.error("Error loading reactions", err);
     }
  };

  const handleToggle = async (emoji: string) => {
      if (!user) {
          showToast("Please login to react", { type: 'error' });
          return;
      }

      // Optimistic update
      const isRemoving = userReactions.has(emoji);

      setUserReactions(prev => {
          const next = new Set(prev);
          if (isRemoving) next.delete(emoji);
          else next.add(emoji);
          return next;
      });

      setReactions(prev => {
          const next = { ...prev };
          const currentCount = next[emoji] || 0;
          next[emoji] = Math.max(0, currentCount + (isRemoving ? -1 : 1));
          if (next[emoji] === 0) delete next[emoji];
          return next;
      });

      try {
          await toggleReaction(user.id, scenarioId, emoji);
      } catch (err) {
          console.error("Error toggling reaction", err);
          showToast("Failed to update reaction", { type: 'error' });
          // Revert on error
          loadReactions();
      }

      setShowPicker(false);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
       {/* Existing Reactions */}
       <div className="flex flex-wrap gap-2">
          {Object.entries(reactions).map(([emoji, count]) => {
              const isSelected = userReactions.has(emoji);
              return (
                  <button
                    key={emoji}
                    onClick={() => handleToggle(emoji)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-all active:scale-95 ${
                        isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300'
                    }`}
                  >
                     <span>{emoji}</span>
                     <span>{count}</span>
                  </button>
              );
          })}
       </div>

       {/* Add Reaction Button */}
       <div className="relative" ref={pickerRef}>
          <button
             onClick={() => setShowPicker(!showPicker)}
             className={`p-1.5 rounded-full border border-dashed border-zinc-300 text-zinc-400 hover:text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 transition-colors ${showPicker ? 'bg-zinc-100 text-zinc-600' : ''}`}
             title="Add Reaction"
          >
             <SmilePlus size={16} />
          </button>

          {/* Emoji Picker */}
          {showPicker && (
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-lg border border-zinc-200 animate-in fade-in zoom-in-95 duration-100 z-50 flex gap-1 min-w-max">
                  {REACTION_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleToggle(emoji)}
                        className={`p-2 rounded hover:bg-zinc-100 transition-colors text-lg ${userReactions.has(emoji) ? 'bg-indigo-50' : ''}`}
                      >
                          {emoji}
                      </button>
                  ))}
              </div>
          )}
       </div>
    </div>
  );
}
