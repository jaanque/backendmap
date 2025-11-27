import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getScenarios } from '../lib/api';
import type { Scenario } from '../types';
import { ArrowRight, Layout, Search, Grid, ListFilter } from 'lucide-react';

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
        <div className="bg-white border border-red-300 p-6 rounded-md shadow-sm max-w-md w-full">
          <h2 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
            Error de Conexión
          </h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans">
      {/* Navbar - Sticky & Solid */}
      <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 font-bold text-lg tracking-tight text-[var(--color-text-main)]">
                <div className="p-1.5 bg-[var(--color-primary)] text-white rounded">
                  <Layout className="w-5 h-5" />
                </div>
                BACKENDMAP
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--color-text-secondary)]">
                <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Docs</a>
                <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Contribute</a>
                <a href="#" className="text-white bg-[var(--color-primary)] px-5 py-2 rounded hover:bg-[var(--color-primary-hover)] transition-colors">Login</a>
            </nav>
        </div>
      </header>

      {/* Hero Section - Clean & Structured */}
      <section className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto pt-20 pb-16 px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[var(--color-text-main)] tracking-tight">
            Visualiza la Arquitectura.
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] mb-10 leading-relaxed font-medium">
            Plataforma educativa para diagramas de sistemas. <br/>
            Estructurado. Interactivo. Técnico.
          </p>

          <div className="max-w-lg mx-auto relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar escenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded border border-[var(--color-border-strong)] bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent font-medium transition-all placeholder:text-slate-400 text-[var(--color-text-main)]"
            />
          </div>
        </div>
      </section>

      {/* Main Content - Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--color-text-main)] uppercase tracking-wider flex items-center gap-2">
            <Grid className="w-5 h-5 text-[var(--color-text-muted)]" />
            Catálogo
          </h2>
          <span className="text-xs font-mono font-bold text-[var(--color-text-muted)] bg-slate-200 px-2 py-1 rounded">
            TOTAL: {filteredScenarios.length}
          </span>
        </div>

        {filteredScenarios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScenarios.map((scenario) => (
              <Link key={scenario.id} to={`/map/${scenario.slug}`} className="group h-full block">
                <article className="bg-white border border-[var(--color-border)] rounded-lg p-6 h-full transition-all hover:border-[var(--color-accent)] hover:shadow-md flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                      scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-[var(--color-text-main)] group-hover:text-[var(--color-accent)] transition-colors">
                    {scenario.title}
                  </h3>

                  <p className="text-[var(--color-text-secondary)] text-sm mb-6 leading-relaxed flex-grow border-b border-dashed border-slate-200 pb-4">
                    {scenario.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-mono text-slate-400">ID: {scenario.slug.split('-')[0]}</span>
                    <div className="flex items-center text-[var(--color-accent)] text-sm font-bold">
                      ABRIR <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-[var(--color-border)] rounded-lg border-dashed">
            <ListFilter className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[var(--color-text-main)]">Sin resultados</h3>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-[var(--color-accent)] font-bold hover:underline"
            >
              Resetear Filtros
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-[var(--color-border)] py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-[var(--color-text-muted)] text-sm font-medium">
          <p>&copy; 2025 BackendMap System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
