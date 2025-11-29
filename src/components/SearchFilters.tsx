import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterDifficulty: string;
  setFilterDifficulty: (difficulty: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  filterDifficulty,
  setFilterDifficulty,
  sortOrder,
  setSortOrder
}: SearchFiltersProps) {
  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="relative group">
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

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                <Filter size={14} />
            </div>
            <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-full border border-zinc-200 bg-white text-sm font-medium text-zinc-600 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 outline-none cursor-pointer hover:bg-zinc-50 transition-all appearance-none"
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
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-full border border-zinc-200 bg-white text-sm font-medium text-zinc-600 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 outline-none cursor-pointer hover:bg-zinc-50 transition-all appearance-none"
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
