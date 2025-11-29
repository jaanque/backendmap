import { useEffect, useState } from 'react';
import { getScenariosByAuthor, getUserProgress, getUserFavorites, setFavorite } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import type { Scenario, UserProgress } from '../types';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ScenarioCard from '../components/ScenarioCard';

export default function MyScenarios() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getScenariosByAuthor(user.id)
      .then(async (data) => {
        setScenarios(data);
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
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggleFavorite = async (scenarioId: string) => {
    if (!user) return;

    const isCurrentlyFav = favorites.has(scenarioId);
    const newFavState = !isCurrentlyFav;

    const newFavs = new Set(favorites);
    if (newFavState) newFavs.add(scenarioId);
    else newFavs.delete(scenarioId);
    setFavorites(newFavs);

    setScenarios(prev => prev.map(s => s.id === scenarioId ? { ...s, favorites_count: (s.favorites_count || 0) + (newFavState ? 1 : -1) } : s));

    showToast(newFavState ? "Added to favorites" : "Removed from favorites", {
      type: 'success',
      onUndo: async () => {
          const revertFavs = new Set(newFavs);
          if (newFavState) revertFavs.delete(scenarioId);
          else revertFavs.add(scenarioId);
          setFavorites(revertFavs);
          setScenarios(prev => prev.map(s => s.id === scenarioId ? { ...s, favorites_count: (s.favorites_count || 0) + (newFavState ? -1 : 1) } : s));

          try {
              await setFavorite(user.id, scenarioId, isCurrentlyFav);
          } catch (err) {
              console.error("Undo failed", err);
          }
      }
    });

    try {
      await setFavorite(user.id, scenarioId, newFavState);
    } catch (err) {
      console.error("Failed to toggle favorite", err);
      setFavorites(favorites);
      setScenarios(prev => prev.map(s => s.id === scenarioId ? { ...s, favorites_count: (s.favorites_count || 0) + (newFavState ? -1 : 1) } : s));
      showToast("Failed to update favorite", { type: 'error' });
    }
  };

  if (!user) {
      return (
        <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-black selection:text-white">
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <p>Please log in to view your scenarios.</p>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-black selection:text-white">
      <Navbar />

      <main className="px-4 md:px-12 py-12 max-w-5xl mx-auto animate-fade-in-up">
        <div id="main-content" className="mb-8 border-b border-zinc-100 pb-4">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">My Scenarios</h1>
          <p className="text-zinc-500 text-sm">Manage your public and private scenarios.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
             <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
                <p className="text-red-700 text-sm">{error}</p>
            </div>
        ) : scenarios.length > 0 ? (
          <div className="flex flex-col gap-4">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                progress={userProgress[scenario.id]}
                isFavorited={favorites.has(scenario.id)}
                onToggleFavorite={handleToggleFavorite}
                showFavoriteButton={true}
                currentUserId={user.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/30">
             <p className="text-zinc-500 font-medium">You haven't created any scenarios yet.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
