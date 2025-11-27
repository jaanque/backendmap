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
            ? { stroke: 'var(--color-accent)', strokeWidth: 2 }
            : { stroke: '#cbd5e1', strokeWidth: 1.5 }
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
      <div className="flex h-screen bg-[var(--color-background)] items-center justify-center p-6">
         <div className="bg-white border border-red-300 p-8 rounded-lg shadow-sm text-center max-w-md w-full animate-fade-in-up">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-slate-600">{error}</p>
          <Link to="/" className="inline-block mt-6 text-[var(--color-accent)] font-bold hover:underline">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  if (!scenario) return (
    <div className="flex h-screen bg-slate-50 items-center justify-center">
      <RefreshCw className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
    </div>
  );

  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden flex-col md:flex-row font-sans">
      {/* Canvas Area */}
      <div className="flex-grow h-[60%] md:h-full md:w-[70%] relative bg-slate-50 border-r border-slate-300">
        <div className="absolute top-4 left-4 z-10">
          <Link to="/" className="flex items-center text-slate-700 hover:text-[var(--color-primary)] transition-colors bg-white px-3 py-2 rounded border border-slate-300 shadow-sm text-sm font-bold hover:shadow-md active:scale-95 duration-200">
            <ArrowLeft size={16} className="mr-2" /> Back
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
          <Background color="#cbd5e1" gap={20} size={1} variant={BackgroundVariant.Lines} />
          <Controls className="!bg-white !border-slate-300 !shadow-sm !rounded-md [&>button]:!border-b-slate-200 hover:[&>button]:!bg-slate-50 !fill-slate-700" />
        </ReactFlow>
      </div>

      {/* Sidebar - Solid Panel */}
      <div className="w-full h-[40%] md:h-full md:w-[30%] bg-white border-t md:border-t-0 border-slate-300 flex flex-col z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">

        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-mono font-bold text-slate-500 uppercase">Step Controller</span>
             <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-bold font-mono">
               {currentStepIndex + 1} / {steps.length}
             </span>
           </div>
           <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
             <div
               className="h-full bg-[var(--color-accent)] transition-all duration-300 ease-in-out"
               style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
             />
           </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4 text-[var(--color-text-main)] leading-tight tracking-tight">
              {currentStep?.title || 'Loading...'}
            </h1>
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="whitespace-pre-line text-base text-slate-600 leading-relaxed font-medium">
                {currentStep?.content || 'Select a step to begin.'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Controls - Hardware Style */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex-1 flex items-center justify-center py-3 rounded border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 duration-100"
            >
              <ChevronLeft className="mr-1" size={18} />
              PREV
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className="flex-1 flex items-center justify-center py-3 rounded bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 duration-100"
            >
              NEXT
              <ChevronRight className="ml-1" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
