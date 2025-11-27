import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getScenarios } from '../lib/api';
import type { Scenario } from '../types';
import { ArrowRight, Search, Layers } from 'lucide-react';

export default function Home() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getScenarios()
      .then(setScenarios)
      .catch((err) => setError(err.message));
  }, []);

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
      {/* Simple Top Bar */}
      <nav className="border-b border-zinc-100 h-16 flex items-center justify-between px-6 md:px-12 sticky top-0 bg-white/90 backdrop-blur z-50">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          BackendMap
        </div>
        <div className="flex gap-6 text-sm font-medium text-zinc-500">
          <a href="#" className="hover:text-black transition-colors">Scenarios</a>
          <a href="#" className="hover:text-black transition-colors">About</a>
        </div>
      </nav>

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
              <Link key={scenario.id} to={`/map/${scenario.slug}`} className="block group">
                <article className="border border-zinc-200 rounded-xl p-6 bg-white hover:border-zinc-400 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-zinc-900 group-hover:text-indigo-600 transition-colors">{scenario.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                        scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">{scenario.description}</p>
                  </div>

                  <div className="flex-shrink-0 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors">
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/30">
             <p className="text-zinc-500 font-medium">No scenarios match your search.</p>
             <button onClick={() => setSearchQuery('')} className="mt-4 text-indigo-600 font-semibold hover:underline text-sm">Clear filter</button>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-100 py-12">
        <div className="px-6 md:px-12 max-w-5xl mx-auto flex justify-between items-center text-xs text-zinc-400 uppercase tracking-widest">
          <p>© 2025 BackendMap</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
             <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
