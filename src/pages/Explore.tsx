import { useEffect, useState, useMemo } from 'react';
import { getScenarios, getUserProgress, getUserFavorites, toggleFavorite } from '../lib/api';
import { useAuth } from '../lib/auth';
import type { Scenario, UserProgress } from '../types';
import { Search } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ScenarioCard from '../components/ScenarioCard';

export default function Explore() {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

    const isFav = favorites.has(scenarioId);

    // Optimistic update
    const newFavs = new Set(favorites);
    if (isFav) newFavs.delete(scenarioId);
    else newFavs.add(scenarioId);
    setFavorites(newFavs);

    try {
      await toggleFavorite(user.id, scenarioId, isFav);
    } catch (err) {
      // Revert on error
      console.error("Failed to toggle favorite", err);
      setFavorites(favorites);
    }
  };

  const filteredScenarios = useMemo(() => {
    if (!searchQuery) return scenarios;
    const lowerQuery = searchQuery.toLowerCase();
    return scenarios.filter(s =>
      (s.title || '').toLowerCase().includes(lowerQuery) ||
      (s.description || '').toLowerCase().includes(lowerQuery)
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

      {/* Search Header */}
      <div className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
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
      </div>

      {/* Content - Technical List */}
      <main className="px-6 md:px-12 pb-32 max-w-5xl mx-auto">
        <div className="mb-6 flex items-end justify-between border-b border-zinc-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">All Scenarios</h2>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-100 px-2 py-1 rounded">{filteredScenarios.length} ITEMS</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
             <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
          </div>
        ) : filteredScenarios.length > 0 ? (
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
