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
      <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text-main)] p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-red-200 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error de Conexión</h2>
          <p className="text-slate-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl text-[var(--color-text-main)] tracking-tight">
                <div className="p-1.5 bg-[var(--color-primary)] text-white rounded-lg">
                  <Layout className="w-5 h-5" />
                </div>
                BackendMap
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Documentación</a>
                <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Contribuir</a>
                <a href="#" className="text-[var(--color-primary)] bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">Iniciar Sesión</a>
            </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto pt-24 pb-20 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Nueva Versión 1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-[var(--color-text-main)] tracking-tight leading-tight">
            Domina la <span className="text-[var(--color-primary)]">Arquitectura</span><br className="hidden md:block"/> de Software
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Explora diagramas interactivos de sistemas reales.
            Aprende cómo fluyen los datos entre servidores, bases de datos y APIs.
          </p>

          {/* Search Bar in Hero */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar escenarios (ej: Amazon, API, Database)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-lg placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-grow w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
            <Grid className="w-6 h-6 text-slate-400" />
            Escenarios Disponibles
          </h2>
          <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm">
            {filteredScenarios.length} resultados
          </div>
        </div>

        {filteredScenarios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredScenarios.map((scenario) => (
              <Link key={scenario.id} to={`/map/${scenario.slug}`} className="block group h-full">
                <article className="bg-white border border-[var(--color-border)] rounded-2xl p-6 h-full transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                    {scenario.title}
                  </h3>

                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {scenario.description}
                  </p>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center text-slate-400 text-sm">
                       <span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>
                       Interactivo
                    </div>
                    <div className="flex items-center text-[var(--color-primary)] text-sm font-bold group-hover:underline decoration-2 underline-offset-4">
                      Ver Diagrama <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListFilter className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No se encontraron resultados</h3>
            <p className="text-slate-500">Intenta con otros términos de búsqueda.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-6 text-[var(--color-primary)] font-semibold hover:underline cursor-pointer"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p className="mb-4">&copy; 2025 BackendMap. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 font-medium">
             <a href="#" className="hover:text-slate-900">Términos</a>
             <a href="#" className="hover:text-slate-900">Privacidad</a>
             <a href="#" className="hover:text-slate-900">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
