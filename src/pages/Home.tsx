import { useEffect, useState, useMemo } from 'react';
import { getScenarios, getUserProgress, getUserFavorites, setFavorite } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import type { Scenario, UserProgress } from '../types';
import { Search } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ScenarioCard from '../components/ScenarioCard';

export default function Home() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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
      .catch((err) => setError(err.message));
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

    // Show toast
    showToast(newFavState ? "Added to favorites" : "Removed from favorites", {
      type: 'success',
      onUndo: async () => {
          // Undo: revert local state
          const revertFavs = new Set(newFavs);
          if (newFavState) revertFavs.delete(scenarioId);
          else revertFavs.add(scenarioId);
          setFavorites(revertFavs);

          try {
              // Undo: set back to original state
              await setFavorite(user.id, scenarioId, isCurrentlyFav);
          } catch (err) {
              console.error("Undo failed", err);
              // If undo failed, we might want to revert UI again, but let's keep it simple
          }
      }
    });

    try {
      await setFavorite(user.id, scenarioId, newFavState);
    } catch (err) {
      // Revert on error
      console.error("Failed to toggle favorite", err);
      setFavorites(favorites);
      showToast("Failed to update favorite", { type: 'error' });
    }
  };

  const filteredScenarios = useMemo(() => {
    if (!searchQuery) return scenarios;
    const lowerQuery = searchQuery.toLowerCase();
    return scenarios.filter(s =>
      s.title.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
    );
  }, [scenarios, searchQuery]);

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

      {/* Hero */}
      <header className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-zinc-900 leading-[1.1]">
          System Architecture <br/>
          <span className="text-zinc-400">Visualized.</span>
        </h1>
        <p className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          A collection of interactive backend flows. <br/>
          Understand how data moves through modern software stacks.
        </p>

        {/* Command Bar Search */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-black transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search scenarios (e.g., API, Database, AWS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 bg-zinc-50/50 shadow-sm focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-lg font-medium placeholder:text-zinc-400"
          />
        </div>
      </header>

      {/* Content - Technical List */}
      <main className="px-6 md:px-12 pb-32 max-w-5xl mx-auto">
        <div className="mb-6 flex items-end justify-between border-b border-zinc-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Catalog</h2>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-100 px-2 py-1 rounded">{filteredScenarios.length} ITEMS</span>
        </div>

        {filteredScenarios.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredScenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                progress={userProgress[scenario.id]}
                isFavorited={favorites.has(scenario.id)}
                onToggleFavorite={handleToggleFavorite}
                showFavoriteButton={!!user}
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
