import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getScenarioBySlug, getSteps } from '../lib/api';
import type { Scenario, Step } from '../types';
import CustomNode from '../components/CustomNode';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

export default function MapPlayer() {
  const { slug } = useParams<{ slug: string }>();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (slug) {
      getScenarioBySlug(slug).then((data) => {
        if (data) {
          setScenario(data);
          // Initialize nodes and edges from flow_data
          setNodes(data.flow_data.initialNodes);
          setEdges(data.flow_data.initialEdges);

          getSteps(data.id).then(setSteps);
        }
      });
    }
  }, [slug, setNodes, setEdges]);

  // Sync active state based on current step
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
            : { stroke: '#475569', strokeWidth: 1 }
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

  if (!scenario) return <div className="text-white p-10">Cargando escenario...</div>;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-white overflow-hidden flex-col md:flex-row">
      {/* Canvas Area */}
      <div className="flex-grow h-[60%] md:h-full md:w-[70%] relative border-r border-slate-800">
        <div className="absolute top-4 left-4 z-10">
          <Link to="/" className="flex items-center text-slate-400 hover:text-white transition-colors bg-slate-900/80 p-2 rounded-md backdrop-blur-sm">
            <ArrowLeft size={20} className="mr-2" /> Volver
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
        >
          <Background color="#334155" gap={16} />
          <Controls className="bg-slate-800 border-slate-700 fill-slate-300" />
        </ReactFlow>
      </div>

      {/* Sidebar / Bottom Sheet */}
      <div className="w-full h-[40%] md:h-full md:w-[30%] bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col shadow-2xl z-20">
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-sm text-[var(--color-primary)] font-mono mb-2 uppercase tracking-wider">
              Paso {currentStepIndex + 1} de {steps.length}
            </h2>
            <h1 className="text-2xl font-bold mb-4">{currentStep?.title || 'Cargando...'}</h1>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {currentStep?.content || 'Selecciona un paso para comenzar.'}
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex-1 flex items-center justify-center py-3 rounded-lg border border-slate-700 hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="mr-2" size={20} /> Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className="flex-1 flex items-center justify-center py-3 rounded-lg bg-[var(--color-primary)] text-black font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer"
            >
              Siguiente <ChevronRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
