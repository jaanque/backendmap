import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, type Node, type Edge, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getScenarioBySlug, getSteps } from '../lib/api';
import type { Scenario, Step } from '../types';
import CustomNode from '../components/CustomNode';
import { ChevronLeft, ChevronRight, ArrowLeft, RefreshCw } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

export default function MapPlayer() {
  const { slug } = useParams<{ slug: string }>();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (slug) {
      getScenarioBySlug(slug)
        .then((data) => {
          if (data) {
            setScenario(data);
            setNodes(data.flow_data.initialNodes);
            setEdges(data.flow_data.initialEdges);

            return getSteps(data.id).then(setSteps);
          } else {
            setError('Escenario no encontrado');
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [slug, setNodes, setEdges]);

  useEffect(() => {
    if (steps.length > 0) {
      const currentStep = steps[currentStepIndex];

      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isActive: node.id === currentStep.active_node_id
          }
        }))
      );

      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          animated: edge.id === currentStep.active_edge_id,
          style: edge.id === currentStep.active_edge_id
            ? { stroke: 'var(--color-primary)', strokeWidth: 2, filter: 'drop-shadow(0 0 4px var(--color-primary))' }
            : { stroke: '#3f3f46', strokeWidth: 1 }
        }))
      );
    }
  }, [currentStepIndex, steps, setNodes, setEdges]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  if (error) {
    return (
      <div className="flex h-screen bg-[var(--color-background)] text-white items-center justify-center">
         <div className="glass p-8 rounded-2xl max-w-md text-center border border-red-500/20">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-zinc-400">{error}</p>
          <Link to="/" className="inline-block mt-6 text-[var(--color-primary)] hover:text-white transition-colors text-sm font-medium">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  if (!scenario) return (
    <div className="flex h-screen bg-[var(--color-background)] items-center justify-center">
      <RefreshCw className="w-6 h-6 text-[var(--color-primary)] animate-spin" />
    </div>
  );

  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-white overflow-hidden flex-col md:flex-row">
      {/* Canvas Area */}
      <div className="flex-grow h-[60%] md:h-full md:w-[70%] relative">
        <div className="absolute top-6 left-6 z-10">
          <Link to="/" className="flex items-center text-zinc-400 hover:text-white transition-colors bg-zinc-900/50 hover:bg-zinc-900 px-4 py-2 rounded-full backdrop-blur-md border border-zinc-800 hover:border-zinc-700 text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" /> Volver
          </Link>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          fitView
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#27272a" gap={20} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-zinc-900 !border-zinc-800 !fill-zinc-400 [&>button]:!border-b-zinc-800 hover:[&>button]:!bg-zinc-800" />
        </ReactFlow>
      </div>

      {/* Sidebar */}
      <div className="w-full h-[40%] md:h-full md:w-[30%] bg-[#09090b] border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col shadow-2xl z-20 relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900">
           <div
             className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out shadow-[0_0_10px_var(--color-primary)]"
             style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
           />
        </div>

        <div className="p-8 flex-grow overflow-y-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider bg-[var(--color-primary)]/10 px-2 py-1 rounded">
                Paso {currentStepIndex + 1} / {steps.length}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-6 text-white leading-tight">{currentStep?.title || 'Cargando...'}</h1>
            <div className="prose prose-invert prose-p:text-zinc-400 prose-p:leading-relaxed max-w-none">
              <p className="whitespace-pre-line text-lg font-light">
                {currentStep?.content || 'Selecciona un paso para comenzar.'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="p-8 border-t border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="group flex-1 flex items-center justify-center py-4 rounded-xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
              <span className="font-medium text-zinc-300">Anterior</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className="group flex-1 flex items-center justify-center py-4 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-white/5"
            >
              <span className="font-bold">Siguiente</span>
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
