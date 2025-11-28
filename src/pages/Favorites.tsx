import { useEffect, useState, useMemo } from 'react';
import { getScenarios, getUserProgress, getUserFavorites, toggleFavorite } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import type { Scenario, UserProgress } from '../types';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ScenarioCard from '../components/ScenarioCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

    setLoading(true);
    getScenarios()
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

    const isFav = favorites.has(scenarioId);
    // Optimistic update
    const newFavs = new Set(favorites);
    if (isFav) newFavs.delete(scenarioId);
    else newFavs.add(scenarioId);
    setFavorites(newFavs);

    // Show toast
    showToast(isFav ? "Removed from favorites" : "Added to favorites", {
        type: 'success',
        onUndo: async () => {
             // Revert
             const revertFavs = new Set(newFavs);
             if (isFav) revertFavs.add(scenarioId); // It was removed, so add it back
             else revertFavs.delete(scenarioId); // It was added, so remove it
             setFavorites(revertFavs);

             try {
                await toggleFavorite(user.id, scenarioId, !isFav); // !isFav is the original state (undoing the toggle means setting it back to original)
                // Actually toggleFavorite takes the NEW state.
                // Wait, toggleFavorite(userId, scenarioId, isFavorite) -> isFavorite is the DESIRED state?
                // Let's check api.ts.
                // It says: if (isFavorite) { delete } else { insert }.
                // So the 3rd arg is "is currently favorite?".
                // No, let's read api.ts again carefully.
             } catch (err) {
                 console.error("Undo failed", err);
             }
        }
    });

    try {
      await toggleFavorite(user.id, scenarioId, isFav);
    } catch (err) {
      console.error("Failed to toggle favorite", err);
      setFavorites(favorites); // Revert on error
      showToast("Failed to update favorite", { type: 'error' });
    }
  };

  const favoriteScenarios = useMemo(() => {
    return scenarios.filter(s => favorites.has(s.id));
  }, [scenarios, favorites]);

  if (loading) {
     return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
        </div>
     );
  }

  if (!user) {
      return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-zinc-900">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Sign in to view favorites</h2>
                <p className="text-zinc-500 mb-8">Save scenarios to your library to access them quickly.</p>
                <Link to="/login" className="btn-pro btn-primary px-6 py-3 text-white no-underline">
                    Sign In
                </Link>
            </div>
            <Footer />
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-black selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 md:px-12 py-12 max-w-5xl mx-auto w-full">
        <div className="mb-10 flex items-center gap-3">
             <div className="p-3 bg-red-50 text-red-600 rounded-full">
                <Heart className="w-6 h-6 fill-red-600" />
             </div>
             <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Your Favorites</h1>
                <p className="text-zinc-500 mt-1">Manage your saved scenarios.</p>
             </div>
        </div>

        {favoriteScenarios.length > 0 ? (
          <div className="flex flex-col gap-4">
            {favoriteScenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                progress={userProgress[scenario.id]}
                isFavorited={true}
                onToggleFavorite={handleToggleFavorite}
                showFavoriteButton={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/30">
             <Heart className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
             <h3 className="text-lg font-bold text-zinc-900 mb-2">No favorites yet</h3>
             <p className="text-zinc-500 font-medium max-w-sm mx-auto mb-6">Start exploring scenarios and save the ones you want to revisit.</p>
             <Link to="/explore" className="btn-pro btn-secondary px-6 py-2 no-underline">
                Explore Scenarios
             </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
