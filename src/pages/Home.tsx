import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PlayCircle, BookOpen, Share2 } from 'lucide-react';
import { getScenarios, getDailyHighlights, getUserProgress, getUserFavorites, setFavorite } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import type { Scenario, UserProgress } from '../types';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ScenarioCard from '../components/ScenarioCard';
import SearchFilters from '../components/SearchFilters';

export default function Home() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [dailyHighlights, setDailyHighlights] = useState<Scenario[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    // Fetch 2 highlights as requested by user
    Promise.all([getScenarios(), getDailyHighlights(2)])
      .then(async ([allScenarios, highlights]) => {
        setScenarios(allScenarios);
        setDailyHighlights(highlights);
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

    // Optimistic count update
    const updateCount = (list: Scenario[], increment: number) =>
        list.map(s => s.id === scenarioId ? { ...s, favorites_count: (s.favorites_count || 0) + increment } : s);

    setScenarios(prev => updateCount(prev, newFavState ? 1 : -1));
    setDailyHighlights(prev => updateCount(prev, newFavState ? 1 : -1));

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
          setScenarios(prev => updateCount(prev, newFavState ? -1 : 1));
          setDailyHighlights(prev => updateCount(prev, newFavState ? -1 : 1));

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
      setScenarios(prev => updateCount(prev, newFavState ? -1 : 1));
      setDailyHighlights(prev => updateCount(prev, newFavState ? -1 : 1));
      showToast("Failed to update favorite", { type: 'error' });
    }
  };

  const filteredScenarios = useMemo(() => {
    let result = [...scenarios];

    // Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery)
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black transition-colors duration-300">
      <Helmet>
        <title>BackendMap - Visualize System Architecture</title>
        <meta name="description" content="Interactive platform to learn, design and visualize backend flows. Understand how data moves through databases, queues, and microservices." />
        <meta property="og:title" content="BackendMap - Visualize System Architecture" />
        <meta property="og:description" content="Interactive platform to learn, design and visualize backend flows." />
        <meta property="og:type" content="website" />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <header id="main-content" className="py-24 px-4 md:px-12 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white leading-[1.1]">
          System Architecture <br/>
          <span className="text-zinc-400 dark:text-zinc-500">Visualized.</span>
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The interactive platform to learn, design and visualize backend flows.<br/>
          See exactly how data moves through databases, queues, and microservices.
        </p>

        {!user && (
          <div className="flex justify-center gap-4 mb-12">
            <Link to="/register" className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-black dark:hover:bg-zinc-200 transition-all hover:shadow-lg hover:scale-105 active:scale-95">
              Get Started Free
            </Link>
            <Link to="/explore" className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-full font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all hover:shadow active:scale-95">
              Explore Catalog
            </Link>
          </div>
        )}

        {/* Command Bar Search */}
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </header>

      {/* How it Works Section */}
      <section className="px-4 md:px-12 max-w-5xl mx-auto mb-20 animate-fade-in-up">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 md:p-12 border border-zinc-100 dark:border-zinc-800 transition-colors">
           <h2 className="text-2xl font-bold text-center mb-10 text-zinc-900 dark:text-white">How BackendMap Works</h2>
           <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 transition-colors">
                    <BookOpen size={24} />
                 </div>
                 <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white">1. Choose a Scenario</h3>
                 <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                   Browse our catalog of real-world architecture patterns, from simple APIs to complex microservices.
                 </p>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 transition-colors">
                    <PlayCircle size={24} />
                 </div>
                 <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white">2. Watch the Flow</h3>
                 <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                   Step through the request lifecycle. See exactly how data travels between servers, queues, and databases.
                 </p>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 transition-colors">
                    <Share2 size={24} />
                 </div>
                 <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white">3. Master & Share</h3>
                 <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                   Complete scenarios to unlock achievements, track your progress, and share your profile with the community.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Content - Technical List */}
      <main className="px-4 md:px-12 pb-32 max-w-5xl mx-auto animate-fade-in-up">
        <div className="mb-6 flex items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Catalog</h2>
          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">
            {filteredScenarios.length + (dailyHighlights.length > 0 ? dailyHighlights.length : 0)} ITEMS
          </span>
        </div>

        {(filteredScenarios.length > 0 || dailyHighlights.length > 0) ? (
          <div className="grid grid-cols-1 gap-4" role="list">
            {/* Render Daily Highlights first */}
            {dailyHighlights.map((scenario) => (
              <div role="listitem" key={`highlight-${scenario.id}`}>
                <ScenarioCard
                  scenario={scenario}
                  progress={userProgress[scenario.id]}
                  isFavorited={favorites.has(scenario.id)}
                  onToggleFavorite={handleToggleFavorite}
                  showFavoriteButton={!!user}
                  isHighlight={true}
                  currentUserId={user?.id}
                />
              </div>
            ))}

            {/* Render remaining filtered scenarios, excluding duplicates */}
            {filteredScenarios
              .filter(s => !dailyHighlights.find(h => h.id === s.id))
              .map((scenario) => (
                <div role="listitem" key={scenario.id}>
                  <ScenarioCard
                    scenario={scenario}
                    progress={userProgress[scenario.id]}
                    isFavorited={favorites.has(scenario.id)}
                    onToggleFavorite={handleToggleFavorite}
                    showFavoriteButton={!!user}
                    currentUserId={user?.id}
                  />
                </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/30 flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
               <span className="text-2xl" role="img" aria-label="Magnifying glass">🔍</span>
             </div>
             <p className="text-zinc-600 font-medium text-lg">No scenarios match your search.</p>
             <p className="text-zinc-400 text-sm mt-1 mb-6 max-w-sm">Try adjusting your search terms or filters to find what you're looking for.</p>
             <button
               onClick={() => {
                 setSearchQuery('');
                 setFilterDifficulty('All');
                 setSortOrder('newest');
               }}
               className="btn-pro btn-secondary px-6 py-2"
             >
               Clear all filters
             </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
