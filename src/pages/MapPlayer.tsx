import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, type Node, type Edge, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getScenarioBySlug, getSteps } from '../lib/api';
import type { Scenario, Step } from '../types';
import CustomNode from '../components/CustomNode';
import { ChevronLeft, ChevronRight, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

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
            ? { stroke: 'var(--color-primary)', strokeWidth: 2 }
            : { stroke: '#cbd5e1', strokeWidth: 1 }
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
      <div className="flex h-screen bg-[var(--color-background)] items-center justify-center">
         <div className="bg-white p-8 rounded-lg border border-red-200 shadow-sm text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-slate-600">{error}</p>
          <Link to="/" className="inline-block mt-6 text-[var(--color-primary)] font-semibold hover:underline">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  if (!scenario) return (
    <div className="flex h-screen bg-slate-50 items-center justify-center">
      <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
    </div>
  );

  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex h-screen bg-white overflow-hidden flex-col md:flex-row font-sans">
      {/* Canvas Area */}
      <div className="flex-grow h-[60%] md:h-full md:w-[70%] relative bg-slate-50">
        <div className="absolute top-4 left-4 z-10">
          <Link to="/" className="flex items-center text-slate-600 hover:text-[var(--color-primary)] transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-semibold">
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
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#94a3b8" gap={24} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-white !border-slate-200 !shadow-sm [&>button]:!border-b-slate-100 hover:[&>button]:!bg-slate-50 !fill-slate-600" />
        </ReactFlow>
      </div>

      {/* Sidebar */}
      <div className="w-full h-[40%] md:h-full md:w-[30%] bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col shadow-xl z-20 relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
           <div
             className="h-full bg-[var(--color-primary)] transition-all duration-300 ease-in-out"
             style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
           />
        </div>

        <div className="p-8 flex-grow overflow-y-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                Paso {currentStepIndex + 1} de {steps.length}
              </span>
              <Layers className="w-5 h-5 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-[var(--color-text-main)] leading-snug">{currentStep?.title || 'Cargando...'}</h1>
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-line text-lg text-slate-600 leading-relaxed">
                {currentStep?.content || 'Selecciona un paso para comenzar.'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex-1 flex items-center justify-center py-3.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm cursor-pointer"
            >
              <ChevronLeft className="mr-2" size={20} />
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className="flex-1 flex items-center justify-center py-3.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md shadow-blue-200 cursor-pointer"
            >
              Siguiente
              <ChevronRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
