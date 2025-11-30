import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Monitor, Server, Cpu, Database, Cloud, Smartphone, Tablet, HardDrive, Router, Shield, Globe, Laptop } from 'lucide-react';
import { memo, type ElementType } from 'react';

const icons = {
  monitor: Monitor,
  server: Server,
  cpu: Cpu,
  database: Database,
  cloud: Cloud,
  smartphone: Smartphone,
  tablet: Tablet,
  harddrive: HardDrive,
  router: Router,
  shield: Shield,
  globe: Globe,
  laptop: Laptop
};

const CustomNode = ({ data, selected }: NodeProps) => {
  const Icon = (icons[data.icon as keyof typeof icons] || Server) as ElementType;
  const isActive = !!data.isActive;

  return (
    <div className={`relative min-w-[140px] px-4 py-3 rounded-lg bg-white transition-all duration-300
      ${isActive
        ? 'border-zinc-900 shadow-[0_0_20px_rgba(0,0,0,0.15)] ring-1 ring-zinc-900 scale-105'
        : 'border border-zinc-200 hover:border-zinc-300 shadow-sm'
      }
      ${selected ? 'ring-2 ring-zinc-500 ring-offset-2' : ''}
    `}>
      {/* Target Handles (Inputs) - Top and Left */}
      <Handle type="target" position={Position.Top} id="t-top" className={`w-3 h-3 !bg-zinc-100 !border-2 !border-zinc-400 hover:!bg-indigo-500 hover:!border-indigo-500 transition-all ${isActive ? '!border-zinc-900' : ''} !-top-1.5`} />
      <Handle type="target" position={Position.Left} id="t-left" className={`w-3 h-3 !bg-zinc-100 !border-2 !border-zinc-400 hover:!bg-indigo-500 hover:!border-indigo-500 transition-all ${isActive ? '!border-zinc-900' : ''} !-left-1.5`} />

      <div className="flex flex-col items-center gap-3">
        <div className={`p-2 rounded-md transition-colors duration-300 ${isActive ? 'bg-zinc-100 text-zinc-900' : 'bg-white text-zinc-400'}`}>
           <Icon
             size={20}
             strokeWidth={isActive ? 2 : 1.5}
           />
        </div>
        <span className={`text-xs font-semibold tracking-tight transition-colors duration-300 ${isActive ? 'text-zinc-900' : 'text-zinc-500'}`}>
          {data.label as string}
        </span>
      </div>

      {/* Source Handles (Outputs) - Bottom and Right */}
      <Handle type="source" position={Position.Right} id="s-right" className={`w-3 h-3 !bg-indigo-500 !border-2 !border-white opacity-0 hover:opacity-100 transition-opacity z-10 !-right-1.5`} />
      <Handle type="source" position={Position.Bottom} id="s-bottom" className={`w-3 h-3 !bg-indigo-500 !border-2 !border-white opacity-0 hover:opacity-100 transition-opacity z-10 !-bottom-1.5`} />
    </div>
  );
};

export default memo(CustomNode);
