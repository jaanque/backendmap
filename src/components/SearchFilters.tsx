import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterDifficulty: string;
  setFilterDifficulty: (difficulty: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  layout?: 'horizontal' | 'vertical';
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  filterDifficulty,
  setFilterDifficulty,
  sortOrder,
  setSortOrder,
  layout = 'horizontal'
}: SearchFiltersProps) {
  const isVertical = layout === 'vertical';

  return (
    <div className={`${isVertical ? 'w-full space-y-6' : 'max-w-xl mx-auto space-y-4'}`}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className={`text-zinc-400 group-focus-within:text-black  transition-colors ${isVertical ? 'h-4 w-4' : 'h-5 w-5'}`} />
        </div>
        <input
          type="text"
          placeholder="Search scenarios..."
          aria-label="Search scenarios"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 rounded-xl border border-zinc-200  bg-zinc-50/50  shadow-sm focus:bg-white  focus:ring-2 focus:ring-black  focus:border-transparent outline-none transition-all font-medium placeholder:text-zinc-400 ${isVertical ? 'py-2.5 text-sm' : 'py-4 text-lg'}`}
        />
      </div>

      {/* Filters */}
      <div className={`flex ${isVertical ? 'flex-col items-stretch gap-4' : 'flex-wrap items-center justify-center gap-3'}`}>

        {isVertical && <h3 className="text-xs font-bold text-zinc-400  uppercase tracking-wider">Filters</h3>}

        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                <Filter size={14} />
            </div>
            <select
                aria-label="Filter by difficulty"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className={`pl-9 pr-8 rounded-lg border border-zinc-200  bg-white  text-sm font-medium text-zinc-600  focus:border-zinc-400  focus:ring-2 focus:ring-zinc-100  outline-none cursor-pointer hover:bg-zinc-50  transition-all appearance-none w-full ${isVertical ? 'py-2.5' : 'py-2 rounded-full'}`}
            >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
        </div>

        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                <ArrowUpDown size={14} />
            </div>
            <select
                aria-label="Sort scenarios"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={`pl-9 pr-8 rounded-lg border border-zinc-200  bg-white  text-sm font-medium text-zinc-600  focus:border-zinc-400  focus:ring-2 focus:ring-zinc-100  outline-none cursor-pointer hover:bg-zinc-50  transition-all appearance-none w-full ${isVertical ? 'py-2.5' : 'py-2 rounded-full'}`}
            >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest First</option>
            </select>
        </div>
      </div>
    </div>
  );
}
