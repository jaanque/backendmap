import { useEffect, useState, useMemo } from 'react';
import { getScenarios, getUserProgress, getUserFavorites, setFavorite } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import type { Scenario, UserProgress } from '../types';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ScenarioCard from '../components/ScenarioCard';
import SearchFilters from '../components/SearchFilters';

export default function Explore() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    setLoading(true);
    getScenarios()
      .then(async (data) => {
        setScenarios(data);
        if (user) {
          try {
             const [progressData, favData] = await Promise.all([
              getUserProgress(user.id),
              getUserFavorites(user.id)
            ]);
            const progressMap = progressData.reduce((acc, curr) => ({
              ...acc,
              [curr.scenario_id]: curr
            }), {});
            setUserProgress(progressMap);
            setFavorites(new Set(favData));
          } catch (err) {
            console.error('Failed to load user data:', err);
          }
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggleFavorite = async (scenarioId: string) => {
    if (!user) return; // Or show login modal

    const isCurrentlyFav = favorites.has(scenarioId);
    const newFavState = !isCurrentlyFav;

    // Optimistic update
    const newFavs = new Set(favorites);
    if (newFavState) newFavs.add(scenarioId);
    else newFavs.delete(scenarioId);
    setFavorites(newFavs);

    // Optimistic count update
    setScenarios(prev => prev.map(s => s.id === scenarioId ? { ...s, favorites_count: (s.favorites_count || 0) + (newFavState ? 1 : -1) } : s));

    // Show toast
    showToast(newFavState ? "Added to favorites" : "Removed from favorites", {
      type: 'success',
      onUndo: async () => {
          // Undo: revert local state
          const revertFavs = new Set(newFavs);
          if (newFavState) revertFavs.delete(scenarioId);
          else revertFavs.add(scenarioId);
          setFavorites(revertFavs);

          // Undo count
          setScenarios(prev => prev.map(s => s.id === scenarioId ? { ...s, favorites_count: (s.favorites_count || 0) + (newFavState ? -1 : 1) } : s));

          try {
              // Undo: set back to original state
              await setFavorite(user.id, scenarioId, isCurrentlyFav);
          } catch (err) {
              console.error("Undo failed", err);
          }
      }
    });

    try {
      await setFavorite(user.id, scenarioId, newFavState);
    } catch (err) {
      // Revert on error
      console.error("Failed to toggle favorite", err);
      setFavorites(favorites);
      // Revert count
      setScenarios(prev => prev.map(s => s.id === scenarioId ? { ...s, favorites_count: (s.favorites_count || 0) + (newFavState ? -1 : 1) } : s));
      showToast("Failed to update favorite", { type: 'error' });
    }
  };

  const filteredScenarios = useMemo(() => {
    let result = [...scenarios];

    // Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(s =>
        (s.title || '').toLowerCase().includes(lowerQuery) ||
        (s.description || '').toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by Difficulty
    if (filterDifficulty !== 'All') {
      result = result.filter(s => s.difficulty === filterDifficulty);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'popular') {
        return (b.favorites_count || 0) - (a.favorites_count || 0);
      } else if (sortOrder === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        // newest (default)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [scenarios, searchQuery, filterDifficulty, sortOrder]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md w-full text-center">
          <h2 className="text-lg font-bold text-red-900 mb-2">Connection Error</h2>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-black selection:text-white">
      <Navbar />

      {/* Search Header */}
      <div id="main-content" className="py-12 px-4 md:px-12 max-w-5xl mx-auto">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </div>

      {/* Content - Technical List */}
      <main className="px-4 md:px-12 pb-32 max-w-5xl mx-auto animate-fade-in-up">
        <div className="mb-6 flex items-end justify-between border-b border-zinc-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">All Scenarios</h2>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-100 px-2 py-1 rounded">{filteredScenarios.length} ITEMS</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
             <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
          </div>
        ) : filteredScenarios.length > 0 ? (
          <div className="flex flex-col gap-4 animate-fade-in-up">
            {filteredScenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                progress={userProgress[scenario.id]}
                isFavorited={favorites.has(scenario.id)}
                onToggleFavorite={handleToggleFavorite}
                showFavoriteButton={!!user}
                currentUserId={user?.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/30">
             <p className="text-zinc-500 font-medium">No scenarios match your search.</p>
             <button onClick={() => setSearchQuery('')} className="mt-4 text-zinc-900 font-semibold hover:underline text-sm">Clear filter</button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
