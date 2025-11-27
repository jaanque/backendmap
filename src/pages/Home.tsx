import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getScenarios } from '../lib/api';
import type { Scenario } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

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
        <div className="glass p-8 rounded-2xl max-w-md text-center border border-red-500/20">
          <h2 className="text-xl font-bold text-red-400 mb-2">Conexión Fallida</h2>
          <p className="text-zinc-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[var(--color-primary)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <header className="relative max-w-5xl mx-auto pt-32 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 mb-8 font-medium backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          v1.0 Available Now
        </div>
        <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight text-white">
          Visualiza tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Arquitectura</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          BackendMap transforma diagramas estáticos en experiencias narrativas.
          Entiende el flujo de datos paso a paso.
        </p>
        <button className="bg-white text-black font-semibold py-4 px-10 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] cursor-pointer">
          Comenzar Aventura
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-zinc-200">Escenarios</h2>
          <div className="text-sm text-zinc-500">Mostrando {scenarios.length} resultados</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Link key={scenario.id} to={`/map/${scenario.slug}`} className="group relative">
              <div className="glass h-full p-8 rounded-2xl transition-all duration-300 group-hover:bg-zinc-900/80 group-hover:border-[var(--color-primary)]/30 group-hover:shadow-[0_0_30px_-15px_rgba(34,211,238,0.15)] flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                    scenario.difficulty === 'Beginner' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                    scenario.difficulty === 'Intermediate' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
                    'border-rose-500/20 text-rose-400 bg-rose-500/5'
                  }`}>
                    {scenario.difficulty}
                  </div>
                  <Sparkles className="w-4 h-4 text-zinc-600 group-hover:text-[var(--color-primary)] transition-colors" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[var(--color-primary)] transition-colors">
                  {scenario.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
                  {scenario.description}
                </p>

                <div className="flex items-center text-zinc-500 text-sm font-medium group-hover:text-white transition-colors">
                  Explorar Diagrama <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
