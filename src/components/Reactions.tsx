import { useState, useEffect, useRef } from 'react';
import { SmilePlus } from 'lucide-react';
import { getScenarioReactions, toggleReaction, getUserReaction } from '../lib/api';
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
  const [userReaction, setUserReaction] = useState<string | null>(null);
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
         const [counts, myReaction] = await Promise.all([
             getScenarioReactions(scenarioId),
             user ? getUserReaction(user.id, scenarioId) : Promise.resolve(null)
         ]);

         setReactions(counts);
         setUserReaction(myReaction);
     } catch (err) {
         console.error("Error loading reactions", err);
     }
  };

  const handleToggle = async (emoji: string) => {
      if (!user) {
          showToast("Please login to react", { type: 'error' });
          return;
      }

      const prevReaction = userReaction;
      const isRemoving = prevReaction === emoji;
      const newReaction = isRemoving ? null : emoji;

      // Optimistic Update
      setUserReaction(newReaction);

      setReactions(prev => {
          const next = { ...prev };

          // Decrement previous if it existed
          if (prevReaction) {
              next[prevReaction] = Math.max(0, (next[prevReaction] || 0) - 1);
              if (next[prevReaction] === 0) delete next[prevReaction];
          }

          // Increment new if it's set
          if (newReaction) {
              next[newReaction] = (next[newReaction] || 0) + 1;
          }

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
              const isSelected = userReaction === emoji;
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
                        className={`p-2 rounded hover:bg-zinc-100 transition-colors text-lg ${userReaction === emoji ? 'bg-indigo-50' : ''}`}
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
