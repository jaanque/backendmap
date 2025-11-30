import { Link } from 'react-router-dom';
import { ArrowRight, Heart, BadgeCheck, Flame, Lock, Edit } from 'lucide-react';
import { formatNumber } from '../lib/utils';
import type { Scenario, UserProgress } from '../types';

interface ScenarioCardProps {
  scenario: Scenario;
  progress?: UserProgress;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  showFavoriteButton?: boolean;
  isHighlight?: boolean;
  currentUserId?: string;
}

export default function ScenarioCard({ scenario, progress, isFavorited, onToggleFavorite, showFavoriteButton = true, isHighlight = false, currentUserId }: ScenarioCardProps) {
  const stepsCount = scenario.steps?.[0]?.count || 0;
  const percent = progress && stepsCount > 0
    ? Math.min(100, Math.round(((progress.current_step_index + (progress.is_completed ? 1 : 0)) / stepsCount) * 100))
    : 0;

  return (
    <div className="block group relative">
      <article className={`border rounded-xl p-4 md:p-6 bg-white dark:bg-zinc-900 transition-colors duration-200 ease-in-out flex flex-col md:flex-row md:items-center justify-between gap-6 relative ${
        isHighlight
          ? 'border-orange-300 dark:border-orange-900/50 shadow-orange-100 dark:shadow-orange-900/10 shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-900/20 ring-1 ring-orange-200 dark:ring-orange-900/50 bg-orange-50/10 dark:bg-orange-900/10'
          : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 dark:hover:border-indigo-500 hover:shadow-sm'
      }`}>
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">{scenario.title || 'Untitled Scenario'}</h3>
            {!scenario.is_public && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700">
                <Lock size={10} />
                Private
              </span>
            )}
            {isHighlight && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 shadow-sm">
                <Flame size={12} className="fill-orange-500 text-orange-600 dark:text-orange-500" />
                Destacado del Día
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
              scenario.difficulty === 'Beginner' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50' :
              scenario.difficulty === 'Intermediate' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50' :
              'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/50'
            }`}>
              {scenario.difficulty || 'Unknown'}
            </span>
            {scenario.tags?.includes('Community') && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50">
                Community
              </span>
            )}
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-2xl">{scenario.description || 'No description available.'}</p>

          {scenario.author && (
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">By</span>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                {scenario.author.first_name} {scenario.author.last_name}
                {scenario.author.is_verified && (
                  <BadgeCheck size={14} className="text-blue-500 fill-blue-50 dark:fill-blue-900/50" strokeWidth={2.5} />
                )}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          {progress && (
            <div className="mt-4 max-w-xs">
              <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 mb-1">
                  <span>{progress.is_completed ? 'Completed' : 'In Progress'}</span>
                  <span>{percent}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progress.is_completed ? 'bg-green-500' : 'bg-zinc-900 dark:bg-zinc-100'}`}
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
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors pointer-events-auto flex items-center gap-1"
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
              {(scenario.favorites_count || 0) > 0 && (
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{formatNumber(scenario.favorites_count || 0)}</span>
              )}
            </button>
          )}

          {currentUserId && scenario.author_id === currentUserId && (
             <Link
               to={`/edit/${scenario.slug}`}
               className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors pointer-events-auto"
               title="Edit scenario"
             >
               <Edit className="w-5 h-5 text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400" />
             </Link>
          )}

          <div className="h-10 w-10 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:border-black dark:group-hover:border-white transition-colors">
            <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-white dark:group-hover:text-black" />
          </div>
        </div>

        <Link to={`/map/${scenario.slug}`} className="absolute inset-0 z-10 rounded-xl" />
      </article>
    </div>
  );
}
