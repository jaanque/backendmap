import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getScenarios } from '../lib/api';
import type { Scenario } from '../types';
import { ArrowRight, Layout, Search, Command, Activity, Zap } from 'lucide-react';

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
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md w-full text-center">
          <h2 className="text-lg font-bold text-red-900 mb-2">Connection Error</h2>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <header className="border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container-pro h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Layout className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-xl tracking-tight">BackendMap</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-muted)]">
                <a href="#" className="hover:text-[var(--color-foreground)] transition-colors">Documentation</a>
                <a href="#" className="hover:text-[var(--color-foreground)] transition-colors">Community</a>
                <a href="#" className="btn-pro btn-secondary px-5 py-2.5 text-sm">Sign In</a>
                <a href="#" className="btn-pro btn-primary px-5 py-2.5 text-sm">Get Started</a>
            </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-[var(--color-border)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
        <div className="container-pro py-32 md:py-48 grid md:grid-cols-2 gap-24 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-600 mb-10">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              v1.0 is live
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-10 text-[var(--color-foreground)] leading-[1.05] tracking-tight">
              Master System <br/>
              <span className="text-[var(--color-muted)]">Architecture</span>
            </h1>

            <p className="text-xl md:text-2xl text-[var(--color-muted)] mb-14 leading-relaxed font-normal max-w-lg">
              Interactive flowcharts that narrate the journey of data. Built for developers who learn by seeing.
            </p>

            <div className="relative max-w-lg group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                <Search className="h-6 w-6 text-zinc-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search scenarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-5 rounded-2xl border border-[var(--color-border)] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all font-medium text-lg text-[var(--color-foreground)] placeholder:text-zinc-400"
              />
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <div className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-500">
                  <Command className="w-3 h-3" /> K
                </div>
              </div>
            </div>
          </div>

          {/* Abstract Visual / Decorative */}
          <div className="relative h-[500px] bg-white rounded-3xl border border-[var(--color-border)] shadow-2xl p-10 hidden md:block overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-700 ease-out">
             {/* Mock UI Elements */}
             <div className="flex items-center justify-between mb-12 border-b border-dashed border-zinc-100 pb-6">
               <div className="flex gap-3">
                 <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-yellow-400"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-green-400"></div>
               </div>
               <div className="h-2.5 w-24 bg-zinc-100 rounded-full"></div>
             </div>

             <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1 h-40 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                   <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-zinc-200 flex items-center justify-center">
                      <Zap className="w-7 h-7 text-indigo-500" />
                   </div>
                </div>
                <div className="col-span-1 mt-16 h-40 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                   <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-zinc-200 flex items-center justify-center">
                      <Activity className="w-7 h-7 text-emerald-500" />
                   </div>
                </div>
                <div className="col-span-1 h-40 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                   <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-zinc-200 flex items-center justify-center">
                      <Layout className="w-7 h-7 text-amber-500" />
                   </div>
                </div>
             </div>

             {/* Connecting Lines (Fake) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ opacity: 0.15 }}>
               <path d="M120 180 Q 180 180 240 240" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />
               <path d="M300 240 Q 360 240 420 180" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />
             </svg>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-pro py-32 flex-grow w-full">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">Explore Scenarios</h2>
            <p className="text-[var(--color-muted)] text-lg">Select a system to analyze its data flow.</p>
          </div>
          <div className="text-sm font-medium text-[var(--color-muted)] bg-zinc-100 px-4 py-1.5 rounded-full border border-zinc-200">
            {filteredScenarios.length} Systems
          </div>
        </div>

        {filteredScenarios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredScenarios.map((scenario) => (
              <Link key={scenario.id} to={`/map/${scenario.slug}`} className="group h-full block">
                <article className="card-pro h-full p-8 flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                        <Activity className="w-6 h-6" />
                     </div>
                     <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                      scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                    {scenario.title}
                  </h3>

                  <p className="text-[var(--color-muted)] text-base mb-10 leading-relaxed flex-grow">
                    {scenario.description}
                  </p>

                  <div className="flex items-center text-[var(--color-foreground)] text-sm font-semibold mt-auto border-t border-dashed border-zinc-100 pt-6 group-hover:border-zinc-200 transition-colors">
                    Start Simulation <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 rounded-3xl border border-dashed border-[var(--color-border)] bg-zinc-50/50">
            <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3">No scenarios found</h3>
            <p className="text-[var(--color-muted)] mb-8 text-lg">Try adjusting your search terms.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[var(--color-accent)] font-semibold hover:underline text-lg"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--color-border)] py-20 bg-zinc-50">
        <div className="container-pro flex flex-col md:flex-row justify-between items-center text-sm text-[var(--color-muted)]">
          <p>&copy; 2025 BackendMap. Crafted with precision.</p>
          <div className="flex gap-8 mt-6 md:mt-0 font-medium">
             <a href="#" className="hover:text-[var(--color-foreground)] transition-colors">Privacy</a>
             <a href="#" className="hover:text-[var(--color-foreground)] transition-colors">Terms</a>
             <a href="#" className="hover:text-[var(--color-foreground)] transition-colors">Twitter</a>
             <a href="#" className="hover:text-[var(--color-foreground)] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
