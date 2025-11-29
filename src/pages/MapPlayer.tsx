import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, type Node, type Edge, BackgroundVariant, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getScenarioBySlug, getSteps, getSingleScenarioProgress, saveUserProgress, getUserFavorites, setFavorite, getProfile, getScenarioById, reportScenario } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import { formatNumber } from '../lib/utils';
import type { Scenario, Step, Profile } from '../types';
import CustomNode from '../components/CustomNode';
import PacketEdge from '../components/PacketEdge';
import MapLegend from '../components/MapLegend';
import { ChevronLeft, ChevronRight, ArrowLeft, RotateCcw, CheckCircle, Heart, Play, Pause, User, GitFork, Flag, BadgeCheck, Edit } from 'lucide-react';
import { checkAchievements } from '../lib/achievements';
import AchievementPopup from '../components/AchievementPopup';
import UserDetailsModal from '../components/UserDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import ReportModal from '../components/ReportModal';
import Reactions from '../components/Reactions';
import type { Achievement } from '../types';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  packet: PacketEdge,
};

function MapPlayerInner() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [parentScenario, setParentScenario] = useState<{ title: string; slug: string } | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [authorProfile, setAuthorProfile] = useState<Profile | null>(null);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { fitView } = useReactFlow();

  useEffect(() => {
    if (slug) {
      getScenarioBySlug(slug)
        .then((data) => {
          if (data) {
            setScenario(data);
            setFavCount(data.favorites_count || 0);
            setNodes(data.flow_data.initialNodes);
            setEdges(data.flow_data.initialEdges);

            // Fetch Author if exists
            if (data.author_id) {
                getProfile(data.author_id).then(setAuthorProfile).catch(console.error);
            }

            // Fetch parent if exists
            if (data.parent_scenario_id) {
                getScenarioById(data.parent_scenario_id).then(parent => {
                    if (parent) {
                        setParentScenario({ title: parent.title, slug: parent.slug });
                    }
                });
            } else {
                setParentScenario(null);
            }

            // Fetch steps and then maybe progress
            getSteps(data.id).then((fetchedSteps) => {
              setSteps(fetchedSteps);

              if (user) {
                // Check for progress
                getSingleScenarioProgress(user.id, data.id).then(progress => {
                   if (progress) {
                     setCurrentStepIndex(progress.current_step_index);
                     setIsCompleted(progress.is_completed);
                   }
                });

                // Check for favorite
                getUserFavorites(user.id).then(favs => {
                    setIsFavorited(favs.includes(data.id));
                });
              }
            });
          } else {
            setError('Scenario not found');
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [slug, setNodes, setEdges, user]);

  const saveProgress = async (index: number, completed: boolean) => {
    if (user && scenario) {
       try {
         await saveUserProgress(user.id, scenario.id, index, completed);
       } catch (err) {
         console.error("Failed to save progress", err);
       }
    }
  };

  const handleNext = useCallback(async () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      saveProgress(nextIndex, false);
    } else {
      setIsCompleted(true);
      setIsPlaying(false);
      await saveProgress(currentStepIndex, true);

      // Check achievements on completion
      if (user) {
        const newAchievements = await checkAchievements(user.id);
        if (newAchievements.length > 0) {
          setUnlockedAchievements(prev => [...prev, ...newAchievements]);
        }
      }
    }
  }, [currentStepIndex, steps.length, user, scenario]); // Added dependencies

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        handleNext();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, handleNext]);


  useEffect(() => {
    if (steps.length > 0 && !isCompleted) {
      const currentStep = steps[currentStepIndex];

      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isActive: node.id === currentStep?.active_node_id
          }
        }))
      );

      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          type: 'packet',
          data: {
            ...edge.data,
            isActive: edge.id === currentStep?.active_edge_id
          },
          animated: false, // controlled by custom edge now
          style: edge.id === currentStep?.active_edge_id
            ? { stroke: '#18181b', strokeWidth: 3 }
            : { stroke: '#e5e7eb', strokeWidth: 1.5 }
        }))
      );

      // Auto-Focus logic
      if (currentStep?.active_node_id) {
        window.requestAnimationFrame(() => {
           fitView({
             nodes: [{ id: currentStep.active_node_id as string }],
             duration: 1000,
             padding: 2, // Keep some context
             maxZoom: 1.5
           });
        });
      }
    }
  }, [currentStepIndex, steps, setNodes, setEdges, isCompleted, fitView]);


  const handlePrev = () => {
    if (isCompleted) {
      setIsCompleted(false);
      return;
    }
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      saveProgress(prevIndex, false);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setIsPlaying(false);
    saveProgress(0, false);
    fitView({ duration: 1000, padding: 0.2 });
  }

  const handleToggleFavorite = async () => {
      if (!user || !scenario || isFavLoading) return;

      const newStatus = !isFavorited;
      setIsFavorited(newStatus); // Optimistic update
      setFavCount(prev => newStatus ? prev + 1 : prev - 1);
      setIsFavLoading(true);

      try {
          await setFavorite(user.id, scenario.id, newStatus);
      } catch (err) {
          console.error("Failed to toggle favorite", err);
          setIsFavorited(!newStatus); // Revert on failure
          setFavCount(prev => !newStatus ? prev + 1 : prev - 1);
      } finally {
          setIsFavLoading(false);
      }
  }

  const handleFork = () => {
      if (!user || !scenario) return;
      setIsForkModalOpen(true);
  }

  const confirmFork = () => {
      if (!scenario) return;
      // Navigate to create page with fork_slug param
      navigate(`/create?fork_slug=${scenario.slug}`);
  }

  const handleReport = async (reason: string, description: string) => {
      if (!user || !scenario) return;
      setIsReporting(true);
      try {
          await reportScenario(scenario.id, reason, description);
          showToast("Report submitted successfully", { type: 'success' });
          setIsReportModalOpen(false);
      } catch (err) {
          console.error("Report failed", err);
          showToast("Failed to submit report", { type: 'error' });
      } finally {
          setIsReporting(false);
      }
  }

  if (error) {
    return (
      <div className="flex h-screen bg-white items-center justify-center p-6">
         <div className="text-center">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Error Loading Scenario</h2>
          <p className="text-zinc-500 mb-6">{error}</p>
          <Link to="/" className="btn-pro btn-secondary px-4 py-2 text-sm">Return Home</Link>
        </div>
      </div>
    );
  }

  if (!scenario) return (
    <div className="flex h-screen bg-white items-center justify-center">
      <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
    </div>
  );

  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex h-screen bg-white overflow-hidden flex-col md:flex-row font-sans relative">
      <UserDetailsModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        user={authorProfile}
      />

      <ConfirmationModal
        isOpen={isForkModalOpen}
        onClose={() => setIsForkModalOpen(false)}
        onConfirm={confirmFork}
        title="Fork Scenario"
        message="Do you want to fork this scenario? This will open the editor with a copy of this scenario for you to modify and publish."
        confirmText="Fork Scenario"
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReport}
        title="Report Scenario"
        isSubmitting={isReporting}
      />

      {/* Achievement Popup */}
      {unlockedAchievements.length > 0 && (
        <AchievementPopup
          title={unlockedAchievements[0].title}
          description={unlockedAchievements[0].description}
          onClose={() => setUnlockedAchievements(prev => prev.slice(1))}
        />
      )}

      {/* Header (Mobile only) */}
      <div className="md:hidden h-14 border-b border-zinc-200 flex items-center px-4 justify-between bg-white z-20">
         <Link to="/" className="text-zinc-500"><ArrowLeft size={20} /></Link>
         <span className="font-bold text-sm">{scenario.title}</span>
         <div />
      </div>

      {/* Canvas Area */}
      <div className="flex-grow h-[50%] md:h-full md:w-[70%] relative bg-[#fafafa]">
        <div className="absolute top-6 left-6 z-10 hidden md:block">
          <Link to="/" className="btn-pro btn-secondary px-3 py-2 text-xs shadow-sm bg-white">
            <ArrowLeft size={14} className="mr-2" /> Back to Home
          </Link>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesDraggable={true}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e5e5e5" gap={24} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-white !border-zinc-200 !shadow-sm !rounded-lg [&>button]:!border-b-zinc-100 hover:[&>button]:!bg-zinc-50 !fill-zinc-700" />
        </ReactFlow>
        <MapLegend />
      </div>

      {/* Sidebar - Pro Tool Panel */}
      <div className="w-full h-[50%] md:h-full md:w-[30%] bg-white border-t md:border-t-0 md:border-l border-zinc-200 flex flex-col z-20 shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)]">

        {/* Scenario Header */}
        <div className="px-4 md:px-6 py-5 border-b border-zinc-100 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
           <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-zinc-900' : 'bg-green-500'}`}></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {isCompleted ? 'Completed' : 'Live Simulation'}
                </span>
              </div>
              <h1 className="text-lg font-bold text-zinc-900 leading-tight">
                {scenario.title}
              </h1>
              {authorProfile && (
                <button
                    onClick={() => setIsAuthorModalOpen(true)}
                    className="flex items-center gap-1.5 mt-1.5 group cursor-pointer"
                >
                    <div className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 border border-zinc-200">
                        <User size={10} />
                    </div>
                    <span className="text-xs text-zinc-500 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                        Created by
                        <span className="font-medium flex items-center gap-1">
                          {authorProfile.first_name || 'Anonymous'}
                          {authorProfile.is_verified && (
                            <BadgeCheck size={14} className="text-blue-500 fill-blue-50" strokeWidth={2.5} />
                          )}
                        </span>
                    </span>
                </button>
              )}
           </div>

           <div className="flex gap-2">
               {/* Autoplay Toggle */}
               {!isCompleted && (
                 <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${isPlaying ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-zinc-100 text-zinc-400'}`}
                    title={isPlaying ? "Pause Autoplay" : "Start Autoplay"}
                 >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                 </button>
               )}

               {/* Favorite Button */}
               {user && (
                 <button
                    onClick={handleToggleFavorite}
                    disabled={isFavLoading}
                    className="flex flex-col items-center pt-2 pb-1 px-2 rounded-xl hover:bg-zinc-100 transition-all flex-shrink-0 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[2.5rem]"
                    title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                 >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 ease-spring ${isFavorited ? 'fill-red-500 text-red-500 scale-110' : 'text-zinc-400 scale-100 group-hover:scale-110'}`}
                    />
                    {favCount > 0 && (
                        <span className={`text-[10px] font-bold leading-none transition-colors ${isFavorited ? 'text-red-500' : 'text-zinc-500'}`}>
                            {formatNumber(favCount)}
                        </span>
                    )}
                 </button>
               )}

               {/* Edit Button */}
               {user && scenario.author_id === user.id && (
                  <Link
                    to={`/edit/${scenario.slug}`}
                    className="p-2 rounded-full hover:bg-zinc-100 transition-all flex-shrink-0 group active:scale-90"
                    title="Edit Scenario"
                  >
                    <Edit className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600" />
                  </Link>
               )}

               {/* Fork Button */}
               {user && (
                  <button
                    onClick={handleFork}
                    className="p-2 rounded-full hover:bg-zinc-100 transition-all flex-shrink-0 group active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Fork this scenario"
                  >
                    <GitFork className="w-5 h-5 text-zinc-400 group-hover:text-zinc-700" />
                  </button>
               )}

               {/* Report Button */}
               {user && (
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="p-2 rounded-full hover:bg-zinc-100 transition-all flex-shrink-0 group active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Report this scenario"
                  >
                    <Flag className="w-5 h-5 text-zinc-300 group-hover:text-red-500" />
                  </button>
               )}
           </div>
        </div>

        {/* Fork Label */}
        {parentScenario && (
             <div className="px-4 md:px-6 pb-2 pt-2 border-b border-zinc-100 bg-zinc-50/50">
                 <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                     <GitFork size={14} className="text-indigo-500" />
                     <span>Forked from</span>
                     <Link to={`/map/${parentScenario.slug}`} className="font-medium text-indigo-600 hover:underline hover:text-indigo-800 transition-colors">
                        {parentScenario.title}
                     </Link>
                 </p>
             </div>
        )}

        {/* Reactions Section (Discreet) */}
        <div className="px-4 md:px-6 pt-2">
            <Reactions scenarioId={scenario.id} />
        </div>

        {/* Step Content */}
        <div className="px-4 md:px-6 py-6 flex-grow overflow-y-auto">
          {isCompleted ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Simulation Complete!</h2>
              <p className="text-zinc-500 text-sm mb-6 max-w-xs mx-auto">
                You have successfully navigated through the entire architecture flow.
              </p>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                 <Link to="/explore" className="btn-pro btn-primary w-full py-2.5">Explore Other Scenarios</Link>
                 <button onClick={handleReset} className="btn-pro btn-secondary w-full py-2.5">Replay Scenario</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                 <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded text-xs font-mono font-medium">
                   Step {currentStepIndex + 1}/{steps.length}
                 </span>
                 <button onClick={handleReset} className="text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer" title="Reset">
                   <RotateCcw size={14} />
                 </button>
              </div>

              <div className="animate-fade-in-up" key={currentStepIndex}>
               {currentStep ? (
                 <>
                   <h2 className="text-xl font-bold text-zinc-900 mb-4">{currentStep.title}</h2>
                   <p className="text-zinc-600 leading-relaxed text-sm mb-8">
                     {currentStep.content}
                   </p>
                 </>
               ) : (
                 <div className="flex flex-col gap-4">
                     <div className="h-6 bg-zinc-100 rounded animate-pulse w-3/4"></div>
                     <div className="h-4 bg-zinc-100 rounded animate-pulse w-full"></div>
                     <div className="h-4 bg-zinc-100 rounded animate-pulse w-2/3"></div>
                 </div>
               )}
              </div>
            </>
          )}
        </div>

        {/* Navigation Controls */}
        {!isCompleted && (
          <div className="p-4 md:p-6 border-t border-zinc-100 bg-zinc-50/50">
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="flex-1 btn-pro btn-secondary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="mr-1" size={16} />
                Previous
              </button>
              <button
                onClick={handleNext}
                className="flex-1 btn-pro btn-primary py-2.5 shadow-sm cursor-pointer"
              >
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next Step'}
                <ChevronRight className="ml-1" size={16} />
              </button>
            </div>

            <div className="mt-4 h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
               <div
                 className="h-full bg-zinc-900 transition-all duration-300 ease-out"
                 style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
               />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapPlayer() {
  return (
    <ReactFlowProvider>
      <MapPlayerInner />
    </ReactFlowProvider>
  );
}
