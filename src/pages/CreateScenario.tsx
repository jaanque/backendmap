import { useState, useCallback, useRef, useEffect } from 'react';
import { ReactFlow, ReactFlowProvider, addEdge, useNodesState, useEdgesState, Controls, Background, useReactFlow, type Node, type Edge, type Connection, BackgroundVariant, useOnSelectionChange, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../components/CustomNode';
import PacketEdge from '../components/PacketEdge';
import Navbar from '../components/Navbar';
import { useAuth } from '../lib/auth';
import { checkSlugAvailability, createScenario, updateScenario, createSteps, deleteSteps, getScenarioBySlug, getSteps } from '../lib/api';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Monitor, Server, Cpu, Database, Cloud, Save, X, Loader2, GripVertical, ListOrdered, Layers, Trash2, Plus, Target, Lock, Globe, Smartphone, Tablet, HardDrive, Router, Shield, Laptop, ZoomIn, ZoomOut, Maximize, MousePointer2 } from 'lucide-react';
import type { StepInput } from '../types';
import { supabase } from '../lib/supabase';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  packet: PacketEdge,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 150 },
    data: { label: 'Start Here', icon: 'server' },
  },
];

let id = 1;
const getId = () => `dndnode_${id++}`;

function CreateScenario() {
  const navigate = useNavigate();
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const forkSlug = searchParams.get('fork_slug');

  const { user } = useAuth();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = useReactFlow();

  const [activeTab, setActiveTab] = useState<'build' | 'steps'>('build');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selection State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Steps State
  const [steps, setSteps] = useState<StepInput[]>([]);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [draggedStepIndex, setDraggedStepIndex] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [parentScenarioId, setParentScenarioId] = useState<string | null>(null);

  // Load Existing Scenario (Edit Mode) or Fork Source
  useEffect(() => {
    const loadScenario = async (slugToLoad: string, mode: 'edit' | 'fork') => {
        const data = await getScenarioBySlug(slugToLoad);
        if (!data) return;

        if (mode === 'edit') {
             // Check permission (Owner)
             if (!user || data.author_id !== user.id) {
                 alert("You do not have permission to edit this scenario.");
                 navigate(`/map/${slugToLoad}`);
                 return;
             }

            setIsEditMode(true);
            setEditingScenarioId(data.id);
            setSlug(data.slug);
        } else {
            // Fork Mode
            setTitle(`${data.title} (Fork)`);
            setParentScenarioId(data.id);
            // Don't set slug, let user choose new one
        }

        // Common data population
        if (mode === 'edit') setTitle(data.title);
        setDescription(data.description);
        setDifficulty(data.difficulty);
        setIsPublic(data.is_public ?? true);
        setNodes(data.flow_data.initialNodes || []);
        setEdges(data.flow_data.initialEdges || []);

        const fetchedSteps = await getSteps(data.id);
        setSteps(fetchedSteps.map(s => ({
            order_index: s.order_index,
            title: s.title,
            content: s.content || '',
            active_node_id: s.active_node_id,
            active_edge_id: s.active_edge_id
        })));
    };

    if (routeSlug) {
        loadScenario(routeSlug, 'edit');
    } else if (forkSlug) {
        loadScenario(forkSlug, 'fork');
    }
  }, [routeSlug, forkSlug, user, navigate, setNodes, setEdges]);

  // Helper to highlight active node/edge for selected step
  useOnSelectionChange({
    onChange: ({ nodes: selectedNodes, edges: selectedEdges }) => {
      const activeNode = selectedNodes[0]?.id || null;
      const activeEdge = selectedEdges[0]?.id || null;

      // Update selection state
      setSelectedNodeId(activeNode);

      // If we are in steps mode and a step is selected, allows updating active elements
      if (activeTab === 'steps' && selectedStepIndex !== null) {
        if (activeNode || activeEdge) {
           setSteps(prev => prev.map((step, idx) =>
             idx === selectedStepIndex
               ? { ...step, active_node_id: activeNode || step.active_node_id, active_edge_id: activeEdge || step.active_edge_id }
               : step
           ));
        }
      }
    },
  });

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'packet', animated: false }, eds)),
    [setEdges],
  );

  const onDragStart = (event: React.DragEvent, nodeType: string, icon: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/icon', icon);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const icon = event.dataTransfer.getData('application/reactflow/icon');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${icon.charAt(0).toUpperCase() + icon.slice(1)} Node`, icon },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const handleSlugChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(val);
    setSlugError(null);
    setSlugAvailable(null);

    if (val.length > 2) {
      setCheckingSlug(true);
      try {
        const isAvailable = await checkSlugAvailability(val);
        setSlugAvailable(isAvailable);
        if (!isAvailable) {
          setSlugError('This slug is already taken.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingSlug(false);
      }
    }
  };

  const handleAddStep = () => {
    const newStep: StepInput = {
      order_index: steps.length + 1,
      title: `Step ${steps.length + 1}`,
      content: '',
      active_node_id: null,
      active_edge_id: null
    };
    setSteps([...steps, newStep]);
    setSelectedStepIndex(steps.length); // Select new step
  };

  const handleUpdateStep = (index: number, field: keyof StepInput, value: any) => {
    setSteps(prev => prev.map((step, idx) => idx === index ? { ...step, [field]: value } : step));
  };

  const handleDeleteStep = (index: number) => {
    setSteps(prev => {
        const newSteps = prev.filter((_, idx) => idx !== index);
        // Re-index
        return newSteps.map((s, i) => ({ ...s, order_index: i + 1 }));
    });
    if (selectedStepIndex === index) setSelectedStepIndex(null);
    if (selectedStepIndex !== null && selectedStepIndex > index) setSelectedStepIndex(selectedStepIndex - 1);
  };

  const handleUpdateNodeLabel = (label: string) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: { ...node.data, label },
          };
        }
        return node;
      })
    );
  };

  const handleDeleteNode = () => {
      if (!selectedNodeId) return;
      setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
      setSelectedNodeId(null);
  };

  const handleStepDragStart = (e: React.DragEvent, index: number) => {
    setDraggedStepIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Identify this as a step drag
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'step', index }));
  };

  const handleStepDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleStepDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedStepIndex === null) return;
    if (draggedStepIndex === dropIndex) {
        setDraggedStepIndex(null);
        return;
    }

    const newSteps = [...steps];
    const [removed] = newSteps.splice(draggedStepIndex, 1);
    newSteps.splice(dropIndex, 0, removed);

    const reorderedSteps = newSteps.map((s, i) => ({ ...s, order_index: i + 1 }));
    setSteps(reorderedSteps);

    // Update selection
    if (selectedStepIndex === draggedStepIndex) {
        setSelectedStepIndex(dropIndex);
    } else if (selectedStepIndex !== null) {
        let newSelected = selectedStepIndex;
        if (draggedStepIndex < selectedStepIndex && dropIndex >= selectedStepIndex) {
            newSelected--;
        } else if (draggedStepIndex > selectedStepIndex && dropIndex <= selectedStepIndex) {
            newSelected++;
        }
        setSelectedStepIndex(newSelected);
    }

    setDraggedStepIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Only check availability if slug CHANGED in edit mode or is new
    // If edit mode and slug matches existing slug (no change), it's fine.
    if (!isEditMode && !slugAvailable) {
        setSlugError('Please choose a unique slug.');
        return;
    }

    if (isEditMode && slug !== routeSlug && !slugAvailable) {
       setSlugError('Please choose a unique slug.');
       return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && editingScenarioId) {
        // Update existing scenario
        await updateScenario(editingScenarioId, {
          title,
          slug,
          description,
          difficulty,
          is_public: isPublic,
          flow_data: {
              initialNodes: nodes,
              initialEdges: edges
          },
          // Don't update author_id or created_at
        });

        // Update steps: brute force delete and recreate
        await deleteSteps(editingScenarioId);
        if (steps.length > 0) {
          await createSteps(steps.map(s => ({ ...s, scenario_id: editingScenarioId })));
        }

        setIsModalOpen(false);
        navigate(`/map/${slug}`);
      } else {
        // Create new scenario
        const createdScenario = await createScenario({
          title,
          slug,
          description,
          difficulty,
          is_public: isPublic,
          flow_data: {
              initialNodes: nodes,
              initialEdges: edges
          },
          tags: ['Community'],
          author_id: user.id,
          parent_scenario_id: parentScenarioId
        });

        if (steps.length > 0) {
          await createSteps(steps.map(s => ({ ...s, scenario_id: createdScenario.id })));
        }

        setIsModalOpen(false);
        navigate(`/map/${slug}`);
      }
    } catch (err: any) {
      console.error(err);
      alert('Failed to save scenario: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sidebarCategories = [
    {
      title: 'User / Devices',
      items: [
        { type: 'custom', icon: 'monitor', label: 'Client', Icon: Monitor },
        { type: 'custom', icon: 'smartphone', label: 'Mobile', Icon: Smartphone },
        { type: 'custom', icon: 'tablet', label: 'Tablet', Icon: Tablet },
        { type: 'custom', icon: 'laptop', label: 'Laptop', Icon: Laptop },
      ]
    },
    {
      title: 'Compute',
      items: [
        { type: 'custom', icon: 'server', label: 'Server', Icon: Server },
        { type: 'custom', icon: 'cpu', label: 'Compute', Icon: Cpu },
        { type: 'custom', icon: 'cloud', label: 'Cloud', Icon: Cloud },
      ]
    },
    {
      title: 'Data',
      items: [
        { type: 'custom', icon: 'database', label: 'Database', Icon: Database },
        { type: 'custom', icon: 'harddrive', label: 'Storage', Icon: HardDrive },
      ]
    },
    {
      title: 'Network',
      items: [
        { type: 'custom', icon: 'router', label: 'Load Balancer', Icon: Router },
        { type: 'custom', icon: 'shield', label: 'Firewall', Icon: Shield },
        { type: 'custom', icon: 'globe', label: 'Internet', Icon: Globe },
      ]
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      <Navbar />

      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-zinc-200 flex flex-col z-10 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)]">

            {/* Tabs */}
            <div className="flex border-b border-zinc-200">
                <button
                  onClick={() => setActiveTab('build')}
                  className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'build' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
                >
                    <Layers size={16} />
                    Components
                </button>
                <button
                  onClick={() => setActiveTab('steps')}
                  className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'steps' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
                >
                    <ListOrdered size={16} />
                    Steps ({steps.length})
                </button>
            </div>

            {/* Build Content */}
            {activeTab === 'build' && (
              <>
                {selectedNodeId ? (
                   <div className="flex flex-col h-full animate-fade-in-up">
                      <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                          <h3 className="font-semibold text-sm text-zinc-900 flex items-center gap-2">
                              <MousePointer2 size={16} className="text-indigo-600" />
                              Selected Node
                          </h3>
                          <button
                            onClick={() => setSelectedNodeId(null)}
                            className="text-xs text-zinc-500 hover:text-zinc-900 underline"
                          >
                            Back to list
                          </button>
                      </div>
                      <div className="p-4 space-y-6">
                          <div>
                              <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">Label</label>
                              <input
                                type="text"
                                value={(nodes.find(n => n.id === selectedNodeId)?.data.label as string) || ''}
                                onChange={(e) => handleUpdateNodeLabel(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium"
                              />
                          </div>

                          <div className="pt-4 border-t border-zinc-100">
                              <button
                                onClick={handleDeleteNode}
                                className="w-full btn-pro border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 py-2"
                              >
                                  <Trash2 size={16} />
                                  Delete Node
                              </button>
                          </div>
                      </div>
                   </div>
                ) : (
                  <>
                    <div className="p-4 border-b border-zinc-100">
                        <p className="text-xs text-zinc-500">Drag components to the canvas to build your architecture.</p>
                    </div>
                    <div className="p-4 space-y-6 overflow-y-auto flex-grow">
                        {sidebarCategories.map((category) => (
                            <div key={category.title}>
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">{category.title}</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {category.items.map((item) => (
                                        <div
                                            key={item.icon}
                                            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-zinc-200 bg-white hover:border-indigo-300 hover:shadow-md hover:text-indigo-600 transition-all cursor-grab active:cursor-grabbing group text-center"
                                            onDragStart={(event) => onDragStart(event, item.type, item.icon)}
                                            draggable
                                        >
                                            <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-indigo-50 text-zinc-500 group-hover:text-indigo-600 transition-colors">
                                                <item.Icon size={20} />
                                            </div>
                                            <span className="text-xs font-medium text-zinc-600 group-hover:text-indigo-700">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Steps Content */}
            {activeTab === 'steps' && (
              <div className="flex flex-col h-full overflow-hidden">
                 <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <button
                      onClick={handleAddStep}
                      className="w-full btn-pro btn-secondary py-2 flex items-center justify-center gap-2 text-sm"
                    >
                      <Plus size={14} />
                      Add New Step
                    </button>
                 </div>

                 <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {steps.length === 0 ? (
                      <div className="text-center py-8 text-zinc-400">
                        <ListOrdered size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No steps defined yet.</p>
                      </div>
                    ) : (
                      steps.map((step, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => handleStepDragStart(e, index)}
                          onDragOver={(e) => handleStepDragOver(e)}
                          onDrop={(e) => handleStepDrop(e, index)}
                          className={`border rounded-xl transition-all ${selectedStepIndex === index ? 'border-indigo-600 shadow-sm ring-1 ring-indigo-600 bg-white' : 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-300'} ${draggedStepIndex === index ? 'opacity-50' : ''}`}
                        >
                            <div
                              className="p-3 cursor-pointer flex items-center justify-between"
                              onClick={() => setSelectedStepIndex(index)}
                            >
                                <span className="font-semibold text-sm text-zinc-900 flex items-center gap-2">
                                  <GripVertical size={14} className="text-zinc-400 cursor-grab active:cursor-grabbing" />
                                  <span className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center text-[10px]">{index + 1}</span>
                                  {step.title}
                                </span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteStep(index); }}
                                  className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                >
                                  <Trash2 size={14} />
                                </button>
                            </div>

                            {selectedStepIndex === index && (
                              <div className="p-3 border-t border-zinc-100 bg-white rounded-b-xl space-y-3 animate-fade-in-up">
                                  <input
                                    type="text"
                                    value={step.title}
                                    onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                                    className="w-full px-2 py-1.5 text-sm border border-zinc-200 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                                    placeholder="Step Title"
                                  />
                                  <textarea
                                    value={step.content}
                                    onChange={(e) => handleUpdateStep(index, 'content', e.target.value)}
                                    rows={3}
                                    className="w-full px-2 py-1.5 text-sm border border-zinc-200 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none resize-none"
                                    placeholder="Explanation..."
                                  />

                                  <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-100">
                                      <Target size={14} className={step.active_node_id || step.active_edge_id ? "text-indigo-600" : "text-zinc-400"} />
                                      {step.active_node_id ? (
                                        <span>Target: Node <b>{step.active_node_id}</b></span>
                                      ) : step.active_edge_id ? (
                                        <span>Target: Edge <b>{step.active_edge_id}</b></span>
                                      ) : (
                                        <span>Select a node/edge on canvas to target</span>
                                      )}
                                  </div>
                              </div>
                            )}
                        </div>
                      ))
                    )}
                 </div>
              </div>
            )}

            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 space-y-2">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full btn-pro btn-primary py-2.5 flex items-center justify-center gap-2"
                >
                    <Save size={16} />
                    {isEditMode ? 'Update Scenario' : 'Publish Scenario'}
                </button>
            </div>
        </aside>

        {/* Canvas */}
        <div className="flex-grow h-full relative bg-[#fafafa]" ref={reactFlowWrapper}>
             <ReactFlow
                nodes={nodes.map(n => ({
                  ...n,
                  data: {
                    ...n.data,
                    // Highlight node if active in selected step
                    isActive: activeTab === 'steps' && selectedStepIndex !== null && steps[selectedStepIndex]?.active_node_id === n.id
                  }
                }))}
                edges={edges.map(e => ({
                  ...e,
                  // Highlight edge if active in selected step
                  style: (activeTab === 'steps' && selectedStepIndex !== null && steps[selectedStepIndex]?.active_edge_id === e.id)
                    ? { stroke: '#4f46e5', strokeWidth: 3 }
                    : { stroke: '#e5e7eb', strokeWidth: 1.5 }
                }))}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
            >
                <Background color="#e5e5e5" gap={24} size={1} variant={BackgroundVariant.Dots} />
                <Panel position="bottom-center" className="bg-white p-1 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-1 mb-6">
                    <button onClick={() => zoomOut()} className="p-2 hover:bg-zinc-100 rounded-md text-zinc-600 transition-colors" title="Zoom Out">
                        <ZoomOut size={16} />
                    </button>
                    <button onClick={() => fitView()} className="p-2 hover:bg-zinc-100 rounded-md text-zinc-600 transition-colors" title="Fit View">
                        <Maximize size={16} />
                    </button>
                    <button onClick={() => zoomIn()} className="p-2 hover:bg-zinc-100 rounded-md text-zinc-600 transition-colors" title="Zoom In">
                        <ZoomIn size={16} />
                    </button>
                </Panel>
            </ReactFlow>
        </div>
      </div>

      {/* Publish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <h3 className="font-bold text-lg text-zinc-900">{isEditMode ? 'Update Scenario' : 'Publish Scenario'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Scenario Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g. Microservices Basics"
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Slug (URL)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={slug}
                                onChange={handleSlugChange}
                                required
                                placeholder="microservices-basics"
                                className={`w-full px-3 py-2 rounded-lg border outline-none transition-all text-sm ${
                                    slugError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' :
                                    slugAvailable ? 'border-green-300 focus:border-green-500 focus:ring-green-200' :
                                    'border-zinc-200 focus:border-indigo-500 focus:ring-indigo-200'
                                }`}
                            />
                            {checkingSlug && (
                                <div className="absolute right-3 top-2.5">
                                    <Loader2 size={16} className="animate-spin text-zinc-400" />
                                </div>
                            )}
                        </div>
                        {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
                        {slugAvailable && !slugError && <p className="text-xs text-green-600 mt-1">Slug is available!</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm bg-white"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Tags</label>
                            <div className="px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 text-sm text-zinc-500 flex items-center gap-2 cursor-not-allowed">
                                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold">Community</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            placeholder="Briefly describe what this scenario demonstrates..."
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Visibility</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setIsPublic(true)}
                                className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                                    isPublic
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                                }`}
                            >
                                <Globe size={20} />
                                <div className="text-left">
                                    <div className="text-sm font-bold">Public</div>
                                    <div className="text-xs opacity-80">Visible to everyone</div>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsPublic(false)}
                                className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                                    !isPublic
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                                }`}
                            >
                                <Lock size={20} />
                                <div className="text-left">
                                    <div className="text-sm font-bold">Private</div>
                                    <div className="text-xs opacity-80">Only you can see it</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !!slugError || (slugAvailable === false && slug !== routeSlug)}
                            className="btn-pro btn-primary px-6 py-2 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSubmitting ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update' : 'Publish')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

export default function CreateScenarioWrapper() {
    return (
        <ReactFlowProvider>
            <CreateScenario />
        </ReactFlowProvider>
    )
}
