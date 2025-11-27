import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getScenarios } from '../lib/api';
import type { Scenario } from '../types';
import { ArrowRight, Layout } from 'lucide-react';

export default function Home() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getScenarios()
      .then(setScenarios)
      .catch((err) => setError(err.message));
  }, []);

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
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto py-6 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl text-[var(--color-text-main)]">
                <Layout className="w-6 h-6 text-[var(--color-primary)]" />
                BackendMap
            </div>
            <nav className="text-sm font-medium text-slate-600">
                v1.0
            </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto pt-20 pb-20 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-[var(--color-text-main)] tracking-tight">
          Entiende la Arquitectura
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Diagramas interactivos explicados paso a paso.
          Una forma sólida de visualizar flujos de datos complejos.
        </p>
        <button className="bg-[var(--color-primary)] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm cursor-pointer">
          Explorar Escenarios
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-main)]">Catálogo de Escenarios</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Link key={scenario.id} to={`/map/${scenario.slug}`} className="block group">
              <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 h-full transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                    scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {scenario.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">{scenario.title}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">{scenario.description}</p>
                <div className="flex items-center text-[var(--color-primary)] text-sm font-semibold">
                  Ver Diagrama <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
