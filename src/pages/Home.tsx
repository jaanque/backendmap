import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getScenarios } from '../lib/api';
import type { Scenario } from '../types';
import { ArrowRight, Layout, Search, Grid, ListFilter, Terminal } from 'lucide-react';

export default function Home() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getScenarios()
      .then(data => {
        setScenarios(data);
      })
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
        <div className="bg-white border border-red-300 p-6 rounded-md shadow-sm max-w-md w-full animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <h2 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
            Error de Conexión
          </h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans flex flex-col">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--color-border)] sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 font-bold text-lg tracking-tight text-[var(--color-text-main)] hover:opacity-80 transition-opacity">
                <div className="p-1.5 bg-[var(--color-primary)] text-white rounded shadow-sm">
                  <Layout className="w-5 h-5" />
                </div>
                BACKENDMAP
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--color-text-secondary)]">
                <a href="#" className="hover:text-[var(--color-primary)] transition-colors duration-200">Docs</a>
                <a href="#" className="hover:text-[var(--color-primary)] transition-colors duration-200">Contribute</a>
                <a href="#" className="text-white bg-[var(--color-primary)] px-5 py-2 rounded shadow-sm hover:bg-[var(--color-primary-hover)] hover:shadow transition-all duration-200 btn-press">Login</a>
            </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-[var(--color-border)] relative overflow-hidden">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto pt-24 pb-20 px-6 text-center relative z-10">
          <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 mb-8 shadow-sm">
              <Terminal className="w-3 h-3" />
              v1.0 RELEASE
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-[var(--color-text-main)] tracking-tight leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Visualiza la <span className="text-[var(--color-accent)]">Arquitectura</span>.
          </h1>

          <p className="text-xl text-[var(--color-text-secondary)] mb-12 leading-relaxed font-medium max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            La plataforma definitiva para entender sistemas complejos. <br className="hidden md:block"/>
            Estructurado. Interactivo. Técnico.
          </p>

          <div className="max-w-lg mx-auto relative group animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-300">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[var(--color-accent)]" />
            </div>
            <input
              type="text"
              placeholder="Buscar escenarios (ej. API, Database)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-[var(--color-border-strong)] bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[var(--color-accent)] font-medium transition-all duration-300 placeholder:text-slate-400 text-[var(--color-text-main)] shadow-sm hover:border-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-grow w-full">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-lg font-bold text-[var(--color-text-main)] uppercase tracking-wider flex items-center gap-2">
            <Grid className="w-5 h-5 text-[var(--color-text-muted)]" />
            Catálogo
          </h2>
          <span className="text-xs font-mono font-bold text-[var(--color-text-muted)] bg-slate-200/50 border border-slate-200 px-3 py-1.5 rounded">
            TOTAL: {filteredScenarios.length}
          </span>
        </div>

        {filteredScenarios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredScenarios.map((scenario, index) => (
              <Link
                key={scenario.id}
                to={`/map/${scenario.slug}`}
                className="group h-full block animate-fade-in-up"
                style={{ animationDelay: `${500 + (index * 50)}ms` }}
              >
                <article className="bg-white border border-[var(--color-border)] rounded-xl p-6 h-full transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-1 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex justify-between items-start mb-5">
                     <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border transition-colors ${
                      scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-100' :
                      scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-100' :
                      'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-100'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-[var(--color-text-main)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {scenario.title}
                  </h3>

                  <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed flex-grow border-b border-dashed border-slate-100 pb-6 group-hover:border-slate-200 transition-colors">
                    {scenario.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-mono text-slate-400 group-hover:text-slate-500 transition-colors">ID: {scenario.slug.split('-')[0]}</span>
                    <div className="flex items-center text-[var(--color-accent)] text-sm font-bold group-hover:underline decoration-2 underline-offset-4">
                      ABRIR <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-[var(--color-border)] rounded-xl border-dashed animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <ListFilter className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">Sin resultados</h3>
            <p className="text-slate-500 mb-6">No encontramos escenarios que coincidan con tu búsqueda.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[var(--color-accent)] font-bold hover:underline btn-press"
            >
              Resetear Filtros
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-[var(--color-border)] py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-[var(--color-text-muted)] text-sm font-medium">
          <p>&copy; 2025 BackendMap System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
