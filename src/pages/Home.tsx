import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getScenarios } from '../lib/api';
import type { Scenario } from '../types';
import { ArrowRight } from 'lucide-react';

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
      <div className="min-h-screen bg-[var(--color-background)] text-white p-8 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error de Conexión</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white p-8">
      <header className="max-w-6xl mx-auto py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
          BackendMap
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Visualiza arquitecturas complejas paso a paso. Entiende cómo fluyen los datos en sistemas reales.
        </p>
        <button className="bg-[var(--color-primary)] text-black font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">
          Empezar Ahora
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Escenarios Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Link key={scenario.id} to={`/map/${scenario.slug}`} className="block group">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-mono ${
                    scenario.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                    scenario.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {scenario.difficulty}
                  </span>
                  <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-bold">NUEVO</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors">{scenario.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{scenario.description}</p>
                <div className="flex items-center text-[var(--color-primary)] text-sm font-medium">
                  Explorar <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
