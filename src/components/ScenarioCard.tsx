import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import type { Scenario, UserProgress } from '../types';

interface ScenarioCardProps {
  scenario: Scenario;
  progress?: UserProgress;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  showFavoriteButton?: boolean;
}

export default function ScenarioCard({ scenario, progress, isFavorited, onToggleFavorite, showFavoriteButton = true }: ScenarioCardProps) {
  const stepsCount = scenario.steps?.[0]?.count || 0;
  const percent = progress && stepsCount > 0
    ? Math.min(100, Math.round(((progress.current_step_index + (progress.is_completed ? 1 : 0)) / stepsCount) * 100))
    : 0;

  return (
    <div className="block group relative transition-transform active:scale-[0.99] duration-150">
      <article className="border border-zinc-200 rounded-xl p-6 bg-white hover:border-zinc-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-lg text-zinc-900 group-hover:text-zinc-600 transition-colors">{scenario.title || 'Untitled Scenario'}</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
              scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
              scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-100' :
              'bg-rose-50 text-rose-700 border-rose-100'
            }`}>
              {scenario.difficulty || 'Unknown'}
            </span>
            {scenario.tags?.includes('Community') && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border bg-indigo-50 text-indigo-700 border-indigo-100">
                Community
              </span>
            )}
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">{scenario.description || 'No description available.'}</p>

          {/* Progress Bar */}
          {progress && (
            <div className="mt-4 max-w-xs">
              <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  <span>{progress.is_completed ? 'Completed' : 'In Progress'}</span>
                  <span>{percent}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progress.is_completed ? 'bg-green-500' : 'bg-zinc-900'}`}
                    style={{ width: `${percent}%` }}
                  />
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 z-20 pointer-events-none">
          {showFavoriteButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(scenario.id);
              }}
              className="p-2 rounded-full hover:bg-zinc-100 transition-colors pointer-events-auto flex items-center gap-1"
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
              {(scenario.favorites_count || 0) > 0 && (
                <span className="text-xs font-semibold text-zinc-500">{scenario.favorites_count}</span>
              )}
            </button>
          )}

          <div className="h-10 w-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors">
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white" />
          </div>
        </div>

        <Link to={`/map/${scenario.slug}`} className="absolute inset-0 z-10 rounded-xl" />
      </article>
    </div>
  );
}
